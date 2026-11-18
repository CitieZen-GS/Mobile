import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { ALTURA_MINIMA_TOQUE, espacos, fontes, raios, tamanhos } from '@/styles/tema';
import { Icone } from './Icone';
import { Texto } from './Texto';

interface CampoTextoProps extends TextInputProps {
  rotulo: string;
  erro?: string;
  dica?: string;
  /** Campo de senha com botão de mostrar/ocultar. */
  senha?: boolean;
}

/** Campo de formulário com rótulo, dica e mensagem de erro de validação. */
export function CampoTexto({
  rotulo,
  erro,
  dica,
  senha = false,
  multiline,
  style,
  ...props
}: CampoTextoProps) {
  const { cores } = useTema();
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <View style={estilos.container}>
      <Texto variante="corpoNegrito">{rotulo}</Texto>
      <View>
        <TextInput
          accessibilityLabel={rotulo}
          accessibilityHint={erro ?? dica}
          placeholderTextColor={cores.textoSuave}
          multiline={multiline}
          secureTextEntry={senha && !senhaVisivel}
          autoCapitalize={senha ? 'none' : props.autoCapitalize}
          style={[
            estilos.campo,
            {
              backgroundColor: cores.superficie,
              color: cores.texto,
              borderColor: erro ? cores.erro : cores.borda,
            },
            multiline && estilos.multilinha,
            senha && estilos.comIcone,
            style,
          ]}
          {...props}
        />
        {senha && (
          <Pressable
            onPress={() => setSenhaVisivel((visivel) => !visivel)}
            accessibilityRole="button"
            accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            style={estilos.botaoOlho}
          >
            <Icone
              nome={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              cor={cores.textoSecundario}
            />
          </Pressable>
        )}
      </View>
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
  comIcone: { paddingRight: 52 },
  botaoOlho: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
