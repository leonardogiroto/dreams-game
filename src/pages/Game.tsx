import React from 'react';
import { Location } from 'history';
import { RouteComponentProps, StaticContext } from 'react-router';
import { getRoomRef, setGameRoles } from '../services/game.service';
import { Room, RoomUser } from '../interfaces/room.interface';

type LocationState = {
  from: Location;
  roomId: string;
};

const Game = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const { roomId } = props.location.state;

  const startGame = () => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room: Room = snapshot.val();
      const users: Array<RoomUser> = Object.values(room.users);
      if (!users || users.length < 2) {
        alert('Erro: o jogo só pode iniciar com pelo menos 4 jogadores na sala');
      }
      startRound(room.lastSleeperIndex);
    });
  };

  const startRound = (lastSleeperIndex: number) => {
    setGameRoles(roomId, lastSleeperIndex);
    // CURRENT ROUND = 1
    // LIBERAR BOTÃO PARA INICIAR TIMER
  }

  return (
    <div>
      <h1>Let's Play! Room ID: { roomId }</h1>
      <button onClick={startGame} >
        Iniciar Jogo
      </button>
    </div>
  );
}
export default Game;