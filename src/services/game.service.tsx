import { db, getCurrentUser } from '../config';
import { RoomUser, Room } from '../interfaces/room.interface';
import { GameRole } from '../interfaces/game-role.interface';
import { RoundStatus } from '../interfaces/round-status.interface';
import { RandomWords } from '../static/random-words';

export const createRoom = async (roomName: string): Promise<string | null> => {
  const ref = db.ref('rooms').push();
  const id = ref.key;
  const currentUser = getCurrentUser();
  await ref.set({
    roomName, currentRound: 0, lastSleeperIndex: 0,
    roundStatus: RoundStatus.Idle,
    ownerUid: currentUser?.uid,
    usedWords: [],
    users: [{ uid: currentUser?.uid, email: currentUser?.email, points: 0 }]
  });
  return id;
};

export const joinRoom = async (roomRef: firebase.database.Reference) => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.uid) {
    alert('Você deve estar logado para entrar em uma sala');
  } else {
    const usersRef = roomRef.child('/users');
    usersRef.once('value', (snapshot) => {
      const users: Array<RoomUser> = Object.values(snapshot.val());
      const userAlreadyInRoom = users.some(u => u.uid === currentUser.uid);
      if (!userAlreadyInRoom) {
        usersRef.set([
          ...users, {
            points: 0,
            uid: currentUser.uid,
            email: currentUser.email,
          } as RoomUser,
        ]);
      }
    });
  }
}

export const setGameRoles = async (roomId: string) => {
  const roomRef = getRoomRef(roomId);

  roomRef.child('/roundStatus').set(RoundStatus.SettingRoles);

  roomRef.once('value', (snapshot) => {
    const room = snapshot.val() as Room;
    const roles = _getRolesByNumberOfPlayers(room.users.length);
    const sleeperIndex = _getNextSleeperIndex(room.lastSleeperIndex, room.users.length);
    room.users[sleeperIndex].roundRole = GameRole.Sleeper;

    room.users.filter(
      (u, index) => index !== sleeperIndex
    ).forEach((user) => {
      const randomIndex = Math.floor(Math.random() * roles.length);
      user.roundRole = roles.splice(randomIndex, 1)[0];
    });

    roomRef.child('/users').set(room.users);
  });
}

const getRandomWord = (usedWords: Array<string> = []): string => {
  const FilteredRandomWords = RandomWords.filter(word => !usedWords.includes(word.word));
  const WORDS_COUNT = FilteredRandomWords.length;
  const randomIndex = Math.floor(Math.random() * WORDS_COUNT);
  return FilteredRandomWords[randomIndex].word;
}

export const setRoundStarted = async (roomId: string) => {
  const roomRef = getRoomRef(roomId);
  await roomRef.once('value', async (snapshot) => {
    const room = snapshot.val() as Room;
    const newWord = getRandomWord();
    const usedWords: Array<string> = room.usedWords || [];
    await roomRef.child('/currentRound').set(room.currentRound + 1);
    await roomRef.child('/roundStatus').set(RoundStatus.Started);
    await roomRef.child('/currentWord').set(newWord);
    await roomRef.child('/usedWords').set([
      ...usedWords, newWord
    ]);
  });
}

export const setNextWord = async (roomId: string, guessedCorrectly: boolean) => {
  const roomRef = getRoomRef(roomId);
  await roomRef.once('value', async (snapshot) => {
    const room = snapshot.val() as Room;
    const usedWords: Array<string> = room.usedWords || [];
    const newWord = getRandomWord(room.usedWords);
    await roomRef.child('/currentScore').set({
      'correct': (room.currentScore?.correct || 0) + (guessedCorrectly ? 1 : 0),
      'wrong': (room.currentScore?.incorrect || 0) + (guessedCorrectly ? 0 : 1),
    });
    await roomRef.child('/currentWord').set(newWord);
    await roomRef.child('/usedWords').set([
      ...usedWords, newWord
    ]);
  });
};

