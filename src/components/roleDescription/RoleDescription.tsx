import React from 'react';
import { makeStyles } from '@material-ui/core';
import { GameRole } from '../../interfaces/game-role.interface';

interface RoleDescriptionProps {
  currentRole: GameRole | undefined;
}

const useStyles = makeStyles((theme) => ({
  roleImage: {
    width: '300px',
  },
}));

const RoleDescription = (props: RoleDescriptionProps) => {
  const { currentRole } = props;
  const classes = useStyles();

  const getRoleImageSrc = (role: GameRole | undefined): string => {
    switch (role) {
      case GameRole.Sleeper:
        return 'https://img.elo7.com.br/product/zoom/29578CC/sweet-dreams-lua-mdf-mdf.jpg';
      case GameRole.Fairy:
        return 'https://i.pinimg.com/736x/1c/8d/9a/1c8d9af9c504401822234c87a8688a5a.jpg';
      case GameRole.Sandman:
        return 'https://vignette.wikia.nocookie.net/fiction-battlefield/images/1/11/Sandman.jpg/revision/latest?cb=20190303143502&path-prefix=pt-br';
      case GameRole.Bogeyman:
        return 'https://i.pinimg.com/originals/8a/e6/f3/8ae6f34b1dc78427309d679d462827dc.jpg';
      default:
        return '';
    }
  };

  const getRoleDescription = (role: GameRole | undefined): string => {
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
  };

  return (
    <>
      <img className={classes.roleImage} src={getRoleImageSrc(currentRole)} alt="" />
      <p>{getRoleDescription(currentRole)}</p>
    </>
  )
}
export default RoleDescription;
