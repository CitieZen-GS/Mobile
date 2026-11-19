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
          Só o cuidador: assistente e relatórios (API de RAG, familiar recebe 403) e o cadastro
          de familiares (POST /autenticacao/cadastro/parente). Para o familiar essas rotas não
          existem: quem tentar abrir volta para as abas.
        */}
        <Stack.Protected guard={ehCuidador}>
          <Stack.Screen name="familiar/novo" />
          <Stack.Screen name="assistente" />
          <Stack.Screen name="relatorios/index" />
          <Stack.Screen name="relatorios/novo" />
          <Stack.Screen name="relatorios/[id]" />
        </Stack.Protected>
      </Stack>
    </IdosoSelecionadoProvider>
  );
}
