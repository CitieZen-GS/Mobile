import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Relatorio } from '@/types/relatorio';
import { periodoParaTela } from '@/utils/formatadores';
import { SelosRelatorio } from './SelosRelatorio';

interface CartaoRelatorioProps {
  relatorio: Relatorio;
  aoPressionar: () => void;
}

export function CartaoRelatorio({ relatorio, aoPressionar }: CartaoRelatorioProps) {
  const { cores } = useTema();

  return (
    <Cartao aoPressionar={aoPressionar} rotuloAcessivel={`Relatório ${relatorio.titulo}`}>
      <View style={estilos.linha}>
        <View style={[estilos.icone, { backgroundColor: cores.destaqueClaro }]}>
          <Icone nome="document-text" cor={cores.destaque} tamanho={26} />
        </View>
        <View style={estilos.info}>
          <Texto variante="corpoNegrito">{relatorio.titulo}</Texto>
          <Texto variante="legenda" cor="textoSecundario">
            {periodoParaTela(relatorio.dataInicio, relatorio.dataFim)}
          </Texto>
        </View>
        <Icone nome="chevron-forward" cor={cores.textoSuave} />
      </View>
      <SelosRelatorio relatorio={relatorio} />
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  icone: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
});
