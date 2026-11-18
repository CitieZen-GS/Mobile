export type TipoAlimentacao = 'CAFE_DA_MANHA' | 'ALMOCO' | 'LANCHE_DE_TARDE' | 'JANTAR';

/** AlimentacaoResposta da API Java. */
export interface Alimentacao {
  id: number;
  nome: string;
  tipo: TipoAlimentacao;
  dataConsumo: string;
  horaConsumo: string;
  calorias: number | null;
  preparacao: string | null;
  idIdoso: number;
}
