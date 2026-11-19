import { router } from 'expo-router';
import { TelaLista } from '@/components/comuns';
import { CartaoRelatorio } from '@/components/relatorios/CartaoRelatorio';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useRelatorios } from '@/hooks/useRelatorios';
import { Relatorio } from '@/types/relatorio';

const abrirRelatorio = (id: number) =>
  router.push({ pathname: '/relatorios/[id]', params: { id: String(id) } });

/**
 * Relatórios do idoso gerados pela IA (GET /idosos/{idIdoso}/relatorios, API de RAG).
 * Enquanto algum estiver "Gerando...", a lista se atualiza sozinha.
 */
export default function TelaRelatorios() {
  const { idIdoso } = useIdosoSelecionado();
  const consulta = useRelatorios(idIdoso);

  return (
    <TelaLista<Relatorio>
      titulo="Relatórios"
      subtitulo="Resumos do período escritos pela IA"
      comVoltar
      consulta={consulta}
      semIdoso={idIdoso === undefined}
      chave={(r) => r.id}
      renderizarItem={(r) => (
        <CartaoRelatorio relatorio={r} aoPressionar={() => abrirRelatorio(r.id)} />
      )}
      vazio={{
        icone: 'document-text-outline',
        titulo: 'Nenhum relatório',
        descricao: 'Peça um relatório para levar à consulta ou repassar à família.',
      }}
      aoCriar={() => router.push('/relatorios/novo')}
      rotuloCriar="Novo relatório"
    />
  );
}
