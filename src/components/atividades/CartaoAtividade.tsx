import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, Selo, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Atividade } from '@/types/atividade';
import { dataApiParaTela, formatarHora, hojeApi } from '@/utils/formatadores';

interface CartaoAtividadeProps {
  atividade: Atividade;
  aoPressionar: () => void;
}

function periodo(atividade: Atividade): string {
  const inicio = formatarHora(atividade.horaInicio);
  const fim = formatarHora(atividade.horaFim);
  if (inicio && fim) return `${inicio} às ${fim}`;
  if (inicio) return `A partir das ${inicio}`;
  return 'Horário livre';
}

export function CartaoAtividade({ atividade, aoPressionar }: CartaoAtividadeProps) {
  const { cores } = useTema();
  const ehHoje = atividade.data === hojeApi();

  return (
    <Cartao aoPressionar={aoPressionar} rotuloAcessivel={`Atividade ${atividade.nome}`}>
      <View style={estilos.linha}>
        <View style={[estilos.icone, { backgroundColor: cores.sucessoClaro }]}>
          <Icone nome="walk" cor={cores.sucesso} tamanho={26} />
        </View>
        <View style={estilos.info}>
          <Texto variante="subtitulo">{atividade.nome}</Texto>
          <Texto cor="textoSecundario">{periodo(atividade)}</Texto>
        </View>
        <Icone nome="chevron-forward" cor={cores.textoSuave} />
      </View>
      {atividade.descricao && <Texto variante="legenda">{atividade.descricao}</Texto>}
      <Selo
        texto={ehHoje ? 'Hoje' : dataApiParaTela(atividade.data)}
        tom={ehHoje ? 'sucesso' : 'primario'}
      />
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
  info: { flex: 1 },
});
