import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import {
  Aviso,
  Botao,
  CampoTexto,
  Carregando,
  Icone,
  MensagemErro,
  Selo,
  Tela,
} from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useTema } from '@/contexts/TemaContext';
import { useFormulario } from '@/hooks/useFormulario';
import { useIdoso, useRemoverIdoso, useSalvarIdoso } from '@/hooks/useIdosos';
import { extrairMensagemErro } from '@/services/api';
import { Idoso } from '@/types/idoso';
import { confirmar } from '@/utils/confirmacao';
import {
  dataApiParaTela,
  dataTelaParaApi,
  mascararCpf,
  mascararData,
  textoOpcional,
  textoParaNumero,
} from '@/utils/formatadores';
import { cpfFormatoValido, dataNoPassado, dataValida, ErrosFormulario } from '@/utils/validacoes';

interface FormularioIdoso {
  nome: string;
  cpf: string;
  dataNascimento: string;
  altura: string;
  peso: string;
  comportamento: string;
}

const FORMULARIO_VAZIO: FormularioIdoso = {
  nome: '',
  cpf: '',
  dataNascimento: '',
  altura: '',
  peso: '',
  comportamento: '',
};

function paraFormulario(idoso: Idoso): FormularioIdoso {
  return {
    nome: idoso.nome,
    cpf: idoso.cpf ?? '',
    dataNascimento: dataApiParaTela(idoso.dataNascimento),
    altura: idoso.altura?.toString().replace('.', ',') ?? '',
    peso: idoso.peso?.toString().replace('.', ',') ?? '',
    comportamento: idoso.comportamento ?? '',
  };
}

/** Mesmas regras do IdosoRequisicao (Bean Validation) da API. */
function regras(f: FormularioIdoso): ErrosFormulario<FormularioIdoso> {
  const altura = textoParaNumero(f.altura);
  const peso = textoParaNumero(f.peso);
  return {
    nome: !f.nome.trim() ? 'Informe o nome.' : undefined,
    cpf: f.cpf && !cpfFormatoValido(f.cpf) ? 'CPF incompleto.' : undefined,
    dataNascimento: !dataValida(f.dataNascimento)
      ? 'Use o formato dd/mm/aaaa.'
      : !dataNoPassado(f.dataNascimento)
        ? 'A data de nascimento precisa estar no passado.'
        : undefined,
    altura:
      f.altura && (altura === undefined || altura < 0.3 || altura > 2.5)
        ? 'Altura entre 0,30 e 2,50 m.'
        : undefined,
    peso: f.peso && (peso === undefined || peso < 1) ? 'Peso inválido.' : undefined,
  };
}

