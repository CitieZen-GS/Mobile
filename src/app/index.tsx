import { Redirect } from 'expo-router';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';

/**
 * Rota inicial pública ("/"): leva para o Início se houver sessão, ou para o login.
 * Fica fora dos grupos protegidos para que "/" sempre exista, logado ou não.
 */
export default function RotaInicial() {
  const { logado } = useAutenticacao();
  return <Redirect href={logado ? '/inicio' : '/login'} />;
}
