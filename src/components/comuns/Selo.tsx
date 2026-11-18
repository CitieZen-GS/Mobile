import { StyleSheet, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { espacos, raios } from '@/styles/tema';
import { Texto } from './Texto';

type TomSelo = 'primario' | 'sucesso' | 'aviso' | 'erro' | 'destaque';

interface SeloProps {
  texto: string;
  tom?: TomSelo;
}

/** Etiqueta pequena para status (ex.: Pendente, Realizado, Café da manhã). */
export function Selo({ texto, tom = 'primario' }: SeloProps) {
  const { cores } = useTema();
  const paleta = {
    primario: { fundo: cores.primariaClara, texto: cores.primaria },
    sucesso: { fundo: cores.sucessoClaro, texto: cores.sucesso },
    aviso: { fundo: cores.avisoClaro, texto: cores.aviso },
    erro: { fundo: cores.erroClaro, texto: cores.erro },
    destaque: { fundo: cores.destaqueClaro, texto: cores.destaque },
  }[tom];

  return (
    <View style={[estilos.selo, { backgroundColor: paleta.fundo }]}>
      <Texto variante="legenda" style={{ color: paleta.texto }}>
        {texto}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacos.sm + 2,
    paddingVertical: 2,
    borderRadius: raios.pilula,
  },
});
