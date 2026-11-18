import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos, raios } from '@/styles/tema';

interface CartaoProps {
  children: ReactNode;
  aoPressionar?: () => void;
  rotuloAcessivel?: string;
  estilo?: ViewStyle;
}

/** Superfície com borda arredondada; vira botão quando recebe aoPressionar. */
export function Cartao({ children, aoPressionar, rotuloAcessivel, estilo }: CartaoProps) {
  const { cores } = useTema();
  const estiloBase = [
    estilos.cartao,
    { backgroundColor: cores.superficie, borderColor: cores.borda },
    estilo,
  ];

  if (!aoPressionar) {
    return <View style={estiloBase}>{children}</View>;
  }

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={({ pressed }) => [estiloBase, pressed && estilos.pressionado]}
    >
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderRadius: raios.lg,
    padding: espacos.md,
    gap: espacos.sm,
  },
  pressionado: { opacity: 0.7 },
});
