/**
 * Conversões entre o formato exibido ao usuário e o formato da API.
 * - Tela: datas dd/mm/aaaa, horas hh:mm.
 * - API:  datas aaaa-mm-dd, horas hh:mm (ou hh:mm:ss na resposta).
 */

const somenteDigitos = (texto: string) => texto.replace(/\D/g, '');

/** "2026-11-17" -> "17/11/2026" */
export function dataApiParaTela(data?: string | null): string {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** "17/11/2026" -> "2026-11-17" */
export function dataTelaParaApi(data: string): string {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`;
}

/** Data de hoje no formato da API (fuso local). */
export function hojeApi(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

/** "08:30:00" -> "08:30" */
export function formatarHora(hora?: string | null): string {
  return hora ? hora.slice(0, 5) : '';
}

/** "2026-11-17" -> "Terça-feira, 17 de novembro" (só a primeira letra maiúscula) */
export function dataPorExtenso(dataApi: string): string {
  const [ano, mes, dia] = dataApi.split('-').map(Number);
  const texto = new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Máscara de digitação: "17112026" -> "17/11/2026" */
export function mascararData(texto: string): string {
  const d = somenteDigitos(texto).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Máscara de digitação: "0830" -> "08:30" */
export function mascararHora(texto: string): string {
  const d = somenteDigitos(texto).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

/** Máscara de digitação: "12345678900" -> "123.456.789-00" */
export function mascararCpf(texto: string): string {
  const d = somenteDigitos(texto).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

/** Máscara de digitação: "11987654321" -> "(11) 98765-4321" */
export function mascararTelefone(texto: string): string {
  const d = somenteDigitos(texto).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Converte "1,75" ou "1.75" em número; vazio vira undefined. */
export function textoParaNumero(texto: string): number | undefined {
  const normalizado = texto.replace(',', '.').trim();
  if (!normalizado) return undefined;
  const numero = Number(normalizado);
  return Number.isNaN(numero) ? undefined : numero;
}

/** Remove espaços e transforma texto vazio em undefined (campos opcionais da API). */
export function textoOpcional(texto: string): string | undefined {
  const limpo = texto.trim();
  return limpo ? limpo : undefined;
}
