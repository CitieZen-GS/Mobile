import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';

/** Perguntas prontas: a IA identifica o período ("hoje", "ontem", "última semana") na própria pergunta. */
const SUGESTOES = [
  'O que foi registrado hoje?',
  'Como foi a alimentação ontem?',
  'Quais são as próximas consultas?',
  'Faça um resumo da última semana',
];

interface SugestoesPerguntaProps {
  aoEscolher: (pergunta: string) => void;
}

/** Conversa vazia: explica o que o assistente faz e oferece perguntas prontas. */
export function SugestoesPergunta({ aoEscolher }: SugestoesPerguntaProps) {
  const { cores } = useTema();

  return (
    <View style={estilos.container}>
      <Cartao>
        <View style={estilos.linha}>
          <Icone nome="sparkles" cor={cores.primaria} tamanho={26} />
          <Texto variante="subtitulo">Como posso ajudar?</Texto>
        </View>
        <Texto cor="textoSecundario">
          Pergunte sobre os remédios, as refeições, as atividades e as consultas registrados no app.
          O assistente responde só com esses registros e não substitui a orientação médica.
        </Texto>
      </Cartao>

      <Texto variante="corpoNegrito">Experimente perguntar</Texto>
      {SUGESTOES.map((sugestao) => (
        <Cartao
          key={sugestao}
          aoPressionar={() => aoEscolher(sugestao)}
          rotuloAcessivel={`Perguntar: ${sugestao}`}
        >
          <View style={estilos.linha}>
            <Icone nome="chatbubble-ellipses-outline" cor={cores.primaria} />
            <Texto style={estilos.texto}>{sugestao}</Texto>
          </View>
        </Cartao>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacos.md },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  texto: { flex: 1 },
});
