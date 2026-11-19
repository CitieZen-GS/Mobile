import { useMutation } from '@tanstack/react-query';
import { autenticacaoService } from '@/services/autenticacaoService';
import { DadosCadastroFamiliar } from '@/types/autenticacao';

/** Cuidador cria o acesso de um familiar (POST /autenticacao/cadastro/parente). */
export function useCadastrarFamiliar() {
  return useMutation({
    mutationFn: (dados: DadosCadastroFamiliar) => autenticacaoService.cadastrarFamiliar(dados),
  });
}
