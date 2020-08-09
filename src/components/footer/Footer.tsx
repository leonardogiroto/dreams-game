import React, { useEffect, useState } from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
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
  pointsRules: {
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
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
  dialogContent: {
    '& p:first-child': {
      marginTop: 0,
    },
  }
}));

const Footer = (props: HeaderProps) => {
  const { roomId } = props;
  const classes = useStyles();

  const [users, setUsers] = useState<Array<RoomUser>>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;
      setUsers(room.users);
    }); 
  }, [roomId]);

  return (
    <footer className={classes.footer}>
      <p className={classes.pointsRules} onClick={() => setOpen(true)}>
        <strong>PONTUAÇÃO (?)</strong>
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
      <Dialog
        open={open}
        keepMounted
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Pontuação</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <p>
            <strong>Sonhador: </strong>
            Ganha 1 ponto para cada resposta correta + 2 pontos extra se recontar seu sonho por completo.
          </p>
          <p>
            <strong>Fada: </strong>
            Ganha 1 ponto para cada resposta correta do Sonhador.
          </p>
          <p>
            <strong>Bicho-Papão: </strong>
            Ganha 1 ponto para cada resposta errada do Sonhador.
          </p>
          <p>
            <strong>Sandman: </strong>
            Ganha mais pontos quando há equilíbrio na quantidade de respostas corretas e erradas do Sonhador. É tal que:
          </p>
          <ul>
            <li>
              Se o número de acertos for igual ao de erros, ganha 1 ponto por cada acerto + 2 pontos extra.
            </li>
            <li>
              Se a diferença entre o número de acertos e de erros for igual a 1, ganha a maior pontuação, ou seja,
              1 ponto para cada acerto (se tiver sido maioria) ou erro (se tiver sido maioria).
            </li>
            <li>
              Se a diferença entre o número de acertos e de erros for maior do que 1, ganha a menor pontuação, ou seja,
              ganha 1 ponto para cada acerto (se tiver sido minoria) ou erro (se tiver sido minoria).
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
export default Footer;
