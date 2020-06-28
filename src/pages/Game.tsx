import React, { useState, useEffect } from 'react';
import { Location } from 'history';
import { RouteComponentProps, StaticContext } from 'react-router';
import { getRoomRef, setGameRoles, setRoundStarted, setRoundEnded } from '../services/game.service';
import { Room } from '../interfaces/room.interface';
import Header from '../components/header/Header';
import RoleDescription from '../components/roleDescription/RoleDescription';
import { GameRole } from '../interfaces/game-role.interface';
import { RoundStatus } from '../interfaces/round-status.interface';
import { getCurrentUser } from '../config';

type LocationState = {
  from: Location;
  roomId: string;
};

const Game = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  const { roomId } = props.location.state;
  const currentUser = getCurrentUser();
  const [userCount, setUserCount] = useState<number>(1);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>(RoundStatus.Idle);
  const [currentRole, setCurrentRole] = useState<GameRole>(GameRole.Sleeper);
  const [currentWord, setCurrentWord] = useState<string>('');

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;

      setUserCount(room.users.length);
      setRoundStatus(room.roundStatus);

      if (room.roundStatus === RoundStatus.SettingRoles && room.users) {
        const user = room.users.find(u => u.uid === currentUser?.uid);
        setCurrentRole(user?.roundRole as GameRole);
      }

      if (room.roundStatus === RoundStatus.Started) {
        setCurrentWord(room.currentWord);
      }
    }); 
  }, [roomId, currentUser, roundStatus, currentRole]);

  const startGame = async () => {
    // TODO -> 4
    // TODO -> LOADER
    if (userCount < 2) {
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
  }

  const setScore = async (scored: boolean) => {
    // TODO: SET SCORE IN FIREBASE AND GET ANOTHER WORD
  }

  const endRound = async () => {
    await setRoundEnded(roomId);
    setRoundStatus(RoundStatus.DreamReview);
  }

  return (
    <>
      <Header roomId={roomId} />
      <div>
        <h1>Let's Play! Room ID: { roomId }</h1>
        {roundStatus === RoundStatus.Idle && (
          <button onClick={startGame} >
            Iniciar Jogo
          </button>
        )}
        {roundStatus === RoundStatus.SettingRoles && (
          <button onClick={startRound} >
            Iniciar Rodada
          </button>
        )}
        {roundStatus === RoundStatus.Started && (
          <button onClick={endRound} >
            Finalizar Rodada
          </button>
        )}
        <button onClick={resetGame} >
          Resetar Jogo
        </button>
      </div>
      { roundStatus !== RoundStatus.Idle && (<RoleDescription currentRole={currentRole} />) }
      { roundStatus === RoundStatus.Started && (<p>Palavra: {currentWord}</p>)}
      {roundStatus === RoundStatus.Started && (
        <button onClick={() => setScore(true)} >
          Acertou!
        </button>
      )}
      {roundStatus === RoundStatus.Started && (
        <button onClick={() => setScore(false)} >
          Errou!
        </button>
      )}
    </>
  );
}
export default Game;