import React, { useState } from 'react';
import { createRoom as createRoomDb, joinRoom as joinRoomDb, getRoomRef } from '../services/game.service';
import { useHistory } from 'react-router';

const GameLobby = () => {
  const history = useHistory();
  const [ roomId, setRoomId ] = useState('');

  const createRoom = async () => {
    const roomId = await createRoomDb('My Room!');
    history.push('game', { roomId })
  }

  const joinRoom = () => {
    const roomRef = getRoomRef(roomId);
    roomRef.once('value', async snapshot => {
      if (snapshot.exists()) {
        await joinRoomDb(roomRef);
        history.push('game', { roomId })
      } else {
        alert('Erro: essa sala não existe');
      }
    });
  }

  return (
    <div>
      <h1>GameLobby!</h1>
      <button type="button" onClick={createRoom} >Criar Sala</button>
      <input type="text" value={roomId} onChange={(event) => setRoomId(event.target.value)} />
      <button type="button" onClick={joinRoom} >Entrar Sala</button>
    </div>
  );
}
export default GameLobby;