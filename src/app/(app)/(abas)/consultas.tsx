import { router } from 'expo-router';
import { useState } from 'react';
import { Opcao, SeletorOpcoes, TelaLista } from '@/components/comuns';
import { CartaoConsulta } from '@/components/consultas/CartaoConsulta';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useAlterarStatusConsulta, useConsultas } from '@/hooks/useConsultas';
import { extrairMensagemErro } from '@/services/api';
import { LembreteConsulta, StatusConsulta } from '@/types/consulta';
import { mostrarAlerta } from '@/utils/confirmacao';

type Filtro = 'TODAS' | StatusConsulta;

const FILTROS: Opcao<Filtro>[] = [
  { valor: 'PENDENTE', rotulo: 'Pendentes' },
  { valor: 'REALIZADO', rotulo: 'Realizadas' },
  { valor: 'TODAS', rotulo: 'Todas' },
];

const abrirConsulta = (id: number | 'novo') =>
  router.push({ pathname: '/consulta/[id]', params: { id: String(id) } });

/** Lembretes de consulta (GET /idosos/{idIdoso}/lembretes-consulta?status=). */
export default function TelaConsultas() {
  const { ehCuidador } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const [filtro, setFiltro] = useState<Filtro>('PENDENTE');
  const consulta = useConsultas(idIdoso, filtro === 'TODAS' ? undefined : filtro);
  const alterarStatus = useAlterarStatusConsulta();

  const alternarStatus = async (item: LembreteConsulta) => {
    try {
      await alterarStatus.mutateAsync({
        id: item.id,
        status: item.status === 'REALIZADO' ? 'PENDENTE' : 'REALIZADO',
      });
    } catch (erro) {
      mostrarAlerta('Não foi possível atualizar', extrairMensagemErro(erro));
    }
  };

  return (
    <TelaLista<LembreteConsulta>
      titulo="Consultas"
      subtitulo="Lembretes de consultas médicas"
      consulta={consulta}
      semIdoso={idIdoso === undefined}
      acimaDaLista={<SeletorOpcoes opcoes={FILTROS} valor={filtro} aoMudar={setFiltro} />}
      chave={(c) => c.id}
      renderizarItem={(c) => (
        <CartaoConsulta
          consulta={c}
          aoPressionar={() => abrirConsulta(c.id)}
          aoAlternarStatus={ehCuidador ? () => alternarStatus(c) : undefined}
          alterandoStatus={alterarStatus.isPending && alterarStatus.variables?.id === c.id}
        />
      )}
      vazio={{
        icone: 'calendar-outline',
        titulo: filtro === 'REALIZADO' ? 'Nenhuma consulta realizada' : 'Nenhuma consulta',
        descricao: ehCuidador
          ? 'Cadastre as próximas consultas para receber os lembretes.'
          : 'O cuidador ainda não cadastrou consultas.',
      }}
      aoCriar={ehCuidador ? () => abrirConsulta('novo') : undefined}
      rotuloCriar="Nova consulta"
    />
  );
}
