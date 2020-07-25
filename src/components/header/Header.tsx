import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { RoundStatus } from '../../interfaces/round-status.interface';
import { getRoomRef } from '../../services/game.service';
import { Room } from '../../interfaces/room.interface';

interface HeaderProps {
  roomId: string;
}

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: 'white',
    padding: '0 16px',
  },
}));

const Header = (props: HeaderProps) => {
  const { roomId } = props;
  const classes = useStyles();

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>(RoundStatus.Idle);
  // const [scores, setCurrentRound] = useState<Array<>(0);

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;

      setCurrentRound(room.currentRound);
      setRoundStatus(room.roundStatus);

      // if (room.roundStatus === RoundStatus.SettingRoles && room.users) {
      //   const user = room.users.find(u => u.uid === currentUser?.uid);
      //   setCurrentRole(user?.roundRole as GameRole);
      // }
    }); 
  }, [roomId, currentRound, roundStatus]);

  const getStatusDescription = (status: RoundStatus): string => {
    switch (status) {
      case RoundStatus.Idle:
        return 'Aguardando jogo ser iniciado.';
      case RoundStatus.SettingRoles:
        return 'Papéis distribuídos. Aguardando rodada ser iniciada.';
      case RoundStatus.Started:
        return 'Rodada em andamento!';
      case RoundStatus.DreamReview:
        return 'Revisitando o sonho...';
      default:
        return '';
    }
  };

  return (
    <header className={classes.header}>
      <p>
        <strong>Rodada Atual:</strong> {currentRound}
        <br />
        <strong>Status:</strong> {getStatusDescription(roundStatus)}
      </p>
      {/* <p>Scores: {score}</p> */}
      <p><strong>Room ID:</strong> {roomId}</p>
    </header>
  )
}
export default Header;
