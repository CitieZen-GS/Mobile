import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Aviso,
  Botao,
  Carregando,
  EstadoVazio,
  MensagemErro,
  Selo,
  Tela,
  Texto,
} from '@/components/comuns';
import { CartaoIdoso } from '@/components/idosos/CartaoIdoso';
import { ItemResumo, SecaoResumo } from '@/components/inicio/SecaoResumo';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useResumoIdoso } from '@/hooks/useIdosos';
import { extrairMensagemErro } from '@/services/api';
import { espacos } from '@/styles/tema';
import { TipoAlimentacao } from '@/types/alimentacao';
import { dataApiParaTela, dataPorExtenso, formatarHora, hojeApi } from '@/utils/formatadores';

const ROTULO_REFEICAO: Record<TipoAlimentacao, string> = {
  CAFE_DA_MANHA: 'Café da manhã',
  ALMOCO: 'Almoço',
  LANCHE_DE_TARDE: 'Lanche da tarde',
  JANTAR: 'Jantar',
};

const porHora = <T,>(itens: T[], hora: (item: T) => string | null) =>
  [...itens].sort((a, b) => (hora(a) ?? '99').localeCompare(hora(b) ?? '99'));

/** Tela inicial: resumo do dia do idoso acompanhado (GET /idosos/{id}/resumo). */
export default function TelaInicio() {
  const { usuario, ehCuidador } = useAutenticacao();
  const { idIdoso, definindo, erroAoCarregar, tentarNovamente } = useIdosoSelecionado();
  const hoje = hojeApi();
  const resumo = useResumoIdoso(idIdoso, hoje);

  const saudacao = (
    <View>
      <Texto variante="titulo" accessibilityRole="header">
        Olá, {usuario?.nome}!
      </Texto>
      <Texto cor="textoSecundario">{dataPorExtenso(hoje)}</Texto>
    </View>
  );

  if (definindo || (idIdoso !== undefined && resumo.isLoading)) {
    return (
      <Tela bordas={['top']}>
        {saudacao}
        <Carregando mensagem="Preparando o resumo do dia..." />
      </Tela>
    );
  }

  if (idIdoso === undefined && erroAoCarregar) {
    return (
      <Tela bordas={['top']}>
        {saudacao}
        <MensagemErro
          mensagem={extrairMensagemErro(erroAoCarregar)}
          aoTentarNovamente={tentarNovamente}
        />
      </Tela>
    );
  }

  if (idIdoso === undefined) {
    return (
      <Tela bordas={['top']}>
        {saudacao}
        {ehCuidador ? (
          <EstadoVazio
            icone="person-add-outline"
            titulo="Vamos começar?"
            descricao="Cadastre a pessoa idosa que você cuida para organizar remédios, consultas e atividades."
            tituloAcao="Cadastrar idoso"
            aoAgir={() => router.push('/idosos/novo')}
          />
        ) : (
          <Aviso
            tom="info"
            mensagem="Seu cadastro ainda não está vinculado a um idoso. Peça o código ao cuidador."
          />
        )}
      </Tela>
    );
  }

  if (resumo.isError || !resumo.data) {
    return (
      <Tela bordas={['top']}>
        {saudacao}
        <MensagemErro
          mensagem={extrairMensagemErro(resumo.error)}
          aoTentarNovamente={resumo.refetch}
        />
      </Tela>
    );
  }

  const { idoso, medicamentos, atividadesDoDia, alimentacaoDoDia, proximasConsultas, doencas } =
    resumo.data;

  return (
    <Tela
      bordas={['top']}
      aoAtualizar={() => void resumo.refetch()}
      atualizando={resumo.isRefetching}
    >
      {saudacao}

      <CartaoIdoso
        idoso={idoso}
        aoPressionar={() =>
          router.push(
            ehCuidador ? '/idosos' : { pathname: '/idosos/[id]', params: { id: String(idoso.id) } },
          )
        }
      />

      {doencas.length > 0 && (
        <View style={estilos.selos}>
          {doencas.map((doenca) => (
            <Selo key={doenca.id} texto={doenca.nome} tom="destaque" />
          ))}
        </View>
      )}

      <SecaoResumo
        titulo="Medicamentos"
        icone="medkit-outline"
        quantidade={medicamentos.length}
        textoVazio="Nenhum medicamento cadastrado."
      >
        {porHora(medicamentos, (m) => m.hora).map((m) => (
          <ItemResumo
            key={m.id}
            titulo={m.nome}
            hora={formatarHora(m.hora)}
            detalhe={[m.frequencia, m.viaAdministracao].filter(Boolean).join(' · ')}
          />
        ))}
      </SecaoResumo>

      <SecaoResumo
        titulo="Atividades de hoje"
        icone="walk-outline"
        quantidade={atividadesDoDia.length}
        textoVazio="Nenhuma atividade planejada para hoje."
      >
        {porHora(atividadesDoDia, (a) => a.horaInicio).map((a) => (
          <ItemResumo
            key={a.id}
            titulo={a.nome}
            hora={formatarHora(a.horaInicio)}
            detalhe={a.descricao}
          />
        ))}
      </SecaoResumo>

      <SecaoResumo
        titulo="Alimentação de hoje"
        icone="restaurant-outline"
        quantidade={alimentacaoDoDia.length}
        textoVazio="Nenhuma refeição registrada hoje."
      >
        {porHora(alimentacaoDoDia, (r) => r.horaConsumo).map((r) => (
          <ItemResumo
            key={r.id}
            titulo={`${ROTULO_REFEICAO[r.tipo]}: ${r.nome}`}
            hora={formatarHora(r.horaConsumo)}
            detalhe={r.calorias ? `${r.calorias} kcal` : r.preparacao}
          />
        ))}
      </SecaoResumo>

      <SecaoResumo
        titulo="Próximas consultas"
        icone="calendar-outline"
        quantidade={proximasConsultas.length}
        textoVazio="Nenhuma consulta marcada."
      >
        {proximasConsultas.map((c) => (
          <ItemResumo
            key={c.id}
            titulo={c.titulo}
            detalhe={[
              dataApiParaTela(c.dataConsulta),
              formatarHora(c.horaConsulta),
              c.nomeMedico && `Dr(a). ${c.nomeMedico}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          />
        ))}
      </SecaoResumo>

      {ehCuidador && (
        <Botao
          titulo="Trocar de idoso"
          icone="swap-horizontal"
          variante="fantasma"
          aoPressionar={() => router.push('/idosos')}
        />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  selos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
});
