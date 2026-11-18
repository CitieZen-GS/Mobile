import { Stack } from 'expo-router';
import { useTema } from '@/contexts/TemaContext';

/** Telas públicas (sem login): login e cadastro. */
export default function LayoutAutenticacao() {
  const { cores } = useTema();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}
