import { StyleSheet, View } from 'react-native';
import { Opcao, Selo } from '@/components/comuns';
import { espacos } from '@/styles/tema';
import { Relatorio, StatusRelatorio, TipoRelatorio } from '@/types/relatorio';

/** Assuntos aceitos pela API de RAG (também usados no seletor do formulário). */
export const TIPOS_RELATORIO: Opcao<TipoRelatorio>[] = [
  { valor: 'GERAL', rotulo: 'Geral' },
  { valor: 'MEDICAMENTOS', rotulo: 'Remédios' },
  { valor: 'ALIMENTACAO', rotulo: 'Alimentação' },
  { valor: 'ATIVIDADES', rotulo: 'Atividades' },
  { valor: 'CONSULTAS', rotulo: 'Consultas' },
];

const SITUACAO: Record<StatusRelatorio, { texto: string; tom: 'aviso' | 'sucesso' | 'erro' }> = {
  GERANDO: { texto: 'Gerando...', tom: 'aviso' },
  CONCLUIDO: { texto: 'Pronto', tom: 'sucesso' },
  ERRO: { texto: 'Não gerado', tom: 'erro' },
};

/** Assunto e situação do relatório (GERANDO → CONCLUIDO ou ERRO). */
export function SelosRelatorio({ relatorio }: { relatorio: Relatorio }) {
  const tipo = TIPOS_RELATORIO.find((t) => t.valor === relatorio.tipo)?.rotulo ?? relatorio.tipo;
  const situacao = SITUACAO[relatorio.status];

  return (
    <View style={estilos.selos}>
      <Selo texto={tipo} />
      <Selo texto={situacao.texto} tom={situacao.tom} />
    </View>
  );
}

const estilos = StyleSheet.create({
  selos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
});
