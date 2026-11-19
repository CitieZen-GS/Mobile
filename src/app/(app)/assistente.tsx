import { ReactElement, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { BalaoMensagem } from '@/components/assistente/BalaoMensagem';
import { CampoPergunta } from '@/components/assistente/CampoPergunta';
import { SugestoesPergunta } from '@/components/assistente/SugestoesPergunta';
import {
  Aviso,
  BotaoExcluir,
  Carregando,
  EstadoVazio,
  MensagemErro,
  Tela,
  Texto,
} from '@/components/comuns';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useEnviarPergunta, useHistoricoChat, useLimparChat } from '@/hooks/useChat';
import { useIdoso } from '@/hooks/useIdosos';
import { extrairMensagemErro } from '@/services/api';
import { espacos } from '@/styles/tema';
import { MensagemChat, OrigemPeriodo, PeriodoConsultado } from '@/types/chat';
import { confirmar, mostrarAlerta } from '@/utils/confirmacao';
import { dataApiParaTela, hojeApi, periodoParaTela, separarDataHora } from '@/utils/formatadores';

const ORIGEM_PERIODO: Record<OrigemPeriodo, string> = {
  INFORMADO: 'período escolhido',
  IDENTIFICADO_PELA_IA: 'período da pergunta',
  PADRAO: 'últimos dias',
};

/** Ex.: "Registros de 12/11/2026 a 18/11/2026 (período da pergunta)" */
function descreverPeriodo(periodo: PeriodoConsultado): string {
  return `Registros de ${periodoParaTela(periodo.inicio, periodo.fim)} (${ORIGEM_PERIODO[periodo.origem]})`;
}

const rotuloDoDia = (data: string) => (data === hojeApi() ? 'Hoje' : dataApiParaTela(data));

/**
 * Chat com a IA sobre a rotina do idoso (API de RAG: /idosos/{idIdoso}/chat).
 * A IA responde só com os registros do app; a conversa fica salva e serve de memória.
 * Só o cuidador acessa (rota protegida em (app)/_layout.tsx).
 */
export default function TelaAssistente() {
  const { idIdoso } = useIdosoSelecionado();
  const idoso = useIdoso(idIdoso);
  const historico = useHistoricoChat(idIdoso);
  const enviar = useEnviarPergunta();
  const limpar = useLimparChat();
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const lista = useRef<FlatList<MensagemChat>>(null);

  const mensagens = historico.data ?? [];
  // Mostra a pergunta na tela enquanto a IA responde (ela só entra no histórico depois)
  const perguntaPendente = enviar.isPending ? enviar.variables?.dados.pergunta : undefined;

  const rolarParaFim = () => lista.current?.scrollToEnd({ animated: true });

  const enviarPergunta = async (conteudo: string) => {
    const pergunta = conteudo.trim();
    if (!pergunta || idIdoso === undefined || enviar.isPending) return;
    setErro(null);
    setTexto('');
    try {
      await enviar.mutateAsync({ idIdoso, dados: { pergunta } });
    } catch (falha) {
      // Devolve o texto para o cuidador tentar de novo sem digitar tudo
      setTexto(pergunta);
      setErro(extrairMensagemErro(falha));
    }
  };

  const apagarConversa = async () => {
    if (idIdoso === undefined) return;
    const confirmado = await confirmar(
      'Apagar conversa',
      'As mensagens serão apagadas e o assistente esquecerá o que foi conversado.',
      'Apagar',
    );
    if (!confirmado) return;
    try {
      await limpar.mutateAsync(idIdoso);
      enviar.reset();
      setErro(null);
    } catch (falha) {
      mostrarAlerta('Não foi possível apagar', extrairMensagemErro(falha));
    }
  };

  const renderizarMensagem = ({ item, index }: { item: MensagemChat; index: number }) => {
    const { data, hora } = separarDataHora(item.dataEnvio);
    const anterior = mensagens[index - 1];
    const novoDia = !anterior || separarDataHora(anterior.dataEnvio).data !== data;
    // O período consultado só vem na resposta do POST: aparece na resposta mais recente
    const periodo =
      enviar.data?.resposta.id === item.id ? enviar.data.periodoConsultado : undefined;

    return (
      <View style={estilos.item}>
        {novoDia && (
          <Texto variante="legenda" cor="textoSuave" centralizado>
            {rotuloDoDia(data)}
          </Texto>
        )}
        <BalaoMensagem
          autor={item.autor}
          conteudo={item.conteudo}
          legenda={periodo ? `${hora} · ${descreverPeriodo(periodo)}` : hora}
        />
      </View>
    );
  };

  let conteudo: ReactElement;
  if (idIdoso === undefined) {
    conteudo = (
      <EstadoVazio
        icone="person-outline"
        titulo="Nenhum idoso selecionado"
        descricao="Cadastre ou escolha um idoso na aba Início para conversar com o assistente."
      />
    );
  } else if (historico.isLoading) {
    conteudo = <Carregando mensagem="Carregando a conversa..." />;
  } else if (historico.isError) {
    conteudo = (
      <MensagemErro
        mensagem={extrairMensagemErro(historico.error)}
        aoTentarNovamente={historico.refetch}
      />
    );
  } else {
    conteudo = (
      <>
        <FlatList
          ref={lista}
          data={mensagens}
          keyExtractor={(m) => String(m.id)}
          renderItem={renderizarMensagem}
          style={estilos.lista}
          contentContainerStyle={estilos.conteudoLista}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // Mantém a última mensagem visível ao chegar resposta ou abrir o teclado
          onContentSizeChange={rolarParaFim}
          onLayout={rolarParaFim}
          ListEmptyComponent={
            perguntaPendente ? undefined : <SugestoesPergunta aoEscolher={enviarPergunta} />
          }
          ListFooterComponent={
            perguntaPendente ? (
              <View style={estilos.item}>
                <BalaoMensagem autor="CUIDADOR" conteudo={perguntaPendente} />
                <BalaoMensagem autor="ASSISTENTE" aguardando />
              </View>
            ) : undefined
          }
        />
        {erro && <Aviso mensagem={erro} />}
        <CampoPergunta
          valor={texto}
          aoMudar={setTexto}
          aoEnviar={() => enviarPergunta(texto)}
          enviando={enviar.isPending}
        />
      </>
    );
  }

  return (
    <Tela
      comVoltar
      titulo="Assistente"
      subtitulo={idoso.data ? `Perguntas sobre ${idoso.data.nome}` : undefined}
      rolavel={false}
      acaoDireita={
        mensagens.length > 0 ? (
          <BotaoExcluir aoPressionar={apagarConversa} rotuloAcessivel="Apagar conversa" />
        ) : undefined
      }
    >
      {conteudo}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { flex: 1 },
  conteudoLista: { gap: espacos.md, paddingBottom: espacos.sm, flexGrow: 1 },
  item: { gap: espacos.sm },
});
