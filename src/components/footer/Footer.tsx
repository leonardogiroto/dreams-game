import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { getRoomRef } from '../../services/game.service';
import { Room, RoomUser } from '../../interfaces/room.interface';

interface HeaderProps {
  roomId: string;
}

const useStyles = makeStyles((theme) => ({
  footer: {
    background: theme.palette.primary.main,
    color: 'white',
    padding: '4px 16px',
    width: 'calc(100% - 32px)',
  },
  users: {
    display: 'flex',
    flexWrap: 'wrap',

    '& p': {
      margin: '0px 24px 4px 0px',

      '&:last-child': {
        marginBottom: 16,
      },
    },
  },
}));

const Footer = (props: HeaderProps) => {
  const { roomId } = props;
  const classes = useStyles();

  const [users, setUsers] = useState<Array<RoomUser>>([]);

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;
      setUsers(room.users);
    }); 
  }, [roomId]);

  return (
    <footer className={classes.footer}>
      <p>
        <strong>PONTUAÇÃO</strong>
      </p>
      <div className={classes.users}>
      {
        users.map((user, index) => {
          return (
            <p key={index}>
              <strong>{user.email}:</strong> {user.points} pontos
            </p>
          );
        })
      }
      </div>
    </footer>
  )
}
export default Footer;
