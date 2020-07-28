import React, { useState } from 'react';
import { createRoom as createRoomDb, joinRoom as joinRoomDb, getRoomRef } from '../services/game.service';
import { useHistory } from 'react-router';
import { Button, TextField, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  section: {
    textAlign: 'center',
    maxWidth: 400,
    margin: '12px auto',
  },
  joinRoom: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 24,
    marginBottom: 36,

    '& .MuiTextField-root': {
      margin: '12px 0px',
    },
  },
  createBtn: {
    marginTop: 8,
  }
}));

const GameLobby = () => {
  const classes = useStyles();
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
    <section className={classes.section}>
      <Typography component="h1" variant="h2">Game Lobby</Typography>
      <div className={classes.joinRoom}>
        <Typography>Insira abaixo o ID da sala para se juntar a ela!</Typography>
        <TextField label="Room ID" variant="outlined" type="text" value={roomId} onChange={(event) => setRoomId(event.target.value)} />
        <Button type="button" variant="contained" color="primary" onClick={joinRoom} disabled={!roomId}>Entrar Sala</Button>
      </div>
      <Typography>Caso queira criar uma sala, clique abaixo!</Typography>
      <Button className={classes.createBtn} type="button" variant="contained" onClick={createRoom} fullWidth>Criar Sala</Button>
    </section>
  );
}
export default GameLobby;