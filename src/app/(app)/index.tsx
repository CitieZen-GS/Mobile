import { Botao, Tela, Texto } from '@/components/comuns';
import { useAutenticacao } from '@/contexts/AutenticacaoContext';

export default function TelaInicio() {
  const { usuario, sair } = useAutenticacao();

  return (
    <Tela titulo={`Olá, ${usuario?.nome ?? ''}`}>
      <Texto cor="textoSecundario">
        Perfil: {usuario?.perfil === 'CUIDADOR' ? 'Cuidador' : 'Familiar'}
      </Texto>
      <Botao titulo="Sair" variante="perigo" icone="log-out-outline" aoPressionar={sair} />
    </Tela>
  );
}
