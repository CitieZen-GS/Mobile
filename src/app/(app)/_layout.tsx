import { Stack } from 'expo-router';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { IdosoSelecionadoProvider } from '@/contexts/IdosoSelecionadoContext';
import { useTema } from '@/contexts/TemaContext';

/** Telas que exigem login (protegidas pelo guard do layout raiz). */
export default function LayoutAplicativo() {
  const { cores } = useTema();
  const { ehCuidador } = useAutenticacao();

  return (
    <IdosoSelecionadoProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
        {/* As abas continuam sendo a primeira tela da pilha */}
        <Stack.Screen name="(abas)" />
        {/*
          Assistente e relatórios usam a API de RAG, que só atende o cuidador (familiar recebe 403).
          Para o familiar essas rotas não existem: quem tentar abrir volta para as abas.
        */}
        <Stack.Protected guard={ehCuidador}>
          <Stack.Screen name="assistente" />
          <Stack.Screen name="relatorios/index" />
          <Stack.Screen name="relatorios/novo" />
          <Stack.Screen name="relatorios/[id]" />
        </Stack.Protected>
      </Stack>
    </IdosoSelecionadoProvider>
  );
}
