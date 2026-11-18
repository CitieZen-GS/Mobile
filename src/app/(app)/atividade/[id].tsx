import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  Aviso,
  Botao,
  BotaoExcluir,
  CampoTexto,
  Carregando,
  MensagemErro,
  Tela,
} from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useAtividade, useRemoverAtividade, useSalvarAtividade } from '@/hooks/useAtividades';
import { useFormulario } from '@/hooks/useFormulario';
import { extrairMensagemErro } from '@/services/api';
import { Atividade } from '@/types/atividade';
import { confirmar } from '@/utils/confirmacao';
import {
  dataApiParaTela,
  dataTelaParaApi,
  formatarHora,
  hojeApi,
  mascararData,
  mascararHora,
  textoOpcional,
} from '@/utils/formatadores';
import { dataValida, ErrosFormulario, horaValida } from '@/utils/validacoes';

interface FormularioAtividade {
  nome: string;
  descricao: string;
  data: string;
  horaInicio: string;
  horaFim: string;
}

function paraFormulario(a: Atividade): FormularioAtividade {
  return {
    nome: a.nome,
    descricao: a.descricao ?? '',
    data: dataApiParaTela(a.data),
    horaInicio: formatarHora(a.horaInicio),
    horaFim: formatarHora(a.horaFim),
  };
}

/** Mesmas regras do AtividadeRequisicao da API, mais fim depois do início. */
function regras(f: FormularioAtividade): ErrosFormulario<FormularioAtividade> {
  const inicioOk = !f.horaInicio || horaValida(f.horaInicio);
  const fimOk = !f.horaFim || horaValida(f.horaFim);
  return {
    nome: !f.nome.trim() ? 'Informe o nome da atividade.' : undefined,
    data: !dataValida(f.data) ? 'Use o formato dd/mm/aaaa.' : undefined,
    horaInicio: !inicioOk ? 'Use o formato hh:mm.' : undefined,
    horaFim: !fimOk
      ? 'Use o formato hh:mm.'
      : f.horaInicio && f.horaFim && f.horaFim <= f.horaInicio
        ? 'O fim precisa ser depois do início.'
        : undefined,
  };
}

/** Cadastro (id = "novo"), edição e exclusão de atividade. */
export default function TelaAtividade() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ehNovo = id === 'novo';
  const idNumerico = ehNovo ? undefined : Number(id);

  const { ehCuidador } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const consulta = useAtividade(idNumerico);
  const salvar = useSalvarAtividade();
  const remover = useRemoverAtividade();
  const { valores, setValores, erros, alterar, validar, erroApi, setErroApi } =
    useFormulario<FormularioAtividade>({
      nome: '',
      descricao: '',
      data: dataApiParaTela(hojeApi()),
      horaInicio: '',
      horaFim: '',
    });
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
          descricao: textoOpcional(valores.descricao),
          data: dataTelaParaApi(valores.data),
          horaInicio: textoOpcional(valores.horaInicio),
          horaFim: textoOpcional(valores.horaFim),
        },
      });
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const excluir = async () => {
    if (!idNumerico) return;
    const confirmado = await confirmar('Excluir atividade', `Deseja excluir "${valores.nome}"?`);
    if (!confirmado) return;
    try {
      await remover.mutateAsync(idNumerico);
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const titulo = ehNovo ? 'Nova atividade' : somenteLeitura ? 'Atividade' : 'Editar atividade';

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
          <BotaoExcluir aoPressionar={excluir} rotuloAcessivel="Excluir atividade" />
        ) : undefined
      }
    >
      {erroApi && <Aviso mensagem={erroApi} />}

      <CampoTexto
        rotulo="Atividade"
        placeholder="Ex.: Caminhada leve"
        maxLength={20}
        editable={!somenteLeitura}
        value={valores.nome}
        onChangeText={(t) => alterar('nome', t)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="Data"
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.data}
        onChangeText={(t) => alterar('data', mascararData(t))}
        erro={erros.data}
      />
      <CampoTexto
        rotulo="Início (opcional)"
        placeholder="hh:mm"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.horaInicio}
        onChangeText={(t) => alterar('horaInicio', mascararHora(t))}
        erro={erros.horaInicio}
      />
      <CampoTexto
        rotulo="Fim (opcional)"
        placeholder="hh:mm"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.horaFim}
        onChangeText={(t) => alterar('horaFim', mascararHora(t))}
        erro={erros.horaFim}
      />
      <CampoTexto
        rotulo="Descrição (opcional)"
        placeholder="Ex.: 20 minutos na praça, com acompanhante"
        multiline
        maxLength={80}
        editable={!somenteLeitura}
        value={valores.descricao}
        onChangeText={(t) => alterar('descricao', t)}
      />

      {!somenteLeitura && (
        <Botao
          titulo={ehNovo ? 'Cadastrar atividade' : 'Salvar alterações'}
          icone="checkmark"
          aoPressionar={enviar}
          carregando={salvar.isPending}
        />
      )}
    </Tela>
  );
}
