import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

export type NomeIcone = ComponentProps<typeof Ionicons>['name'];

interface IconeProps {
  nome: NomeIcone;
  tamanho?: number;
  cor: string;
}

/** Ícones do app (Ionicons, já incluso no Expo). */
export function Icone({ nome, tamanho = 22, cor }: IconeProps) {
  return <Ionicons name={nome} size={tamanho} color={cor} />;
}
