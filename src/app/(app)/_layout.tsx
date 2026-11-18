import { Stack } from 'expo-router';
import { useTema } from '@/contexts/TemaContext';

/** Telas que exigem login (protegidas pelo guard do layout raiz). */
export default function LayoutAplicativo() {
  const { cores } = useTema();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }} />
  );
}
