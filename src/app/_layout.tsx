import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AutenticacaoProvider, useAutenticacao } from '@/contexts/AutenticacaoContext';
import { TemaProvider, useTema } from '@/contexts/TemaContext';

// Mantém a splash na tela até as fontes e a sessão salva carregarem
SplashScreen.preventAutoHideAsync();

const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 30 },
  },
});

/**
 * Navegação raiz com rotas protegidas:
 * - sem sessão: só (auth) — login e cadastro;
 * - com sessão: só (app) — o restante do aplicativo.
 * Ao fazer logout, o guard muda e o usuário volta automaticamente para o login.
 */
function NavegacaoRaiz({ fontesProntas }: { fontesProntas: boolean }) {
  const { cores, escuro } = useTema();
  const { logado, carregandoSessao } = useAutenticacao();
  const pronto = fontesProntas && !carregandoSessao;

  useEffect(() => {
    if (pronto) {
      SplashScreen.hideAsync();
    }
  }, [pronto]);

  if (!pronto) {
    return null;
  }

  return (
    <>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
        {/* "/" sempre existe e redireciona conforme a sessão (src/app/index.tsx) */}
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
        <Stack.Protected guard={logado}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!logado}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function LayoutRaiz() {
  const [fontesCarregadas, erroFontes] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  return (
    <QueryClientProvider client={clienteQuery}>
      <TemaProvider>
        <AutenticacaoProvider>
          <NavegacaoRaiz fontesProntas={fontesCarregadas || Boolean(erroFontes)} />
        </AutenticacaoProvider>
      </TemaProvider>
    </QueryClientProvider>
  );
}
