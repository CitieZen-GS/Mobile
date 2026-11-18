/** DoencaResposta da API Java. */
export interface Doenca {
  id: number;
  nome: string;
  descricao: string | null;
  idIdoso: number;
}
