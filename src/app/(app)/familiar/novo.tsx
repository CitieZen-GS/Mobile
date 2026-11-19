import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Aviso, Botao, CampoTexto, Cartao, Tela, Texto } from '@/components/comuns';
import { useCadastrarFamiliar } from '@/hooks/useFamiliares';
import { useFormulario } from '@/hooks/useFormulario';
import { useIdoso } from '@/hooks/useIdosos';
import { extrairMensagemErro } from '@/services/api';
import { Usuario } from '@/types/autenticacao';
import { mascararTelefone, textoOpcional } from '@/utils/formatadores';
import { emailValido, ErrosFormulario } from '@/utils/validacoes';

interface FormularioFamiliar {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
}

const FORMULARIO_VAZIO: FormularioFamiliar = {
  nome: '',
  telefone: '',
  email: '',
  senha: '',
  confirmacaoSenha: '',
};

const TAMANHO_MINIMO_SENHA = 6;

/** Mesmas regras do CadastroParenteRequisicao da API de autenticação. */
function regras(f: FormularioFamiliar): ErrosFormulario<FormularioFamiliar> {
  const digitosTelefone = f.telefone.replace(/\D/g, '').length;
  return {
    nome: !f.nome.trim() ? 'Informe o nome do familiar.' : undefined,
    telefone:
      digitosTelefone > 0 && digitosTelefone < 10 ? 'Informe o telefone com DDD.' : undefined,
    email: !f.email.trim()
      ? 'Informe o e-mail do familiar.'
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
 * O cuidador cria o acesso de um familiar para um idoso dele
 * (POST /autenticacao/cadastro/parente). O familiar entra depois pelo login, só para visualizar.
 */
export default function TelaCadastrarFamiliar() {
  const { idIdoso } = useLocalSearchParams<{ idIdoso: string }>();
  const idoso = useIdoso(Number(idIdoso));
  const cadastrar = useCadastrarFamiliar();
  const [criado, setCriado] = useState<Usuario | null>(null);
  const { valores, setValores, erros, alterar, validar, erroApi, setErroApi } =
    useFormulario(FORMULARIO_VAZIO);
  const nomeIdoso = idoso.data?.nome ?? 'o idoso';

  const enviar = async () => {
    if (!validar(regras)) return;
    setErroApi(null);
    try {
      const familiar = await cadastrar.mutateAsync({
        nome: valores.nome.trim(),
        telefone: textoOpcional(valores.telefone),
        email: valores.email.trim().toLowerCase(),
        senha: valores.senha,
        idIdoso: Number(idIdoso),
      });
      setCriado(familiar);
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const cadastrarOutro = () => {
    setCriado(null);
    setValores(FORMULARIO_VAZIO);
  };

  if (criado) {
    return (
      <Tela comVoltar titulo="Familiar cadastrado">
        <Aviso tom="sucesso" mensagem={`O acesso de ${criado.nome} foi criado.`} />
        <Cartao>
          <Texto variante="subtitulo">Envie para {criado.nome}</Texto>
          <Texto>
            Baixe o Ajudante Familiar e entre com o e-mail{' '}
            <Texto variante="corpoNegrito">{criado.email}</Texto> e a senha que você cadastrou.
          </Texto>
          <Texto variante="legenda" cor="textoSecundario">
            {criado.nome} vai acompanhar a rotina de {nomeIdoso}, sem poder alterar os registros.
          </Texto>
        </Cartao>
        <Botao
          titulo="Cadastrar outro familiar"
          icone="person-add-outline"
          variante="secundario"
          aoPressionar={cadastrarOutro}
        />
        <Botao titulo="Concluir" icone="checkmark" aoPressionar={() => router.back()} />
      </Tela>
    );
  }

  return (
    <Tela comVoltar titulo="Cadastrar familiar" subtitulo={`Acesso para acompanhar ${nomeIdoso}`}>
      <Aviso
        tom="info"
        mensagem="O familiar vê tudo o que você registrar, mas não pode alterar. Ele entra no app com o e-mail e a senha abaixo."
      />
      {erroApi && <Aviso mensagem={erroApi} />}

      <CampoTexto
        rotulo="Nome do familiar"
        placeholder="Ex.: Ana"
        maxLength={20}
        value={valores.nome}
        onChangeText={(t) => alterar('nome', t)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="E-mail do familiar"
        placeholder="familiar@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={valores.email}
        onChangeText={(t) => alterar('email', t)}
        erro={erros.email}
      />
      <CampoTexto
        rotulo="Telefone (opcional)"
        placeholder="(11) 98765-4321"
        keyboardType="phone-pad"
        value={valores.telefone}
        onChangeText={(t) => alterar('telefone', mascararTelefone(t))}
        erro={erros.telefone}
      />
      <CampoTexto
        rotulo="Senha de acesso"
        placeholder={`Mínimo de ${TAMANHO_MINIMO_SENHA} caracteres`}
        senha
        maxLength={72}
        autoComplete="new-password"
        value={valores.senha}
        onChangeText={(t) => alterar('senha', t)}
        erro={erros.senha}
      />
      <CampoTexto
        rotulo="Confirme a senha"
        placeholder="Repita a senha"
        senha
        maxLength={72}
        autoComplete="new-password"
        value={valores.confirmacaoSenha}
        onChangeText={(t) => alterar('confirmacaoSenha', t)}
        erro={erros.confirmacaoSenha}
        onSubmitEditing={enviar}
      />

      <Botao
        titulo="Criar acesso do familiar"
        icone="person-add-outline"
        aoPressionar={enviar}
        carregando={cadastrar.isPending}
      />
    </Tela>
  );
}
