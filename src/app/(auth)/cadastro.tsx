import { useState } from 'react';
import { CabecalhoMarca } from '@/components/autenticacao/CabecalhoMarca';
import { Aviso, Botao, CampoTexto, Tela, Texto } from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useFormulario } from '@/hooks/useFormulario';
import { extrairMensagemErro } from '@/services/api';
import { mascararCpf, textoOpcional } from '@/utils/formatadores';
import { cpfFormatoValido, emailValido, ErrosFormulario } from '@/utils/validacoes';

interface FormularioCadastro {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
}

const TAMANHO_MINIMO_SENHA = 6;

/** Mesmas regras do CadastroCuidadorRequisicao da API de autenticação. */
function regras(f: FormularioCadastro): ErrosFormulario<FormularioCadastro> {
  return {
    nome: !f.nome.trim() ? 'Informe seu nome.' : undefined,
    cpf: f.cpf && !cpfFormatoValido(f.cpf) ? 'CPF incompleto.' : undefined,
    email: !f.email.trim()
      ? 'Informe seu e-mail.'
      : !emailValido(f.email)
        ? 'E-mail em formato inválido.'
        : undefined,
    senha:
      f.senha.length < TAMANHO_MINIMO_SENHA
        ? `A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`
        : undefined,
    confirmacaoSenha: f.confirmacaoSenha !== f.senha ? 'As senhas não conferem.' : undefined,
  };
}

/**
 * Criação de conta do cuidador (POST /autenticacao/cadastro/cuidador).
 * O cuidador é o dono da conta: depois cadastra os idosos e cria o acesso dos familiares.
 */
export default function TelaCadastro() {
  const { cadastrar } = useAutenticacao();
  const { valores, erros, alterar, validar, erroApi, setErroApi } =
    useFormulario<FormularioCadastro>({
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      confirmacaoSenha: '',
    });
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (!validar(regras)) return;
    setErroApi(null);
    setEnviando(true);
    try {
      // A API devolve os tokens: o guard do layout raiz leva direto para o Início
      await cadastrar({
        nome: valores.nome.trim(),
        cpf: textoOpcional(valores.cpf),
        email: valores.email.trim().toLowerCase(),
        senha: valores.senha,
      });
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
      setEnviando(false);
    }
  };

  return (
    <Tela comVoltar>
      <CabecalhoMarca subtitulo="Crie sua conta de cuidador(a)." />

      <Aviso
        tom="info"
        mensagem="É familiar? Peça ao cuidador para criar seu acesso na ficha do idoso e entre com o e-mail e a senha que ele cadastrar."
      />
      {erroApi && <Aviso mensagem={erroApi} />}

      <CampoTexto
        rotulo="Nome"
        placeholder="Como devemos te chamar"
        maxLength={20}
        autoComplete="name"
        value={valores.nome}
        onChangeText={(texto) => alterar('nome', texto)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="E-mail"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={valores.email}
        onChangeText={(texto) => alterar('email', texto)}
        erro={erros.email}
      />
      <CampoTexto
        rotulo="CPF (opcional)"
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        value={valores.cpf}
        onChangeText={(texto) => alterar('cpf', mascararCpf(texto))}
        erro={erros.cpf}
      />
      <CampoTexto
        rotulo="Senha"
        placeholder={`Mínimo de ${TAMANHO_MINIMO_SENHA} caracteres`}
        senha
        maxLength={72}
        autoComplete="new-password"
        value={valores.senha}
        onChangeText={(texto) => alterar('senha', texto)}
        erro={erros.senha}
      />
      <CampoTexto
        rotulo="Confirme a senha"
        placeholder="Repita a senha"
        senha
        maxLength={72}
        autoComplete="new-password"
        value={valores.confirmacaoSenha}
        onChangeText={(texto) => alterar('confirmacaoSenha', texto)}
        erro={erros.confirmacaoSenha}
        onSubmitEditing={enviar}
      />

      <Botao
        titulo="Criar conta"
        icone="person-add-outline"
        aoPressionar={enviar}
        carregando={enviando}
      />
      <Texto variante="legenda" cor="textoSuave" centralizado>
        Depois de entrar, cadastre a pessoa idosa que você cuida.
      </Texto>
    </Tela>
  );
}