export const setRoundEnded = async (roomId: string) => {
  const roomRef = getRoomRef(roomId);
  await roomRef.once('value', async (snapshot) => {
    const room = snapshot.val() as Room;
    await roomRef.child('/roundStatus').set(RoundStatus.DreamReview);
    await roomRef.child('/lastSleeperIndex').set(
      _getNextSleeperIndex(room.lastSleeperIndex, room.users.length)
    );

    if (room.currentScore) {
      room.users.forEach((user) => {
        user.points = _getUserPoints(user, room);
      });
      await roomRef.child('/users').set(room.users);
    }
  });
}

export const setDreamerScore = async (roomId: string, rememberedDream: boolean) => {
  const roomRef = getRoomRef(roomId);
  await roomRef.once('value', async (snapshot) => {
    const room = snapshot.val() as Room;
    if (room.currentScore) {
      const user = room.users.find(user => user.roundRole === GameRole.Sleeper);
      if (user) {
        user.points = room.currentScore.correct + (rememberedDream ? 2 : 0);
        await roomRef.child('/users').set(room.users);
        await roomRef.child('/currentScore').set({
          correct: 0,
          incorrect: 0,
        });
      }
    }
  });
}

export const getRoomRef = (roomId: string): firebase.database.Reference => {
  return db.ref('rooms/' + roomId);
}

function _getNextSleeperIndex(lastSleeperIndex: number, usersCount: number): number {
  if (lastSleeperIndex === (usersCount - 1))
    return 0;
  return lastSleeperIndex + 1;
}

function _getRolesByNumberOfPlayers(numberOfPlayers: number): Array<GameRole> {
  switch (numberOfPlayers) {
    case 4:
      return [
        GameRole.Fairy,
        GameRole.Sandman,
        GameRole.Bogeyman ];
    case 5:
      return [
        GameRole.Fairy,
        GameRole.Sandman, GameRole.Sandman,
        GameRole.Bogeyman ];
    case 6:
      return [
        GameRole.Fairy, GameRole.Fairy,
        GameRole.Sandman, GameRole.Sandman,
        GameRole.Bogeyman ];
    case 7:
      return [
        GameRole.Fairy, GameRole.Fairy, GameRole.Fairy,
        GameRole.Sandman,
        GameRole.Bogeyman, GameRole.Bogeyman ];
    case 8:
      return [
        GameRole.Fairy, GameRole.Fairy, GameRole.Fairy,
        GameRole.Sandman, GameRole.Sandman,
        GameRole.Bogeyman, GameRole.Bogeyman ];
    case 9:
      return [
        GameRole.Fairy, GameRole.Fairy, GameRole.Fairy, GameRole.Fairy,
        GameRole.Sandman, GameRole.Sandman, GameRole.Sandman,
        GameRole.Bogeyman ];
    case 10:
      return [
        GameRole.Fairy, GameRole.Fairy, GameRole.Fairy, GameRole.Fairy,
        GameRole.Sandman, GameRole.Sandman, GameRole.Sandman,
        GameRole.Bogeyman, GameRole.Bogeyman ];
  }

  return [];
}

function _getUserPoints(user: RoomUser, room: Room): number {
  switch (user.roundRole) {
    case GameRole.Fairy:
      return user.points + room.currentScore.correct;
    case GameRole.Bogeyman:
      return user.points + room.currentScore.incorrect;
    case GameRole.Sandman:
      const diff = Math.abs(room.currentScore.correct - room.currentScore.incorrect);
      if (diff === 0) {
        return user.points + room.currentScore.correct + 2;
      } else {
        if (diff === 1) {
          const biggestPoint = room.currentScore.correct > room.currentScore.incorrect
            ? room.currentScore.correct
            : room.currentScore.incorrect;
          return user.points + biggestPoint;
        } else {
          const lowestPoint = room.currentScore.correct > room.currentScore.incorrect
            ? room.currentScore.incorrect
            : room.currentScore.correct;
          return user.points + lowestPoint;
        }
      }
    default:
      return 0;
  }
}
