import { StyleSheet, View } from 'react-native';
import { Icone, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos } from '@/styles/tema';

interface CabecalhoMarcaProps {
  subtitulo: string;
}

/** Logo + nome do app no topo das telas de login e cadastro. */
export function CabecalhoMarca({ subtitulo }: CabecalhoMarcaProps) {
  const { cores } = useTema();

  return (
    <View style={estilos.container}>
      <View style={[estilos.logo, { backgroundColor: cores.primariaClara }]}>
        <Icone nome="heart" tamanho={44} cor={cores.primaria} />
      </View>
      <Texto variante="tituloGrande" centralizado accessibilityRole="header">
        Ajudante Familiar
      </Texto>
      <Texto cor="textoSecundario" centralizado>
        {subtitulo}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { alignItems: 'center', gap: espacos.sm, marginVertical: espacos.lg },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacos.sm,
  },
});
