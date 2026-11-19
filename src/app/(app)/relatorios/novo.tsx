import { router } from 'expo-router';
import { Aviso, Botao, CampoTexto, SeletorOpcoes, Tela } from '@/components/comuns';
import { TIPOS_RELATORIO } from '@/components/relatorios/SelosRelatorio';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useFormulario } from '@/hooks/useFormulario';
import { useSolicitarRelatorio } from '@/hooks/useRelatorios';
import { extrairMensagemErro } from '@/services/api';
import { TipoRelatorio } from '@/types/relatorio';
import {
  dataApiParaTela,
  dataTelaParaApi,
  diasAtrasApi,
  hojeApi,
  mascararData,
  textoOpcional,
} from '@/utils/formatadores';
import { dataValida, diasNoPeriodo, ErrosFormulario } from '@/utils/validacoes';

/** Mesmo limite da API de RAG (rag.periodo-maximo-dias). */
const PERIODO_MAXIMO_DIAS = 90;

interface FormularioRelatorio {
  tipo: TipoRelatorio;
  dataInicio: string;
  dataFim: string;
  titulo: string;
  solicitacao: string;
}

/** Começa com o relatório geral da última semana (hoje e os 6 dias anteriores). */
function formularioInicial(): FormularioRelatorio {
  return {
    tipo: 'GERAL',
    dataInicio: dataApiParaTela(diasAtrasApi(6)),
    dataFim: dataApiParaTela(hojeApi()),
    titulo: '',
    solicitacao: '',
  };
}

/** Mesmas regras do RelatorioRequisicao e do PeriodoService da API de RAG. */
function regras(f: FormularioRelatorio): ErrosFormulario<FormularioRelatorio> {
  const inicioValido = dataValida(f.dataInicio);
  let erroFim: string | undefined;
  if (!dataValida(f.dataFim)) {
    erroFim = 'Use o formato dd/mm/aaaa.';
  } else if (inicioValido) {
    const dias = diasNoPeriodo(f.dataInicio, f.dataFim);
    if (dias < 1) erroFim = 'A data final não pode ser antes da inicial.';
    else if (dias > PERIODO_MAXIMO_DIAS) {
      erroFim = `O período pode ter no máximo ${PERIODO_MAXIMO_DIAS} dias.`;
    }
  }
  return {
    dataInicio: inicioValido ? undefined : 'Use o formato dd/mm/aaaa.',
    dataFim: erroFim,
  };
}

/** Pedido de relatório (POST /idosos/{idIdoso}/relatorios). A IA escreve em segundo plano. */
export default function TelaNovoRelatorio() {
  const { idIdoso } = useIdosoSelecionado();
  const solicitar = useSolicitarRelatorio();
  const { valores, erros, alterar, validar, erroApi, setErroApi } =
    useFormulario(formularioInicial());

  const enviar = async () => {
    if (!validar(regras) || idIdoso === undefined) return;
    setErroApi(null);
    try {
      const relatorio = await solicitar.mutateAsync({
        idIdoso,
        dados: {
          tipo: valores.tipo,
          dataInicio: dataTelaParaApi(valores.dataInicio),
          dataFim: dataTelaParaApi(valores.dataFim),
          titulo: textoOpcional(valores.titulo),
          solicitacao: textoOpcional(valores.solicitacao),
        },
      });
      // Abre o relatório: a tela acompanha a geração até ficar pronto
      router.replace({ pathname: '/relatorios/[id]', params: { id: String(relatorio.id) } });
    } catch (erro) {
      setErroApi(extrairMensagemErro(erro));
    }
  };

  return (
    <Tela comVoltar titulo="Novo relatório">
      {erroApi && <Aviso mensagem={erroApi} />}
      <Aviso
        tom="info"
        mensagem={`A IA escreve o relatório só com o que foi registrado no app no período escolhido (até ${PERIODO_MAXIMO_DIAS} dias).`}
      />

      <SeletorOpcoes
        rotulo="Assunto"
        opcoes={TIPOS_RELATORIO}
        valor={valores.tipo}
        aoMudar={(tipo) => alterar('tipo', tipo)}
      />
      <CampoTexto
        rotulo="De"
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        value={valores.dataInicio}
        onChangeText={(t) => alterar('dataInicio', mascararData(t))}
        erro={erros.dataInicio}
      />
      <CampoTexto
        rotulo="Até"
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        value={valores.dataFim}
        onChangeText={(t) => alterar('dataFim', mascararData(t))}
        erro={erros.dataFim}
      />
      <CampoTexto
        rotulo="Título (opcional)"
        placeholder="Ex.: Relatório para a consulta"
        maxLength={100}
        dica="Se ficar em branco, o título é criado automaticamente."
        value={valores.titulo}
        onChangeText={(t) => alterar('titulo', t)}
      />
      <CampoTexto
        rotulo="Pedido para a IA (opcional)"
        placeholder="Ex.: destaque os dias sem registro de remédios"
        multiline
        maxLength={500}
        value={valores.solicitacao}
        onChangeText={(t) => alterar('solicitacao', t)}
      />

      <Botao
        titulo="Gerar relatório"
        icone="sparkles"
        aoPressionar={enviar}
        carregando={solicitar.isPending}
      />
    </Tela>
  );
}
