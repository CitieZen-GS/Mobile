import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Texto, TextoMarkdown } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos, raios } from '@/styles/tema';
import { AutorMensagem } from '@/types/chat';

interface BalaoMensagemProps {
  autor: AutorMensagem;
  /** Texto da mensagem. As respostas do assistente vêm em Markdown. */
  conteudo?: string;
  /** Linha pequena abaixo do balão (hora do envio, período consultado). */
  legenda?: string;
  /** Mostra o indicador de "consultando" no lugar do texto (resposta da IA a caminho). */
  aguardando?: boolean;
}

/** Balão do chat: perguntas do cuidador à direita, respostas do assistente à esquerda. */
export function BalaoMensagem({
  autor,
  conteudo = '',
  legenda,
  aguardando = false,
}: BalaoMensagemProps) {
  const { cores } = useTema();
  const doCuidador = autor === 'CUIDADOR';

  let corpo;
  if (aguardando) {
    corpo = (
      <View style={estilos.aguardando} accessibilityLiveRegion="polite">
        <ActivityIndicator color={cores.primaria} />
        <Texto cor="textoSecundario">Consultando os registros...</Texto>
      </View>
    );
  } else if (doCuidador) {
    corpo = <Texto style={{ color: cores.textoSobrePrimaria }}>{conteudo}</Texto>;
  } else {
    corpo = <TextoMarkdown conteudo={conteudo} />;
  }

  return (
    <View style={[estilos.linha, doCuidador ? estilos.direita : estilos.esquerda]}>
      <View
        accessible
        accessibilityLabel={doCuidador ? `Você perguntou: ${conteudo}` : undefined}
        style={[
          estilos.balao,
          doCuidador
            ? [estilos.balaoCuidador, { backgroundColor: cores.primaria }]
            : [
                estilos.balaoAssistente,
                { backgroundColor: cores.superficie, borderColor: cores.borda },
              ],
        ]}
      >
        {corpo}
      </View>
      {legenda ? (
        <Texto variante="legenda" cor="textoSuave">
          {legenda}
        </Texto>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { gap: espacos.xs },
  direita: { alignItems: 'flex-end' },
  esquerda: { alignItems: 'flex-start' },
  balao: {
    maxWidth: '88%',
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm + 2,
    borderRadius: raios.lg,
  },
  balaoCuidador: { borderBottomRightRadius: raios.sm / 2 },
  balaoAssistente: { borderWidth: 1, borderBottomLeftRadius: raios.sm / 2 },
  aguardando: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
});
