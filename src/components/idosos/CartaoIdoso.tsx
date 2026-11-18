import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, Selo, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';
import { Idoso } from '@/types/idoso';

interface CartaoIdosoProps {
  idoso: Idoso;
  selecionado?: boolean;
  aoPressionar?: () => void;
}

export function CartaoIdoso({ idoso, selecionado = false, aoPressionar }: CartaoIdosoProps) {
  const { cores } = useTema();

  return (
    <Cartao
      aoPressionar={aoPressionar}
      rotuloAcessivel={`${idoso.nome}, ${idoso.idade ?? ''} anos`}
      estilo={selecionado ? { borderColor: cores.primaria, borderWidth: 2 } : undefined}
    >
      <View style={estilos.linha}>
        <View style={[estilos.avatar, { backgroundColor: cores.destaqueClaro }]}>
          <Texto variante="subtitulo" style={{ color: cores.destaque }}>
            {idoso.nome.charAt(0).toUpperCase()}
          </Texto>
        </View>
        <View style={estilos.info}>
          <Texto variante="subtitulo">{idoso.nome}</Texto>
          <Texto cor="textoSecundario">
            {idoso.idade !== null ? `${idoso.idade} anos` : 'Idade não informada'} · código{' '}
            {idoso.id}
          </Texto>
        </View>
        {aoPressionar && <Icone nome="chevron-forward" cor={cores.textoSuave} />}
      </View>
      {selecionado && <Selo texto="Acompanhando agora" tom="sucesso" />}
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
});
