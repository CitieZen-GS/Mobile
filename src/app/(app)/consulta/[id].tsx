import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  Aviso,
  Botao,
  BotaoExcluir,
  CampoTexto,
  Carregando,
  MensagemErro,
  Selo,
  Tela,
} from '@/components/comuns';
import { MedicamentosDaConsulta } from '@/components/consultas/MedicamentosDaConsulta';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useConsulta, useRemoverConsulta, useSalvarConsulta } from '@/hooks/useConsultas';
import { useFormulario } from '@/hooks/useFormulario';
import { extrairMensagemErro } from '@/services/api';
import { LembreteConsulta } from '@/types/consulta';
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

interface FormularioConsulta {
  titulo: string;
  nomeMedico: string;
  dataConsulta: string;
  horaConsulta: string;
  descricao: string;
}

const FORMULARIO_VAZIO: FormularioConsulta = {
  titulo: '',
  nomeMedico: '',
  dataConsulta: '',
  horaConsulta: '',
  descricao: '',
};

function paraFormulario(c: LembreteConsulta): FormularioConsulta {
  return {
    titulo: c.titulo,
    nomeMedico: c.nomeMedico ?? '',
    dataConsulta: dataApiParaTela(c.dataConsulta),
    horaConsulta: formatarHora(c.horaConsulta),
    descricao: c.descricao ?? '',
  };
}

/** Mesmas regras do LembreteConsultaRequisicao da API. */
function regras(f: FormularioConsulta): ErrosFormulario<FormularioConsulta> {
  return {
    titulo: !f.titulo.trim() ? 'Informe a especialidade ou motivo.' : undefined,
    dataConsulta: !dataValida(f.dataConsulta) ? 'Use o formato dd/mm/aaaa.' : undefined,
    horaConsulta:
      f.horaConsulta && !horaValida(f.horaConsulta) ? 'Use o formato hh:mm.' : undefined,
  };
}

/** Cadastro (id = "novo"), edição e exclusão de lembrete de consulta. */
export default function TelaConsulta() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ehNovo = id === 'novo';
  const idNumerico = ehNovo ? undefined : Number(id);

  const { ehCuidador } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const consulta = useConsulta(idNumerico);
  const salvar = useSalvarConsulta();
  const remover = useRemoverConsulta();
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
          titulo: valores.titulo.trim(),
          nomeMedico: textoOpcional(valores.nomeMedico),
          dataConsulta: dataTelaParaApi(valores.dataConsulta),
          horaConsulta: textoOpcional(valores.horaConsulta),
          descricao: textoOpcional(valores.descricao),
        },
      });
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const excluir = async () => {
    if (!idNumerico) return;
    const confirmado = await confirmar('Excluir consulta', `Deseja excluir "${valores.titulo}"?`);
    if (!confirmado) return;
    try {
      await remover.mutateAsync(idNumerico);
      router.back();
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  const titulo = ehNovo ? 'Nova consulta' : somenteLeitura ? 'Consulta' : 'Editar consulta';

  if (!ehNovo && (consulta.isLoading || consulta.isError || !consulta.data)) {
    return (
      <Tela comVoltar titulo={titulo}>
        {consulta.isError ? (
          <MensagemErro
            mensagem={extrairMensagemErro(consulta.error)}
            aoTentarNovamente={consulta.refetch}
          />
        ) : (
          <Carregando />
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
          <BotaoExcluir aoPressionar={excluir} rotuloAcessivel="Excluir consulta" />
        ) : undefined
      }
    >
      {erroApi && <Aviso mensagem={erroApi} />}
      {consulta.data && (
        <Selo
          texto={consulta.data.status === 'REALIZADO' ? 'Realizada' : 'Pendente'}
          tom={consulta.data.status === 'REALIZADO' ? 'sucesso' : 'aviso'}
        />
      )}

      <CampoTexto
        rotulo="Especialidade ou motivo"
        placeholder="Ex.: Cardiologista"
        maxLength={20}
        editable={!somenteLeitura}
        value={valores.titulo}
        onChangeText={(t) => alterar('titulo', t)}
        erro={erros.titulo}
      />
      <CampoTexto
        rotulo="Data da consulta"
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.dataConsulta}
        onChangeText={(t) => alterar('dataConsulta', mascararData(t))}
        erro={erros.dataConsulta}
      />
      <CampoTexto
        rotulo="Horário (opcional)"
        placeholder="hh:mm"
        keyboardType="number-pad"
        editable={!somenteLeitura}
        value={valores.horaConsulta}
        onChangeText={(t) => alterar('horaConsulta', mascararHora(t))}
        erro={erros.horaConsulta}
      />
      <CampoTexto
        rotulo="Médico(a) (opcional)"
        placeholder="Nome do médico"
        maxLength={20}
        editable={!somenteLeitura}
        value={valores.nomeMedico}
        onChangeText={(t) => alterar('nomeMedico', t)}
      />
      <CampoTexto
        rotulo="Observações (opcional)"
        placeholder="Ex.: levar exames de sangue, ir em jejum"
        multiline
        maxLength={100}
        editable={!somenteLeitura}
        value={valores.descricao}
        onChangeText={(t) => alterar('descricao', t)}
      />

      {!somenteLeitura && (
        <Botao
          titulo={ehNovo ? 'Cadastrar consulta' : 'Salvar alterações'}
          icone="checkmark"
          aoPressionar={enviar}
          carregando={salvar.isPending}
        />
      )}

      {consulta.data && (
        <MedicamentosDaConsulta consulta={consulta.data} somenteLeitura={somenteLeitura} />
      )}
    </Tela>
  );
}
