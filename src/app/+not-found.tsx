import { Redirect } from 'expo-router';

/**
 * Rota inexistente ou bloqueada pelo login (ex.: abrir /medicamentos sem sessão):
 * volta para "/", que decide entre o Início e o login.
 */
export default function RotaNaoEncontrada() {
  return <Redirect href="/" />;
}
