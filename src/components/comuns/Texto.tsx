import { StyleSheet, Text, TextProps } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { CoresTema, fontes, tamanhos } from '@/styles/tema';

type Variante = 'tituloGrande' | 'titulo' | 'subtitulo' | 'corpo' | 'corpoNegrito' | 'legenda';

interface TextoProps extends TextProps {
  variante?: Variante;
  cor?: keyof CoresTema;
  centralizado?: boolean;
}

/** Texto padrão do app: aplica fonte, tamanho e cor do tema. */
export function Texto({
  variante = 'corpo',
  cor = 'texto',
  centralizado = false,
  style,
  ...props
}: TextoProps) {
  const { cores } = useTema();

  return (
    <Text
      style={[
        estilos[variante],
        { color: cores[cor] },
        centralizado && estilos.centralizado,
        style,
      ]}
      {...props}
    />
  );
}

const estilos = StyleSheet.create({
  tituloGrande: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.tituloGrande,
    lineHeight: 38,
  },
  titulo: { fontFamily: fontes.extraNegrito, fontSize: tamanhos.titulo, lineHeight: 31 },
  subtitulo: { fontFamily: fontes.negrito, fontSize: tamanhos.subtitulo, lineHeight: 26 },
  corpo: { fontFamily: fontes.regular, fontSize: tamanhos.corpo, lineHeight: 24 },
  corpoNegrito: { fontFamily: fontes.negrito, fontSize: tamanhos.corpo, lineHeight: 24 },
  legenda: { fontFamily: fontes.media, fontSize: tamanhos.legenda, lineHeight: 20 },
  centralizado: { textAlign: 'center' },
});
