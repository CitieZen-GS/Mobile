import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Aviso,
  Botao,
  BotaoExcluir,
  Carregando,
  Cartao,
  MensagemErro,
  Tela,
  Texto,
  TextoMarkdown,
} from '@/components/comuns';
import { SelosRelatorio } from '@/components/relatorios/SelosRelatorio';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useRelatorio, useRemoverRelatorio, useSolicitarRelatorio } from '@/hooks/useRelatorios';
import { extrairMensagemErro } from '@/services/api';
import { confirmar } from '@/utils/confirmacao';
import { dataHoraApiParaTela, periodoParaTela } from '@/utils/formatadores';

/**
 * Leitura e exclusão de um relatório (GET/DELETE /idosos/{idIdoso}/relatorios/{id}).
 * Enquanto o status for GERANDO, a tela consulta a API de novo a cada poucos segundos.
 */
export default function TelaRelatorio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idRelatorio = Number(id);
  const { idIdoso } = useIdosoSelecionado();
  const relatorio = useRelatorio(idRelatorio, idIdoso);
  const remover = useRemoverRelatorio();
  const solicitar = useSolicitarRelatorio();
  const [erroApi, setErroApi] = useState<string | null>(null);

  if (relatorio.isLoading || relatorio.isError || !relatorio.data || idIdoso === undefined) {
    return (
      <Tela comVoltar titulo="Relatório">
        {relatorio.isError ? (
          <MensagemErro
            mensagem={extrairMensagemErro(relatorio.error)}
            aoTentarNovamente={relatorio.refetch}
          />
        ) : (
          <Carregando />
        )}
      </Tela>
    );
  }

  const r = relatorio.data;

  const excluir = async () => {
    const confirmado = await confirmar('Excluir relatório', `Deseja excluir "${r.titulo}"?`);
    if (!confirmado) return;
    try {
      await remover.mutateAsync({ idIdoso, id: r.id });
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  /** Quando a geração falhou: pede um relatório igual e abre o novo no lugar deste. */
  const pedirNovamente = async () => {
    setErroApi(null);
    try {
      const novo = await solicitar.mutateAsync({
        idIdoso,
        dados: {
          tipo: r.tipo,
          dataInicio: r.dataInicio,
          dataFim: r.dataFim,
          titulo: r.titulo,
          solicitacao: r.solicitacao ?? undefined,
        },
      });
      router.replace({ pathname: '/relatorios/[id]', params: { id: String(novo.id) } });
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  return (
    <Tela
      comVoltar
      titulo="Relatório"
      acaoDireita={<BotaoExcluir aoPressionar={excluir} rotuloAcessivel="Excluir relatório" />}
      aoAtualizar={() => void relatorio.refetch()}
      atualizando={relatorio.isRefetching && r.status !== 'GERANDO'}
    >
      {erroApi && <Aviso mensagem={erroApi} />}

      <Cartao>
        <Texto variante="subtitulo">{r.titulo}</Texto>
        <Texto cor="textoSecundario">{periodoParaTela(r.dataInicio, r.dataFim)}</Texto>
        <SelosRelatorio relatorio={r} />
        {r.solicitacao && (
          <Texto variante="legenda" cor="textoSecundario">
            Pedido: {r.solicitacao}
          </Texto>
        )}
      </Cartao>

      {r.status === 'GERANDO' && (
        <Carregando mensagem="A IA está escrevendo o relatório. Isso leva alguns segundos..." />
      )}

      {r.status === 'ERRO' && (
        <>
          <Aviso mensagem={r.erro ?? 'Não foi possível gerar o relatório.'} />
          <Botao
            titulo="Pedir novamente"
            icone="refresh"
            variante="secundario"
            aoPressionar={pedirNovamente}
            carregando={solicitar.isPending}
          />
        </>
      )}

      {r.status === 'CONCLUIDO' && r.conteudo && (
        <>
          <Cartao>
            <TextoMarkdown conteudo={r.conteudo} />
          </Cartao>
          <Texto variante="legenda" cor="textoSuave" centralizado>
            Gerado em {dataHoraApiParaTela(r.dataConclusao ?? r.dataCriacao)} a partir dos registros
            do app. Não substitui a avaliação médica.
          </Texto>
        </>
      )}
    </Tela>
  );
}
