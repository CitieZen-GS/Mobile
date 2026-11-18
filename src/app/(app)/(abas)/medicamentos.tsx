import { router } from 'expo-router';
import { TelaLista } from '@/components/comuns';
import { CartaoMedicamento } from '@/components/medicamentos/CartaoMedicamento';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';
import { useIdosoSelecionado } from '@/contexts/IdosoSelecionadoContext';
import { useMedicamentos } from '@/hooks/useMedicamentos';
import { Medicamento } from '@/types/medicamento';

const abrirMedicamento = (id: number | 'novo') =>
  router.push({ pathname: '/medicamento/[id]', params: { id: String(id) } });

/** Lista de medicamentos do idoso (GET /idosos/{idIdoso}/medicamentos). */
export default function TelaMedicamentos() {
  const { ehCuidador } = useAutenticacao();
  const { idIdoso } = useIdosoSelecionado();
  const consulta = useMedicamentos(idIdoso);

  return (
    <TelaLista<Medicamento>
      titulo="Medicamentos"
      subtitulo="Horários e instruções de uso"
      consulta={consulta}
      semIdoso={idIdoso === undefined}
      chave={(m) => m.id}
      renderizarItem={(m) => (
        <CartaoMedicamento medicamento={m} aoPressionar={() => abrirMedicamento(m.id)} />
      )}
      vazio={{
        icone: 'medkit-outline',
        titulo: 'Nenhum medicamento',
        descricao: ehCuidador
          ? 'Cadastre os remédios com horário para não esquecer nenhuma dose.'
          : 'O cuidador ainda não cadastrou medicamentos.',
      }}
      aoCriar={ehCuidador ? () => abrirMedicamento('novo') : undefined}
      rotuloCriar="Novo medicamento"
    />
  );
}
