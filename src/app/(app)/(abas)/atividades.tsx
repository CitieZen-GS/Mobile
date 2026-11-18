import { router } from 'expo-router';
import { useState } from 'react';
import { Opcao, SeletorOpcoes, TelaLista } from '@/components/comuns';
import { CartaoAtividade } from '@/components/atividades/CartaoAtividade';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useAtividades } from '@/hooks/useAtividades';
import { Atividade } from '@/types/atividade';
import { hojeApi } from '@/utils/formatadores';

type Filtro = 'HOJE' | 'TODAS';

const FILTROS: Opcao<Filtro>[] = [
  { valor: 'HOJE', rotulo: 'Hoje' },
  { valor: 'TODAS', rotulo: 'Todas' },
];

const abrirAtividade = (id: number | 'novo') =>
  router.push({ pathname: '/atividade/[id]', params: { id: String(id) } });

/** Atividades do idoso (GET /idosos/{idIdoso}/atividades?data=). */
export default function TelaAtividades() {
  const { ehCuidador } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const [filtro, setFiltro] = useState<Filtro>('HOJE');
  const consulta = useAtividades(idIdoso, filtro === 'HOJE' ? hojeApi() : undefined);

  return (
    <TelaLista<Atividade>
      titulo="Atividades"
      subtitulo="Rotina de exercícios, passeios e cuidados"
      consulta={consulta}
      semIdoso={idIdoso === undefined}
      acimaDaLista={<SeletorOpcoes opcoes={FILTROS} valor={filtro} aoMudar={setFiltro} />}
      chave={(a) => a.id}
      renderizarItem={(a) => (
        <CartaoAtividade atividade={a} aoPressionar={() => abrirAtividade(a.id)} />
      )}
      vazio={{
        icone: 'walk-outline',
        titulo: filtro === 'HOJE' ? 'Nada planejado para hoje' : 'Nenhuma atividade',
        descricao: ehCuidador
          ? 'Planeje caminhadas, fisioterapia e momentos de lazer.'
          : 'O cuidador ainda não cadastrou atividades.',
      }}
      aoCriar={ehCuidador ? () => abrirAtividade('novo') : undefined}
      rotuloCriar="Nova atividade"
    />
  );
}
