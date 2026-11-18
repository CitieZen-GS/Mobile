import { useState } from 'react';
import { CabecalhoMarca } from '@/components/autenticacao/CabecalhoMarca';
import { Aviso, Botao, CampoTexto, Opcao, SeletorOpcoes, Tela, Texto } from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { extrairMensagemErro } from '@/services/api';
import { PerfilUsuario } from '@/types/autenticacao';
import { mascararCpf, mascararTelefone, textoOpcional } from '@/utils/formatadores';
import { cpfFormatoValido, emailValido, ErrosFormulario, semErros } from '@/utils/validacoes';

interface FormularioCadastro {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  perfil: PerfilUsuario;
  cpf: string;
  telefone: string;
  codigoIdoso: string;
}

const OPCOES_PERFIL: Opcao<PerfilUsuario>[] = [
  { valor: 'CUIDADOR', rotulo: 'Sou cuidador(a)' },
  { valor: 'FAMILIAR', rotulo: 'Sou familiar' },
];

const TAMANHO_MINIMO_SENHA = 6;

function validar(f: FormularioCadastro): ErrosFormulario<FormularioCadastro> {
  const ehFamiliar = f.perfil === 'FAMILIAR';
  return {
    nome: !f.nome.trim() ? 'Informe seu nome.' : undefined,
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
    cpf: !ehFamiliar && f.cpf && !cpfFormatoValido(f.cpf) ? 'CPF incompleto.' : undefined,
    telefone:
      ehFamiliar && f.telefone.replace(/\D/g, '').length < 10
        ? 'Informe um telefone com DDD.'
        : undefined,
    codigoIdoso:
      ehFamiliar && !/^\d+$/.test(f.codigoIdoso)
        ? 'Informe o código do idoso (peça ao cuidador).'
        : undefined,
  };
}

export default function TelaCadastro() {
  const { cadastrar } = useAutenticacao();
  const [form, setForm] = useState<FormularioCadastro>({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    perfil: 'CUIDADOR',
    cpf: '',
    telefone: '',
    codigoIdoso: '',
  });
  const [erros, setErros] = useState<ErrosFormulario<FormularioCadastro>>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const ehFamiliar = form.perfil === 'FAMILIAR';

  const alterar = <K extends keyof FormularioCadastro>(campo: K, valor: FormularioCadastro[K]) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const enviar = async () => {
    const novosErros = validar(form);
    setErros(novosErros);
    if (!semErros(novosErros)) return;

    setErroApi(null);
    setEnviando(true);
    try {
      await cadastrar({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        perfil: form.perfil,
        cpf: ehFamiliar ? undefined : textoOpcional(form.cpf),
        telefone: ehFamiliar ? form.telefone : undefined,
        idIdoso: ehFamiliar ? Number(form.codigoIdoso) : undefined,
      });
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Tela comVoltar>
      <CabecalhoMarca subtitulo="Crie sua conta para acompanhar a rotina do idoso." />

      {erroApi && <Aviso mensagem={erroApi} />}

      <SeletorOpcoes
        rotulo="Como você vai usar o app?"
        opcoes={OPCOES_PERFIL}
        valor={form.perfil}
        aoMudar={(perfil) => alterar('perfil', perfil)}
      />
      <Texto variante="legenda" cor="textoSecundario">
        {ehFamiliar
          ? 'Familiares acompanham tudo o que o cuidador registra, apenas para visualização.'
          : 'Cuidadores cadastram idosos, medicamentos, consultas e atividades.'}
      </Texto>

      <CampoTexto
        rotulo="Nome"
        placeholder="Como devemos te chamar"
        maxLength={20}
        autoComplete="name"
        value={form.nome}
        onChangeText={(texto) => alterar('nome', texto)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="E-mail"
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={form.email}
        onChangeText={(texto) => alterar('email', texto)}
        erro={erros.email}
      />

      {ehFamiliar ? (
        <>
          <CampoTexto
            rotulo="Telefone"
            placeholder="(11) 98765-4321"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={(texto) => alterar('telefone', mascararTelefone(texto))}
            erro={erros.telefone}
          />
          <CampoTexto
            rotulo="Código do idoso"
            placeholder="Ex.: 12"
            keyboardType="number-pad"
            dica="O cuidador encontra esse código na ficha do idoso."
            value={form.codigoIdoso}
            onChangeText={(texto) => alterar('codigoIdoso', texto.replace(/\D/g, ''))}
            erro={erros.codigoIdoso}
          />
        </>
      ) : (
        <CampoTexto
          rotulo="CPF (opcional)"
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          value={form.cpf}
          onChangeText={(texto) => alterar('cpf', mascararCpf(texto))}
          erro={erros.cpf}
        />
      )}

      <CampoTexto
        rotulo="Senha"
        placeholder={`Mínimo de ${TAMANHO_MINIMO_SENHA} caracteres`}
        senha
        autoComplete="new-password"
        value={form.senha}
        onChangeText={(texto) => alterar('senha', texto)}
        erro={erros.senha}
      />
      <CampoTexto
        rotulo="Confirme a senha"
        placeholder="Repita a senha"
        senha
        autoComplete="new-password"
        value={form.confirmacaoSenha}
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
    </Tela>
  );
}
