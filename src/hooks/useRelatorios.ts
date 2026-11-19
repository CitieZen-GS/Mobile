import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ehDoRegistroExcluido, recarregarCache } from './cache';
import { relatorioService } from '@/services/relatorioService';
import { RelatorioRequisicao } from '@/types/relatorio';

/** Enquanto a IA gera um relatório (status GERANDO), a tela consulta a API de novo neste intervalo. */
const INTERVALO_ATUALIZACAO_MS = 3000;

export const chavesRelatorio = {
  todos: ['relatorios'] as const,
  lista: (idIdoso?: number) => ['relatorios', 'lista', idIdoso] as const,
  detalhe: (id?: number, idIdoso?: number) => ['relatorios', 'detalhe', id, idIdoso] as const,
};

export function useRelatorios(idIdoso?: number) {
  return useQuery({
    queryKey: chavesRelatorio.lista(idIdoso),
    queryFn: () => relatorioService.listar(idIdoso as number),
    enabled: idIdoso !== undefined,
    // Atualiza sozinha até nenhum relatório estar mais em geração
    refetchInterval: (consulta) =>
      consulta.state.data?.some((r) => r.status === 'GERANDO') ? INTERVALO_ATUALIZACAO_MS : false,
  });
}

export function useRelatorio(id?: number, idIdoso?: number) {
  return useQuery({
    queryKey: chavesRelatorio.detalhe(id, idIdoso),
    queryFn: () => relatorioService.buscar(idIdoso as number, id as number),
    enabled: id !== undefined && idIdoso !== undefined,
    // Consulta até o status virar CONCLUIDO ou ERRO
    refetchInterval: (consulta) =>
      consulta.state.data?.status === 'GERANDO' ? INTERVALO_ATUALIZACAO_MS : false,
  });
}

export function useSolicitarRelatorio() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: ({ idIdoso, dados }: { idIdoso: number; dados: RelatorioRequisicao }) =>
      relatorioService.solicitar(idIdoso, dados),
    onSuccess: () => recarregarCache(clienteQuery, ['relatorios']),
  });
}

export function useRemoverRelatorio() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: ({ idIdoso, id }: { idIdoso: number; id: number }) =>
      relatorioService.remover(idIdoso, id),
    onSuccess: (_resposta, { id }) =>
      recarregarCache(clienteQuery, ['relatorios'], ehDoRegistroExcluido(id)),
  });
}
