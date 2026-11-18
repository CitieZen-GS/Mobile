import { Pressable, StyleSheet, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { ALTURA_MINIMA_TOQUE, espacos, raios } from '@/styles/tema';
import { Texto } from './Texto';

export interface Opcao<T extends string> {
  valor: T;
  rotulo: string;
}

interface SeletorOpcoesProps<T extends string> {
  rotulo?: string;
  opcoes: Opcao<T>[];
  valor: T | undefined;
  aoMudar: (valor: T) => void;
  erro?: string;
}

/** Grupo de opções em "pílulas" (escolha única), usado para enums da API. */
export function SeletorOpcoes<T extends string>({
  rotulo,
  opcoes,
  valor,
  aoMudar,
  erro,
}: SeletorOpcoesProps<T>) {
  const { cores } = useTema();

  return (
    <View style={estilos.container}>
      {rotulo && <Texto variante="corpoNegrito">{rotulo}</Texto>}
      <View style={estilos.opcoes} accessibilityRole="radiogroup">
        {opcoes.map((opcao) => {
          const selecionada = opcao.valor === valor;
          return (
            <Pressable
              key={opcao.valor}
              onPress={() => aoMudar(opcao.valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selecionada }}
              style={[
                estilos.opcao,
                {
                  backgroundColor: selecionada ? cores.primaria : cores.superficie,
                  borderColor: selecionada ? cores.primaria : cores.borda,
                },
              ]}
            >
              <Texto
                variante="corpoNegrito"
                style={{ color: selecionada ? cores.textoSobrePrimaria : cores.texto }}
              >
                {opcao.rotulo}
              </Texto>
            </Pressable>
          );
        })}
      </View>
      {erro && (
        <Texto variante="legenda" cor="erro">
          {erro}
        </Texto>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacos.xs },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
  opcao: {
    minHeight: ALTURA_MINIMA_TOQUE - 8,
    paddingHorizontal: espacos.md,
    borderRadius: raios.pilula,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
});
