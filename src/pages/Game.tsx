import React from 'react';
import { Location } from 'history';
import { RouteComponentProps, StaticContext } from 'react-router';

type LocationState = {
  from: Location;
  roomId: string;
};

const Game = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const { roomId } = props.location.state;

  const startRound = () => {
    // DISTRIBUIR PAPÉIS PARA CADA USUÁRIO
    // LIBERAR BOTÃO PARA INICIAR TIMER
  };

  return (
    <div>
      <h1>Let's Play! Room ID: { roomId }</h1>
      <button onClick={startRound} ></button>
    </div>
  );
}
export default Game;