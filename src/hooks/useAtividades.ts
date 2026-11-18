import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chavesIdoso } from './useIdosos';
import { atividadeService } from '@/services/atividadeService';
import { AtividadeRequisicao } from '@/types/atividade';

export const chavesAtividade = {
  todos: ['atividades'] as const,
  lista: (idIdoso?: number, data?: string) => ['atividades', 'lista', idIdoso, data] as const,
  detalhe: (id?: number) => ['atividades', 'detalhe', id] as const,
};

export function useAtividades(idIdoso?: number, data?: string) {
  return useQuery({
    queryKey: chavesAtividade.lista(idIdoso, data),
    queryFn: () => atividadeService.listar(idIdoso as number, data),
    enabled: idIdoso !== undefined,
  });
}

export function useAtividade(id?: number) {
  return useQuery({
    queryKey: chavesAtividade.detalhe(id),
    queryFn: () => atividadeService.buscar(id as number),
    enabled: id !== undefined,
  });
}

/** Após qualquer alteração, atualiza a lista e o resumo do dia. */
function useInvalidarAtividades() {
  const clienteQuery = useQueryClient();
  return () => {
    clienteQuery.invalidateQueries({ queryKey: chavesAtividade.todos });
    clienteQuery.invalidateQueries({ queryKey: chavesIdoso.todos });
  };
}

export function useSalvarAtividade() {
  const invalidar = useInvalidarAtividades();
  return useMutation({
    mutationFn: ({
      id,
      idIdoso,
      dados,
    }: {
      id?: number;
      idIdoso: number;
      dados: AtividadeRequisicao;
    }) => (id ? atividadeService.atualizar(id, dados) : atividadeService.criar(idIdoso, dados)),
    onSuccess: invalidar,
  });
}

export function useRemoverAtividade() {
  const invalidar = useInvalidarAtividades();
  return useMutation({
    mutationFn: (id: number) => atividadeService.remover(id),
    onSuccess: invalidar,
  });
}
