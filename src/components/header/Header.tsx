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

    '& p:last-child': {
      textAlign: 'right',
    },
  },
}));

const Header = (props: HeaderProps) => {
  const { roomId } = props;
  const classes = useStyles();

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>(RoundStatus.Idle);
  const [playersCount, setPlayersCount] = useState<number>(1);

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;
      setCurrentRound(room.currentRound);
      setRoundStatus(room.roundStatus);
      setPlayersCount(room.users ? room.users.length : 0);
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
      <p>
        <strong>Room ID:</strong> {roomId}
        <br />
        {playersCount} pessoas na sala
      </p>
    </header>
  )
}
export default Header;
