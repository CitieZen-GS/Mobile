import { Alert, Platform } from 'react-native';

/**
 * Pergunta de confirmação (ex.: antes de excluir).
 * No celular usa o Alert nativo; no navegador, o window.confirm.
 */
export function confirmar(titulo: string, mensagem: string, textoConfirmar = 'Excluir') {
  return new Promise<boolean>((resolver) => {
    if (Platform.OS === 'web') {
      resolver(window.confirm(`${titulo}\n\n${mensagem}`));
      return;
    }
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolver(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolver(true) },
      ],
      { cancelable: true, onDismiss: () => resolver(false) },
    );
  });
}
