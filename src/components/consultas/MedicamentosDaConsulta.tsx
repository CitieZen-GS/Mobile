import { Pressable, StyleSheet, View } from 'react-native';
import { Carregando, Icone, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { useAlternarMedicamentoConsulta } from '@/hooks/useConsultas';
import { useMedicamentos } from '@/hooks/useMedicamentos';
import { extrairMensagemErro } from '@/services/api';
import { ALTURA_MINIMA_TOQUE, espacos, raios } from '@/styles/tema';
import { LembreteConsulta } from '@/types/consulta';
import { mostrarAlerta } from '@/utils/confirmacao';
import { formatarHora } from '@/utils/formatadores';

interface MedicamentosDaConsultaProps {
  consulta: LembreteConsulta;
  somenteLeitura: boolean;
}

/**
 * Lista "levar para a consulta": vincula/desvincula medicamentos ao lembrete
 * (tabela associativa T_Ajudante_familiar_Consulta_Medicamento).
 */
export function MedicamentosDaConsulta({ consulta, somenteLeitura }: MedicamentosDaConsultaProps) {
  const { cores } = useTema();
  const medicamentos = useMedicamentos(consulta.idIdoso);
  const alternar = useAlternarMedicamentoConsulta();
  const vinculados = new Set(consulta.medicamentos.map((m) => m.id));

  const aoAlternar = async (idMedicamento: number) => {
    try {
      await alternar.mutateAsync({
        id: consulta.id,
        idMedicamento,
        vincular: !vinculados.has(idMedicamento),
      });
    } catch (erro) {
      mostrarAlerta('Não foi possível atualizar', extrairMensagemErro(erro));
    }
  };

  if (medicamentos.isLoading) return <Carregando mensagem="Carregando medicamentos..." />;

  const lista = somenteLeitura
    ? (medicamentos.data ?? []).filter((m) => vinculados.has(m.id))
    : (medicamentos.data ?? []);

  return (
    <View style={estilos.container}>
      <Texto variante="subtitulo">Levar para a consulta</Texto>
      <Texto variante="legenda" cor="textoSecundario">
        {somenteLeitura
          ? 'Medicamentos que o cuidador separou para mostrar ao médico.'
          : 'Toque para marcar os remédios que devem ser levados ou mostrados ao médico.'}
      </Texto>

      {lista.length === 0 && <Texto cor="textoSuave">Nenhum medicamento.</Texto>}

      {lista.map((m) => {
        const marcado = vinculados.has(m.id);
        const ocupado = alternar.isPending && alternar.variables?.idMedicamento === m.id;
        return (
          <Pressable
            key={m.id}
            disabled={somenteLeitura || alternar.isPending}
            onPress={() => aoAlternar(m.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: marcado, busy: ocupado }}
            accessibilityLabel={m.nome}
            style={[
              estilos.item,
              {
                borderColor: marcado ? cores.primaria : cores.borda,
                backgroundColor: marcado ? cores.primariaClara : cores.superficie,
                opacity: ocupado ? 0.5 : 1,
              },
            ]}
          >
            <Icone
              nome={marcado ? 'checkbox' : 'square-outline'}
              cor={marcado ? cores.primaria : cores.textoSuave}
            />
            <Texto variante="corpoNegrito" style={estilos.nome}>
              {m.nome}
            </Texto>
            <Texto cor="textoSecundario">{formatarHora(m.hora)}</Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacos.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    minHeight: ALTURA_MINIMA_TOQUE,
    paddingHorizontal: espacos.md,
    borderWidth: 1.5,
    borderRadius: raios.md,
  },
  nome: { flex: 1 },
});
