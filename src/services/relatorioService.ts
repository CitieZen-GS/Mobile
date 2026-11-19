import { apiRag } from './api';
import { Relatorio, RelatorioRequisicao } from '@/types/relatorio';

export const relatorioService = {
  /** GET /idosos/{idIdoso}/relatorios — mais recentes primeiro, sem o conteúdo */
  async listar(idIdoso: number): Promise<Relatorio[]> {
    const { data } = await apiRag.get<Relatorio[]>(`/idosos/${idIdoso}/relatorios`);
    return data;
  },

  /** GET /idosos/{idIdoso}/relatorios/{id} — com o conteúdo em Markdown quando CONCLUIDO */
  async buscar(idIdoso: number, id: number): Promise<Relatorio> {
    const { data } = await apiRag.get<Relatorio>(`/idosos/${idIdoso}/relatorios/${id}`);
    return data;
  },

  /** POST /idosos/{idIdoso}/relatorios — responde 202 com status GERANDO; a IA gera em segundo plano */
  async solicitar(idIdoso: number, dados: RelatorioRequisicao): Promise<Relatorio> {
    const { data } = await apiRag.post<Relatorio>(`/idosos/${idIdoso}/relatorios`, dados);
    return data;
  },

  /** DELETE /idosos/{idIdoso}/relatorios/{id} */
  async remover(idIdoso: number, id: number): Promise<void> {
    await apiRag.delete(`/idosos/${idIdoso}/relatorios/${id}`);
  },
};
