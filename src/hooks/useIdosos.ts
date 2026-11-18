import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { idosoService } from '@/services/idosoService';
import { IdosoRequisicao } from '@/types/idoso';

export const chavesIdoso = {
  todos: ['idosos'] as const,
  lista: (idCuidador?: number) => ['idosos', 'lista', idCuidador] as const,
  detalhe: (id?: number) => ['idosos', 'detalhe', id] as const,
  resumo: (id?: number, data?: string) => ['idosos', 'resumo', id, data] as const,
};

export function useIdosos(idCuidador?: number, habilitado = true) {
  return useQuery({
    queryKey: chavesIdoso.lista(idCuidador),
    queryFn: () => idosoService.listar(idCuidador),
    enabled: habilitado,
  });
}

export function useIdoso(id?: number) {
  return useQuery({
    queryKey: chavesIdoso.detalhe(id),
    queryFn: () => idosoService.buscar(id as number),
    enabled: id !== undefined,
  });
}

export function useResumoIdoso(id: number | undefined, data: string) {
  return useQuery({
    queryKey: chavesIdoso.resumo(id, data),
    queryFn: () => idosoService.resumo(id as number, data),
    enabled: id !== undefined,
  });
}

/** Cria (sem id) ou atualiza (com id) um idoso. */
export function useSalvarIdoso() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id?: number; dados: IdosoRequisicao }) =>
      id ? idosoService.atualizar(id, dados) : idosoService.criar(dados),
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesIdoso.todos }),
  });
}

export function useRemoverIdoso() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => idosoService.remover(id),
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesIdoso.todos }),
  });
}
