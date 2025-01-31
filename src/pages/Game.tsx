import React, { useState, useEffect } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Location } from 'history';
import { getRoomRef, setGameRoles, setRoundStarted, setRoundEnded, setNextWord, setDreamerScore } from '../services/game.service';
import { Room } from '../interfaces/room.interface';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import RoleDescription from '../components/roleDescription/RoleDescription';
import { GameRole } from '../interfaces/game-role.interface';
import { RoundStatus } from '../interfaces/round-status.interface';
import { getCurrentUser } from '../config';
import CurrentWord from '../components/currentWord/CurrentWord';
import firebase from 'firebase';
import Timer from '../components/timer/Timer';
import HowItWorks from '../components/howItWorks/HowItWorks';

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
  const [roundWords, setRoundWords] = useState<Array<string>>([]);
  const [isResponsibleForGuessedWord, setIsResponsibleForGuessedWord] = useState<boolean>(false);
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
        
        const lastSleeperUser = room.users[room.lastSleeperIndex];
        setIsResponsibleForGuessedWord(user?.uid === lastSleeperUser.uid);
      }

      if (room.roundStatus === RoundStatus.Started) {
        setCurrentWord(room.currentWord);
      }
      
      if (room.roundStatus === RoundStatus.SettingRoles) {
        setRoundWords([]);
      }

      if (room.roundStatus === RoundStatus.DreamReview) {
        const roundWordsCount = room.currentScore.correct + room.currentScore.incorrect;
        const wordsLength = room.usedWords.length - 1;
        const words = room.usedWords.slice((wordsLength - roundWordsCount), wordsLength);
        setRoundWords(words);
      }
    }); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getDreamReviewContent = (userRole: GameRole): JSX.Element => {
    const DreamReviewDescription = (
      <p>
        O sonhador deve agora contar para os outros com o que sonhou!
        <br />
        Conte uma história sobre o seu sonho, que envolva todas as palavras que você disse.
        <br />
        Se você conseguir lembrar de tudo, ganha pontos extras!
      </p>
    );
  
    if (userRole === GameRole.Sleeper) {
      return DreamReviewDescription;
    }
  
    return (
      <>
        {DreamReviewDescription}
        <p>
          Palavras da rodada:
        </p>
        <ul>{
          roundWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))
        }</ul>
        <Button variant="contained" color="primary" onClick={() => startNewRound(true)} >
          Relembrou Sonho
        </Button>&nbsp;&nbsp;
        <Button variant="contained" color="secondary" onClick={() => startNewRound(false)} >
          Não Relembrou
        </Button>
      </>
    );
  }

  return (
    <>
      <Header roomId={roomId} />
      <Grid container spacing={0}>
        <Grid className={classes.container} item sm={12} md={8}>
          {/* Rodada em Andamento */}
          { roundStatus === RoundStatus.Started && currentRole !== GameRole.Sleeper && (
            <>
              <CurrentWord
                word={currentWord}
                setGuessedWord={getNextWord}
                isResponsibleForGuessedWord={isResponsibleForGuessedWord}
              />
              <Timer triggerTimer={triggerTimer} />
              <HowItWorks
                isResponsibleForGuessedWord={isResponsibleForGuessedWord}
              />
            </>
          )}
          <div>
            {/* Aguardando Início do Jogo */}
            {roundStatus === RoundStatus.Idle && isOwner && (
              <Button variant="contained" color="primary" onClick={startGame} >
                Iniciar Jogo
              </Button>
            )}
            {/* Aguardando Início da Rodada Inicial */}
            {roundStatus === RoundStatus.SettingRoles && currentRole === GameRole.Sleeper && (
              <Button variant="contained" onClick={startRound} >
                Iniciar Rodada
              </Button>
            )}
            {/* Revisitando o Sonho */}
            {roundStatus === RoundStatus.DreamReview && (
              getDreamReviewContent(currentRole as GameRole)
            )}
          </div>
          <div className={classes.gameActions}>
            {/* Finalizar Rodada */}
            {roundStatus === RoundStatus.Started && currentRole !== GameRole.Sleeper && (
              <Button variant="contained" onClick={endRound} >
                Finalizar Rodada
              </Button>
            )}
            {/* Resetar Jogo por Completo (TODO) */}
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
      <Footer roomId={roomId} />
    </>
  );
}
export default Game;