/** Ficha do idoso: cadastro (id = "novo"), edição e exclusão. Familiar só visualiza. */
export default function TelaFichaIdoso() {
  const { cores } = useTema();
  const { id } = useLocalSearchParams<{ id: string }>();
  const ehNovo = id === 'novo';
  const idNumerico = ehNovo ? undefined : Number(id);

  const { usuario, ehCuidador } = useAutenticacao();
  const { idIdoso, selecionarIdoso } = useIdosoSelecionado();
  const consulta = useIdoso(idNumerico);
  const salvar = useSalvarIdoso();
  const remover = useRemoverIdoso();
  const { valores, setValores, erros, alterar, validar, erroApi, setErroApi } =
    useFormulario(FORMULARIO_VAZIO);

  useEffect(() => {
    if (consulta.data) {
      setValores(paraFormulario(consulta.data));
    }
  }, [consulta.data, setValores]);

  const enviar = async () => {
    if (!validar(regras) || !usuario) return;
    setErroApi(null);
    try {
      const salvo = await salvar.mutateAsync({
        id: idNumerico,
        dados: {
          nome: valores.nome.trim(),
          cpf: textoOpcional(valores.cpf),
          dataNascimento: dataTelaParaApi(valores.dataNascimento),
          altura: textoParaNumero(valores.altura),
          peso: textoParaNumero(valores.peso),
          comportamento: textoOpcional(valores.comportamento),
          idCuidador: usuario.id,
        },
      });
      if (ehNovo && idIdoso === undefined) {
        selecionarIdoso(salvo.id);
      }
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const excluir = async () => {
    if (!idNumerico) return;
    const confirmado = await confirmar(
      'Excluir idoso',
      `Tem certeza que deseja excluir ${valores.nome}? Todos os registros dele serão apagados.`,
    );
    if (!confirmado) return;
    try {
      await remover.mutateAsync(idNumerico);
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  if (!ehNovo && consulta.isLoading) {
    return (
      <Tela comVoltar titulo="Ficha do idoso">
        <Carregando />
      </Tela>
    );
  }

  if (!ehNovo && consulta.isError) {
    return (
      <Tela comVoltar titulo="Ficha do idoso">
        <MensagemErro
          mensagem={extrairMensagemErro(consulta.error)}
          aoTentarNovamente={consulta.refetch}
        />
      </Tela>
    );
  }

  const somenteLeitura = !ehCuidador;

  return (
    <Tela
      comVoltar
      titulo={ehNovo ? 'Novo idoso' : 'Ficha do idoso'}
      subtitulo={idNumerico ? `Código ${idNumerico} — compartilhe com a família` : undefined}
      acaoDireita={
        !ehNovo && ehCuidador ? (
          <Pressable
            onPress={excluir}
            accessibilityRole="button"
            accessibilityLabel="Excluir idoso"
            hitSlop={12}
          >
            <Icone nome="trash-outline" cor={cores.erro} tamanho={26} />
          </Pressable>
        ) : undefined
      }
    >
      {erroApi && <Aviso mensagem={erroApi} />}

      {!ehNovo && ehCuidador && idNumerico !== idIdoso && (
        <Botao
          titulo="Acompanhar este idoso"
          icone="eye-outline"
          variante="secundario"
          aoPressionar={() => {
            selecionarIdoso(idNumerico as number);
            router.back();
          }}
        />
      )}
      {!ehNovo && idNumerico === idIdoso && <Selo texto="Acompanhando agora" tom="sucesso" />}

      <CampoTexto
        rotulo="Nome"
        placeholder="Nome do idoso"
        maxLength={20}
        editable={!somenteLeitura}
        value={valores.nome}
        onChangeText={(t) => alterar('nome', t)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="Data de nascimento"
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.dataNascimento}
        onChangeText={(t) => alterar('dataNascimento', mascararData(t))}
        erro={erros.dataNascimento}
      />
      <CampoTexto
        rotulo="CPF (opcional)"
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.cpf}
        onChangeText={(t) => alterar('cpf', mascararCpf(t))}
        erro={erros.cpf}
      />
      <CampoTexto
        rotulo="Altura em metros (opcional)"
        placeholder="Ex.: 1,65"
        keyboardType="decimal-pad"
        editable={!somenteLeitura}
        value={valores.altura}
        onChangeText={(t) => alterar('altura', t)}
        erro={erros.altura}
      />
      <CampoTexto
        rotulo="Peso em kg (opcional)"
        placeholder="Ex.: 68,5"
        keyboardType="decimal-pad"
        editable={!somenteLeitura}
        value={valores.peso}
        onChangeText={(t) => alterar('peso', t)}
        erro={erros.peso}
      />
      <CampoTexto
        rotulo="Comportamento e observações (opcional)"
        placeholder="Ex.: fica agitado no fim da tarde"
        multiline
        maxLength={100}
        editable={!somenteLeitura}
        value={valores.comportamento}
        onChangeText={(t) => alterar('comportamento', t)}
      />

      {!somenteLeitura && (
        <Botao
          titulo={ehNovo ? 'Cadastrar idoso' : 'Salvar alterações'}
          icone="checkmark"
          aoPressionar={enviar}
          carregando={salvar.isPending}
        />
      )}
    </Tela>
  );
}
