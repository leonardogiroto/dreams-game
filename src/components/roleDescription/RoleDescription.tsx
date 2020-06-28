import React from 'react';
import { GameRole } from '../../interfaces/game-role.interface';

interface RoleDescriptionProps {
  currentRole: GameRole;
}

const RoleDescription = (props: RoleDescriptionProps) => {
  const { currentRole } = props;

  const getRoleDescription = (role: GameRole): string => {
    switch (role) {
      case GameRole.Sleeper:
        return 'É a sua vez de dormir! Feche os olhos e descanse. Bons sonhos! zZzZ';
      case GameRole.Fairy:
        return 'Você está jogando como Fada! Seu objetivo é fazer a pessoa que está dormindo adivinhar o maior número de palavras possíveis.';
      case GameRole.Sandman:
        return 'Você está jogando como Sandman! Seu objetivo é fazer a pessoa que está dormindo ter um número igual de erros e acertos de palavras.';
      case GameRole.Bogeyman:
        return 'Você está jogando como Bicho-Papão! Seu objetivo é fazer a pessoa que está dormindo errar o maior número de palavras possíveis.';
      default:
        return '';
    }
  }

  return (
    <p>{getRoleDescription(currentRole)}</p>
  )
}
export default RoleDescription;
