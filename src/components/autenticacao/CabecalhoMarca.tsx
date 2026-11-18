import { Image, StyleSheet, View } from 'react-native';
import { Texto } from '@/components/comuns';
import { espacos } from '@/styles/tema';

const LOGO = require('../../../assets/images/logo.png');

interface CabecalhoMarcaProps {
  subtitulo: string;
}

/** Logo + nome do app no topo das telas de login e cadastro. */
export function CabecalhoMarca({ subtitulo }: CabecalhoMarcaProps) {
  return (
    <View style={estilos.container}>
      <Image
        source={LOGO}
        style={estilos.logo}
        accessibilityIgnoresInvertColors
        accessible
        accessibilityLabel="Logo do Ajudante Familiar: um coração grande protegendo um menor"
      />
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
  logo: { width: 112, height: 112, marginBottom: espacos.sm },
});
