import { StyleSheet, View } from 'react-native';
import { Botao, Cartao, Icone, Selo, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos, raios } from '@/styles/tema';
import { LembreteConsulta } from '@/types/consulta';
import { formatarHora } from '@/utils/formatadores';

interface CartaoConsultaProps {
  consulta: LembreteConsulta;
  aoPressionar: () => void;
  /** Só o cuidador pode alterar o status. */
  aoAlternarStatus?: () => void;
  alterandoStatus?: boolean;
}

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function CartaoConsulta({
  consulta,
  aoPressionar,
  aoAlternarStatus,
  alterandoStatus = false,
}: CartaoConsultaProps) {
  const { cores } = useTema();
  const [, mes, dia] = consulta.dataConsulta.split('-');
  const realizada = consulta.status === 'REALIZADO';

  return (
    <Cartao aoPressionar={aoPressionar} rotuloAcessivel={`Consulta ${consulta.titulo}`}>
      <View style={estilos.linha}>
        <View
          style={[
            estilos.calendario,
            { backgroundColor: realizada ? cores.superficieSutil : cores.primariaClara },
          ]}
        >
          <Texto variante="titulo" cor={realizada ? 'textoSuave' : 'primaria'}>
            {dia}
          </Texto>
          <Texto variante="legenda" cor={realizada ? 'textoSuave' : 'primaria'}>
            {MESES[Number(mes) - 1]}
          </Texto>
        </View>
        <View style={estilos.info}>
          <Texto variante="subtitulo">{consulta.titulo}</Texto>
          <Texto cor="textoSecundario">
            {[
              formatarHora(consulta.horaConsulta),
              consulta.nomeMedico && `Dr(a). ${consulta.nomeMedico}`,
            ]
              .filter(Boolean)
              .join(' · ') || 'Horário a confirmar'}
          </Texto>
          <Selo
            texto={realizada ? 'Realizada' : 'Pendente'}
            tom={realizada ? 'sucesso' : 'aviso'}
          />
        </View>
        <Icone nome="chevron-forward" cor={cores.textoSuave} />
      </View>

      {consulta.medicamentos.length > 0 && (
        <Texto variante="legenda" cor="textoSecundario">
          Levar: {consulta.medicamentos.map((m) => m.nome).join(', ')}
        </Texto>
      )}

      {aoAlternarStatus && (
        <Botao
          titulo={realizada ? 'Marcar como pendente' : 'Marcar como realizada'}
          icone={realizada ? 'arrow-undo-outline' : 'checkmark-done'}
          variante={realizada ? 'fantasma' : 'secundario'}
          aoPressionar={aoAlternarStatus}
          carregando={alterandoStatus}
        />
      )}
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  calendario: {
    width: 64,
    paddingVertical: espacos.sm,
    borderRadius: raios.md,
    alignItems: 'center',
  },
  info: { flex: 1, gap: 2 },
});
