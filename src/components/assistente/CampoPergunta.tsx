import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icone } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { ALTURA_MINIMA_TOQUE, espacos, fontes, raios, tamanhos } from '@/styles/tema';

/** Mesmo limite do @Size(max = 2000) da PerguntaRequisicao na API de RAG. */
const TAMANHO_MAXIMO_PERGUNTA = 2000;

interface CampoPerguntaProps {
  valor: string;
  aoMudar: (texto: string) => void;
  aoEnviar: () => void;
  enviando: boolean;
}

/** Caixa de digitação do chat com o botão de enviar. */
export function CampoPergunta({ valor, aoMudar, aoEnviar, enviando }: CampoPerguntaProps) {
  const { cores } = useTema();
  const podeEnviar = valor.trim().length > 0 && !enviando;

  return (
    <View style={estilos.linha}>
      <TextInput
        value={valor}
        onChangeText={aoMudar}
        placeholder="Escreva sua pergunta..."
        placeholderTextColor={cores.textoSuave}
        accessibilityLabel="Pergunta para o assistente"
        multiline
        maxLength={TAMANHO_MAXIMO_PERGUNTA}
        style={[
          estilos.campo,
          { backgroundColor: cores.superficie, color: cores.texto, borderColor: cores.borda },
        ]}
      />
      <Pressable
        onPress={aoEnviar}
        disabled={!podeEnviar}
        accessibilityRole="button"
        accessibilityLabel="Enviar pergunta"
        accessibilityState={{ disabled: !podeEnviar, busy: enviando }}
        style={({ pressed }) => [
          estilos.botao,
          { backgroundColor: cores.primaria },
          (pressed || !podeEnviar) && estilos.inativo,
        ]}
      >
        {enviando ? (
          <ActivityIndicator color={cores.textoSobrePrimaria} />
        ) : (
          <Icone nome="send" cor={cores.textoSobrePrimaria} />
        )}
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacos.sm,
    paddingBottom: espacos.md,
  },
  campo: {
    flex: 1,
    minHeight: ALTURA_MINIMA_TOQUE,
    maxHeight: 140,
    borderWidth: 1.5,
    borderRadius: raios.md,
    paddingHorizontal: espacos.md,
    paddingTop: 14,
    paddingBottom: 14,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    textAlignVertical: 'top',
  },
  botao: {
    width: ALTURA_MINIMA_TOQUE,
    height: ALTURA_MINIMA_TOQUE,
    borderRadius: ALTURA_MINIMA_TOQUE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inativo: { opacity: 0.5 },
});
