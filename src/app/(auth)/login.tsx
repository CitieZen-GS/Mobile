import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CabecalhoMarca } from '@/components/autenticacao/CabecalhoMarca';
import { Aviso, Botao, CampoTexto, Tela, Texto } from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { extrairMensagemErro } from '@/services/api';
import { espacos } from '@/styles/tema';
import { DadosLogin } from '@/types/autenticacao';
import { emailValido, ErrosFormulario, semErros } from '@/utils/validacoes';

function validar({ email, senha }: DadosLogin): ErrosFormulario<DadosLogin> {
  return {
    email: !email.trim()
      ? 'Informe seu e-mail.'
      : !emailValido(email)
        ? 'E-mail em formato inválido.'
        : undefined,
    senha: !senha ? 'Informe sua senha.' : undefined,
  };
}

export default function TelaLogin() {
  const { entrar } = useAutenticacao();
  const [dados, setDados] = useState<DadosLogin>({ email: '', senha: '' });
  const [erros, setErros] = useState<ErrosFormulario<DadosLogin>>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo: keyof DadosLogin, valor: string) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const enviar = async () => {
    const novosErros = validar(dados);
    setErros(novosErros);
    if (!semErros(novosErros)) return;

    setErroApi(null);
    setEnviando(true);
    try {
      // Ao entrar, o guard do layout raiz troca para as telas protegidas
      await entrar({ email: dados.email.trim().toLowerCase(), senha: dados.senha });
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Tela>
      <CabecalhoMarca subtitulo="Cuidar de quem cuidou de nós, juntos." />

      {erroApi && <Aviso mensagem={erroApi} />}

      <CampoTexto
        rotulo="E-mail"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={dados.email}
        onChangeText={(texto) => alterar('email', texto)}
        erro={erros.email}
      />
      <CampoTexto
        rotulo="Senha"
        placeholder="Sua senha"
        senha
        autoComplete="password"
        value={dados.senha}
        onChangeText={(texto) => alterar('senha', texto)}
        erro={erros.senha}
        onSubmitEditing={enviar}
      />

      <Botao titulo="Entrar" icone="log-in-outline" aoPressionar={enviar} carregando={enviando} />

      <View style={estilos.rodape}>
        <Texto cor="textoSecundario">Ainda não tem conta?</Texto>
        <Link href="/cadastro" accessibilityRole="link">
          <Texto variante="corpoNegrito" cor="primaria">
            Criar conta
          </Texto>
        </Link>
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: espacos.xs,
    marginTop: espacos.sm,
  },
});
