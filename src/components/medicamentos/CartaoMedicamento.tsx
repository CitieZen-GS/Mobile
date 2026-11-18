import { StyleSheet, View } from 'react-native';
import { Cartao, Icone, Selo, Texto } from '@/components/comuns';
import { useTema } from '@/contexts/TemaContext';
import { espacos, raios } from '@/styles/tema';
import { Medicamento } from '@/types/medicamento';
import { dataApiParaTela, formatarHora } from '@/utils/formatadores';

interface CartaoMedicamentoProps {
  medicamento: Medicamento;
  aoPressionar: () => void;
}

export function CartaoMedicamento({ medicamento, aoPressionar }: CartaoMedicamentoProps) {
  const { cores } = useTema();
  const hora = formatarHora(medicamento.hora);

  return (
    <Cartao aoPressionar={aoPressionar} rotuloAcessivel={`${medicamento.nome} às ${hora}`}>
      <View style={estilos.linha}>
        <View style={[estilos.hora, { backgroundColor: cores.destaqueClaro }]}>
          <Icone nome="alarm-outline" cor={cores.destaque} tamanho={18} />
          <Texto variante="subtitulo" style={{ color: cores.destaque }}>
            {hora}
          </Texto>
        </View>
        <View style={estilos.info}>
          <Texto variante="subtitulo">{medicamento.nome}</Texto>
          {medicamento.frequencia && <Texto cor="textoSecundario">{medicamento.frequencia}</Texto>}
        </View>
        <Icone nome="chevron-forward" cor={cores.textoSuave} />
      </View>
      {medicamento.instrucaoUso && <Texto variante="legenda">{medicamento.instrucaoUso}</Texto>}
      <View style={estilos.selos}>
        {medicamento.viaAdministracao && <Selo texto={medicamento.viaAdministracao} />}
        {medicamento.data && (
          <Selo texto={`Desde ${dataApiParaTela(medicamento.data)}`} tom="aviso" />
        )}
      </View>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  hora: {
    alignItems: 'center',
    paddingHorizontal: espacos.sm,
    paddingVertical: espacos.xs,
    borderRadius: raios.md,
    minWidth: 72,
  },
  info: { flex: 1 },
  selos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
});
