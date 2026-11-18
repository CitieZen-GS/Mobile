import { useCallback, useState } from 'react';
import { ErrosFormulario, semErros } from '@/utils/validacoes';

/**
 * Estado de formulário reutilizável: valores, erros por campo e erro vindo da API.
 * O erro de um campo some assim que o usuário volta a digitar nele.
 */
export function useFormulario<T extends object>(valoresIniciais: T) {
  const [valores, setValores] = useState<T>(valoresIniciais);
  const [erros, setErros] = useState<ErrosFormulario<T>>({});
  const [erroApi, setErroApi] = useState<string | null>(null);

  const alterar = useCallback(<K extends keyof T>(campo: K, valor: T[K]) => {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }, []);

  /** Aplica a validação; retorna true se o formulário pode ser enviado. */
  const validar = useCallback(
    (regras: (valores: T) => ErrosFormulario<T>) => {
      const novosErros = regras(valores);
      setErros(novosErros);
      return semErros(novosErros);
    },
    [valores],
  );

  return { valores, setValores, erros, alterar, validar, erroApi, setErroApi };
}
