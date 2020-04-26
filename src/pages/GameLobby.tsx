import React from 'react';
import { createRoom as createRoomDb } from '../services/game.service';
import { useHistory } from 'react-router';

const GameLobby = () => {
  const history = useHistory();

  const createRoom = async () => {
    const roomId = await createRoomDb('My Room!');
    history.push('game', { roomId })
  }

  const joinRoom = () => {

  }

  return (
    <div>
      <h1>GameLobby!</h1>
      <button type="button" onClick={createRoom} >Criar Sala</button>
      <button type="button" onClick={joinRoom} >Entrar Sala</button>
    </div>
  );
}
export default GameLobby;