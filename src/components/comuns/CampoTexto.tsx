import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { ALTURA_MINIMA_TOQUE, espacos, fontes, raios, tamanhos } from '@/styles/tema';
import { Texto } from './Texto';

interface CampoTextoProps extends TextInputProps {
  rotulo: string;
  erro?: string;
  dica?: string;
}

/** Campo de formulário com rótulo, dica e mensagem de erro de validação. */
export function CampoTexto({ rotulo, erro, dica, multiline, style, ...props }: CampoTextoProps) {
  const { cores } = useTema();

  return (
    <View style={estilos.container}>
      <Texto variante="corpoNegrito">{rotulo}</Texto>
      <TextInput
        accessibilityLabel={rotulo}
        accessibilityHint={erro ?? dica}
        placeholderTextColor={cores.textoSuave}
        multiline={multiline}
        style={[
          estilos.campo,
          {
            backgroundColor: cores.superficie,
            color: cores.texto,
            borderColor: erro ? cores.erro : cores.borda,
          },
          multiline && estilos.multilinha,
          style,
        ]}
        {...props}
      />
      {erro ? (
        <Texto variante="legenda" cor="erro">
          {erro}
        </Texto>
      ) : dica ? (
        <Texto variante="legenda" cor="textoSuave">
          {dica}
        </Texto>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacos.xs },
  campo: {
    minHeight: ALTURA_MINIMA_TOQUE,
    borderWidth: 1.5,
    borderRadius: raios.md,
    paddingHorizontal: espacos.md,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
  multilinha: { minHeight: 96, paddingTop: espacos.sm, textAlignVertical: 'top' },
});
