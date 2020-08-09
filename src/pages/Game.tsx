import React, { useState, useEffect } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Location } from 'history';
import { getRoomRef, setGameRoles, setRoundStarted, setRoundEnded, setNextWord, setDreamerScore } from '../services/game.service';
import { Room } from '../interfaces/room.interface';
import Header from '../components/header/Header';
import RoleDescription from '../components/roleDescription/RoleDescription';
import { GameRole } from '../interfaces/game-role.interface';
import { RoundStatus } from '../interfaces/round-status.interface';
import { getCurrentUser } from '../config';
import CurrentWord from '../components/currentWord/CurrentWord';
import firebase from 'firebase';
import Timer from '../components/timer/Timer';

type LocationState = {
  from: Location;
  roomId: string;
};

const useStyles = makeStyles(() => ({
  container: {
    padding: '20px',
  },
  gameActions: {
    marginTop: '20px',

    '& > button': {
      marginRight: '8px',
    },
  },
}));

const Game = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const classes = useStyles();

  const { roomId } = props.location.state;
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(getCurrentUser());
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [userCount, setUserCount] = useState<number>(1);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>(RoundStatus.Idle);
  const [currentRole, setCurrentRole] = useState<GameRole | undefined>(undefined);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [triggerTimer, setTriggerTimer] = useState<boolean>(false);

  firebase.auth().onAuthStateChanged(authUser => {
    setCurrentUser(authUser);
  });

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;

      setUserCount(room.users.length);
      setRoundStatus(room.roundStatus);

      if (room.ownerUid === currentUser?.uid) {
        setIsOwner(true);
      }

      if (!currentRole && room.users) {
        const user = room.users.find(u => u.uid === currentUser?.uid);
        setCurrentRole(user?.roundRole as GameRole);
      }

      if (room.roundStatus === RoundStatus.Started) {
        setCurrentWord(room.currentWord);
      }
    }); 
  }, [roomId, currentUser, roundStatus, currentRole]);

  const startGame = async () => {
    // TODO -> LOADER
    if (userCount < 4) {
      alert('Erro: o jogo só pode iniciar com pelo menos 4 jogadores na sala');
      return;
    }
    await setGameRoles(roomId);
    setRoundStatus(RoundStatus.SettingRoles);
  };

  const resetGame = () => {
    // eslint-disable-next-line no-restricted-globals
    const answer = confirm('Tem certeza que deseja resetar o jogo');
    alert(answer);
  }

  const startRound = async () => {
    await setRoundStarted(roomId);
    setRoundStatus(RoundStatus.Started);
    setTriggerTimer(!triggerTimer);
  }

  const getNextWord = async (guessedCorrectly: boolean): Promise<void> => {
    await setNextWord(roomId, guessedCorrectly);
  }

  const endRound = async () => {
    await setRoundEnded(roomId);
    setRoundStatus(RoundStatus.DreamReview);
  }

  const startNewRound = async (rememberedDream: boolean) => {
    await setDreamerScore(roomId, rememberedDream);
    await setGameRoles(roomId);
    setRoundStatus(RoundStatus.SettingRoles);
  }

  return (
    <>
      <Header roomId={roomId} />
      <Grid container spacing={0}>
        <Grid className={classes.container} item sm={12} md={8}>
          { roundStatus === RoundStatus.Started && currentRole !== GameRole.Sleeper && (
            <>
              <CurrentWord word={currentWord} setGuessedWord={getNextWord} />
              <Timer triggerTimer={triggerTimer} />
            </>
          )}
          <div>
            {roundStatus === RoundStatus.Idle && isOwner && (
              <Button variant="contained" color="primary" onClick={startGame} >
                Iniciar Jogo
              </Button>
            )}
            {roundStatus === RoundStatus.SettingRoles && currentRole === GameRole.Sleeper && (
              <Button variant="contained" onClick={startRound} >
                Iniciar Rodada
              </Button>
            )}
            {roundStatus === RoundStatus.DreamReview && currentRole !== GameRole.Sleeper && (
              <>
                <Button variant="contained" color="primary" onClick={() => startNewRound(true)} >
                  Relembrou Sonho
                </Button>
                <Button variant="contained" color="secondary" onClick={() => startNewRound(false)} >
                  Não Relembrou
                </Button>
              </>
            )}
          </div>
          <div className={classes.gameActions}>
            {roundStatus === RoundStatus.Started && currentRole !== GameRole.Sleeper && (
              <Button variant="contained" onClick={endRound} >
                Finalizar Rodada
              </Button>
            )}
            {isOwner && (
              <Button variant="contained" onClick={resetGame} >
                Resetar Jogo
              </Button>
            )}
          </div>
        </Grid>
        <Grid className={classes.container} item sm={12} md={4}>
          { roundStatus !== RoundStatus.Idle && (<RoleDescription currentRole={currentRole} />) }
        </Grid>
      </Grid>
    </>
  );
}
export default Game;