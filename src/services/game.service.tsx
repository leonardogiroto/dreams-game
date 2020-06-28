import { db, getCurrentUser } from '../config';
import { RoomUser, Room } from '../interfaces/room.interface';
import { GameRole } from '../interfaces/game-role.interface';
import { RoundStatus } from '../interfaces/round-status.interface';
import { RandomWords } from '../static/random-words';

const RANDOM_WORDS_COUNT = RandomWords.length;

export const createRoom = async (roomName: string): Promise<string | null> => {
  const ref = db.ref('rooms').push();
  const id = ref.key;
  const currentUser = getCurrentUser();
  await ref.set({
    roomName, currentRound: 0, lastSleeperIndex: 0,
    roundStatus: RoundStatus.Idle,
    ownerUid: currentUser?.uid,
    users: [{ uid: currentUser?.uid, points: 0 }]
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
            uid: currentUser.uid
          }
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

const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * RANDOM_WORDS_COUNT);
  return RandomWords[randomIndex].word;
}

export const setRoundStarted = async (roomId: string) => {
  const roomRef = getRoomRef(roomId);
  await roomRef.once('value', async (snapshot) => {
    const room = snapshot.val() as Room;
    await roomRef.child('/currentRound').set(room.currentRound + 1);
    await roomRef.child('/roundStatus').set(RoundStatus.Started);
    await roomRef.child('/currentWord').set(getRandomWord());
    // TODO: SET LASTRANDOMWORDS AND PREVENT REPEATED WORDS
  });
}

export const setRoundEnded = async (roomId: string) => {
  const roomRef = getRoomRef(roomId);
  await roomRef.child('/roundStatus').set(RoundStatus.DreamReview);
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
    /* TESTE */
    case 2:
      return [ GameRole.Fairy ];
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