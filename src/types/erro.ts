/** ErroResposta padronizada pelo TratadorDeErros da API Java. */
export interface ErroRespostaApi {
  momento: string;
  status: number;
  erro: string;
  mensagem: string;
  caminho: string;
  campos: { campo: string; mensagem: string }[];
}
