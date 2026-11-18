import { Stack } from 'expo-router';
import { IdosoSelecionadoProvider } from '@/contexts/IdosoSelecionadoContext';
import { useTema } from '@/contexts/TemaContext';

/** Telas que exigem login (protegidas pelo guard do layout raiz). */
export default function LayoutAplicativo() {
  const { cores } = useTema();

  return (
    <IdosoSelecionadoProvider>
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}
      />
    </IdosoSelecionadoProvider>
  );
}
