/** TipoRelatorio da API de RAG: GERAL reúne todos os registros do período. */
export type TipoRelatorio = 'GERAL' | 'MEDICAMENTOS' | 'ALIMENTACAO' | 'ATIVIDADES' | 'CONSULTAS';

/** A IA gera o relatório em segundo plano: GERANDO → CONCLUIDO ou ERRO. */
export type StatusRelatorio = 'GERANDO' | 'CONCLUIDO' | 'ERRO';

/** RelatorioResposta da API de RAG. */
export interface Relatorio {
  id: number;
  idIdoso: number;
  tipo: TipoRelatorio;
  titulo: string;
  solicitacao: string | null;
  dataInicio: string;
  dataFim: string;
  status: StatusRelatorio;
  /** Texto em Markdown. Nulo enquanto GERANDO e nas listagens. */
  conteudo: string | null;
  /** Motivo, quando status = ERRO. */
  erro: string | null;
  dataCriacao: string;
  dataConclusao: string | null;
}

/** RelatorioRequisicao (POST /idosos/{idIdoso}/relatorios). */
export interface RelatorioRequisicao {
  tipo: TipoRelatorio;
  dataInicio: string;
  /** No máximo 90 dias depois de dataInicio. */
  dataFim: string;
  /** Opcional: sem título, a API cria um automático. */
  titulo?: string;
  /** Opcional: instrução livre para a IA. */
  solicitacao?: string;
}
