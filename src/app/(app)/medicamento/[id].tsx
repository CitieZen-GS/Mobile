import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  Aviso,
  Botao,
  BotaoExcluir,
  CampoTexto,
  Carregando,
  MensagemErro,
  Opcao,
  SeletorOpcoes,
  Tela,
} from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useFormulario } from '@/hooks/useFormulario';
import {
  useMedicamento,
  useRemoverMedicamento,
  useSalvarMedicamento,
} from '@/hooks/useMedicamentos';
import { extrairMensagemErro } from '@/services/api';
import { Medicamento } from '@/types/medicamento';
import { confirmar } from '@/utils/confirmacao';
import {
  dataApiParaTela,
  dataTelaParaApi,
  formatarHora,
  mascararData,
  mascararHora,
  textoOpcional,
} from '@/utils/formatadores';
import { dataValida, ErrosFormulario, horaValida } from '@/utils/validacoes';

interface FormularioMedicamento {
  nome: string;
  hora: string;
  frequencia: string;
  viaAdministracao: string;
  instrucaoUso: string;
  data: string;
}

const FORMULARIO_VAZIO: FormularioMedicamento = {
  nome: '',
  hora: '',
  frequencia: '',
  viaAdministracao: 'Oral',
  instrucaoUso: '',
  data: '',
};

const VIAS: Opcao<string>[] = ['Oral', 'Sublingual', 'Injetável', 'Tópica', 'Inalatória'].map(
  (via) => ({ valor: via, rotulo: via }),
);

function paraFormulario(m: Medicamento): FormularioMedicamento {
  return {
    nome: m.nome,
    hora: formatarHora(m.hora),
    frequencia: m.frequencia ?? '',
    viaAdministracao: m.viaAdministracao ?? '',
    instrucaoUso: m.instrucaoUso ?? '',
    data: dataApiParaTela(m.data),
  };
}

/** Mesmas regras do MedicamentoRequisicao da API. */
function regras(f: FormularioMedicamento): ErrosFormulario<FormularioMedicamento> {
  return {
    nome: !f.nome.trim() ? 'Informe o nome do medicamento.' : undefined,
    hora: !horaValida(f.hora) ? 'Informe o horário no formato hh:mm.' : undefined,
    data: f.data && !dataValida(f.data) ? 'Use o formato dd/mm/aaaa.' : undefined,
  };
}

/** Cadastro (id = "novo"), edição e exclusão de medicamento. Familiar só visualiza. */
export default function TelaMedicamento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ehNovo = id === 'novo';
  const idNumerico = ehNovo ? undefined : Number(id);

  const { ehCuidador } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const consulta = useMedicamento(idNumerico);
  const salvar = useSalvarMedicamento();
  const remover = useRemoverMedicamento();
  const { valores, setValores, erros, alterar, validar, erroApi, setErroApi } =
    useFormulario(FORMULARIO_VAZIO);
  const somenteLeitura = !ehCuidador;

  useEffect(() => {
    if (consulta.data) setValores(paraFormulario(consulta.data));
  }, [consulta.data, setValores]);

  const enviar = async () => {
    if (!validar(regras) || idIdoso === undefined) return;
    setErroApi(null);
    try {
      await salvar.mutateAsync({
        id: idNumerico,
        idIdoso,
        dados: {
          nome: valores.nome.trim(),
          hora: valores.hora,
          frequencia: textoOpcional(valores.frequencia),
          viaAdministracao: textoOpcional(valores.viaAdministracao),
          instrucaoUso: textoOpcional(valores.instrucaoUso),
          data: valores.data ? dataTelaParaApi(valores.data) : undefined,
        },
      });
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const excluir = async () => {
    if (!idNumerico) return;
    const confirmado = await confirmar(
      'Excluir medicamento',
      `Deseja remover ${valores.nome} da lista?`,
    );
    if (!confirmado) return;
    try {
      await remover.mutateAsync(idNumerico);
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const titulo = ehNovo
    ? 'Novo medicamento'
    : somenteLeitura
      ? 'Medicamento'
      : 'Editar medicamento';

  if (!ehNovo && (consulta.isLoading || consulta.isError)) {
    return (
      <Tela comVoltar titulo={titulo}>
        {consulta.isLoading ? (
          <Carregando />
        ) : (
          <MensagemErro
            mensagem={extrairMensagemErro(consulta.error)}
            aoTentarNovamente={consulta.refetch}
          />
        )}
      </Tela>
    );
  }

  return (
    <Tela
      comVoltar
      titulo={titulo}
      acaoDireita={
        !ehNovo && ehCuidador ? (
          <BotaoExcluir aoPressionar={excluir} rotuloAcessivel="Excluir medicamento" />
        ) : undefined
      }
    >
      {erroApi && <Aviso mensagem={erroApi} />}

      <CampoTexto
        rotulo="Nome do medicamento"
        placeholder="Ex.: Losartana 50mg"
        maxLength={20}
        editable={!somenteLeitura}
        value={valores.nome}
        onChangeText={(t) => alterar('nome', t)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="Horário da dose"
        placeholder="hh:mm"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.hora}
        onChangeText={(t) => alterar('hora', mascararHora(t))}
        erro={erros.hora}
      />
      <CampoTexto
        rotulo="Frequência (opcional)"
        placeholder="Ex.: de 12 em 12 horas"
        maxLength={50}
        editable={!somenteLeitura}
        value={valores.frequencia}
        onChangeText={(t) => alterar('frequencia', t)}
      />
      {somenteLeitura ? (
        <CampoTexto
          rotulo="Via de administração"
          editable={false}
          value={valores.viaAdministracao}
        />
      ) : (
        <SeletorOpcoes
          rotulo="Via de administração"
          opcoes={VIAS}
          valor={valores.viaAdministracao}
          aoMudar={(via) => alterar('viaAdministracao', via)}
        />
      )}
      <CampoTexto
        rotulo="Instruções de uso (opcional)"
        placeholder="Ex.: tomar em jejum, com um copo de água"
        multiline
        maxLength={100}
        editable={!somenteLeitura}
        value={valores.instrucaoUso}
        onChangeText={(t) => alterar('instrucaoUso', t)}
      />
      <CampoTexto
        rotulo="Início do tratamento (opcional)"
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.data}
        onChangeText={(t) => alterar('data', mascararData(t))}
        erro={erros.data}
      />

      {!somenteLeitura && (
        <Botao
          titulo={ehNovo ? 'Cadastrar medicamento' : 'Salvar alterações'}
          icone="checkmark"
          aoPressionar={enviar}
          carregando={salvar.isPending}
        />
      )}
    </Tela>
  );
}
