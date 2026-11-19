import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recarregarCache } from './cache';
import { chatService } from '@/services/chatService';
import { PerguntaRequisicao } from '@/types/chat';

export const chavesChat = {
  todos: ['chat'] as const,
  historico: (idIdoso?: number) => ['chat', 'historico', idIdoso] as const,
};

export function useHistoricoChat(idIdoso?: number) {
  return useQuery({
    queryKey: chavesChat.historico(idIdoso),
    queryFn: () => chatService.historico(idIdoso as number),
    enabled: idIdoso !== undefined,
  });
}

/**
 * Envia a pergunta. A API grava pergunta e resposta; ao terminar, o histórico é recarregado
 * (a mutação só resolve quando a conversa atualizada já chegou).
 */
export function useEnviarPergunta() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: ({ idIdoso, dados }: { idIdoso: number; dados: PerguntaRequisicao }) =>
      chatService.perguntar(idIdoso, dados),
    onSuccess: () => recarregarCache(clienteQuery, ['chat']),
  });
}

export function useLimparChat() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: (idIdoso: number) => chatService.limpar(idIdoso),
    onSuccess: () => recarregarCache(clienteQuery, ['chat']),
  });
}
