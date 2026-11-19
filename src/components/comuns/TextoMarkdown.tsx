import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Texto } from './Texto';

/**
 * Converte o negrito (**texto**) em trechos com fonte negrito.
 * Itálico (*texto*) e código (`texto`) aparecem como texto normal.
 */
function trechosDaLinha(linha: string): ReactNode[] {
  return linha.split(/(\*\*[^*]+\*\*)/g).map((trecho, indice) => {
    if (trecho.startsWith('**') && trecho.endsWith('**') && trecho.length > 4) {
      return (
        <Texto key={indice} variante="corpoNegrito">
          {trecho.slice(2, -2)}
        </Texto>
      );
    }
    return trecho.replace(/\*([^*\s][^*]*)\*/g, '$1').replace(/`/g, '');
  });
}

/**
 * Exibe o Markdown gerado pela IA (respostas do chat e relatórios) com os componentes do app,
 * sem biblioteca extra. Cobre o que os prompts da API de RAG pedem: títulos (#, ##, ###),
 * listas (-, *, 1.), negrito, separadores (---) e tabelas simples (cada linha vira "a · b · c").
 */
export function TextoMarkdown({ conteudo }: { conteudo: string }) {
  const { cores } = useTema();
  const linhas = conteudo.replace(/\r/g, '').split('\n');

  const renderizarLinha = (linhaOriginal: string, indice: number) => {
    const linha = linhaOriginal.trim();
    const recuado = linhaOriginal.length - linhaOriginal.trimStart().length >= 2;

    if (!linha) return null;

    const titulo = linha.match(/^(#{1,6})\s+(.*)$/);
    if (titulo) {
      const nivel = titulo[1].length;
      return (
        <Texto
          key={indice}
          variante={nivel === 1 ? 'titulo' : nivel === 2 ? 'subtitulo' : 'corpoNegrito'}
          accessibilityRole="header"
          style={estilos.titulo}
        >
          {trechosDaLinha(titulo[2])}
        </Texto>
      );
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(linha)) {
      return <View key={indice} style={[estilos.separador, { backgroundColor: cores.borda }]} />;
    }

    const item = linha.match(/^([-*•]|\d+[.)])\s+(.*)$/);
    if (item) {
      const marcador = /^\d/.test(item[1]) ? item[1] : '•';
      return (
        <View key={indice} style={[estilos.item, recuado && estilos.recuado]}>
          <Texto cor="primaria" variante="corpoNegrito">
            {marcador}
          </Texto>
          <Texto style={estilos.textoItem}>{trechosDaLinha(item[2])}</Texto>
        </View>
      );
    }

    if (linha.startsWith('|')) {
      // Linha divisória da tabela (|---|---|) não tem conteúdo
      if (/^\|[\s:|-]+\|?$/.test(linha)) return null;
      const celulas = linha
        .split('|')
        .map((celula) => celula.trim())
        .filter(Boolean);
      return <Texto key={indice}>{trechosDaLinha(celulas.join(' · '))}</Texto>;
    }

    return <Texto key={indice}>{trechosDaLinha(linha.replace(/^>\s?/, ''))}</Texto>;
  };

  return <View style={estilos.container}>{linhas.map(renderizarLinha)}</View>;
}

const estilos = StyleSheet.create({
  container: { gap: espacos.xs + 2 },
  titulo: { marginTop: espacos.xs },
  separador: { height: StyleSheet.hairlineWidth, marginVertical: espacos.xs },
  item: { flexDirection: 'row', gap: espacos.sm },
  recuado: { paddingLeft: espacos.md },
  textoItem: { flex: 1 },
});
