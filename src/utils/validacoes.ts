/**
 * Validações dos formulários. Seguem as mesmas regras do Bean Validation da API
 * (@NotBlank, @Size, @Past, padrões de data/hora), para o usuário ver o erro antes de enviar.
 */

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Aceita dd/mm/aaaa com dia/mês reais (ex.: rejeita 31/02/2026). */
export function dataValida(data: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return false;
  const [dia, mes, ano] = data.split('/').map(Number);
  const objeto = new Date(ano, mes - 1, dia);
  return objeto.getFullYear() === ano && objeto.getMonth() === mes - 1 && objeto.getDate() === dia;
}

/** true se a data (dd/mm/aaaa) for anterior a hoje. */
export function dataNoPassado(data: string): boolean {
  const [dia, mes, ano] = data.split('/').map(Number);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return new Date(ano, mes - 1, dia) < hoje;
}

/** true se a data (dd/mm/aaaa) for depois de hoje. */
export function dataNoFuturo(data: string): boolean {
  const [dia, mes, ano] = data.split('/').map(Number);
  const hoje = new Date();
  hoje.setHours(23, 59, 59, 999);
  return new Date(ano, mes - 1, dia) > hoje;
}

/** Aceita hh:mm entre 00:00 e 23:59. */
export function horaValida(hora: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

export function cpfFormatoValido(cpf: string): boolean {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

export type ErrosFormulario<T> = Partial<Record<keyof T, string>>;

/** true se o objeto de erros não tiver nenhuma mensagem. */
export function semErros<T>(erros: ErrosFormulario<T>): boolean {
  return Object.values(erros).every((mensagem) => !mensagem);
}
