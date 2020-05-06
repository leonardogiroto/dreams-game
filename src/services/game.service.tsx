import { db, getCurrentUser } from '../config';
import { RoomUser } from '../interfaces/room.interface';
import { GameRole } from '../interfaces/game-role.interface';

export const createRoom = async (roomName: string): Promise<string | null> => {
  const ref = db.ref('rooms').push();
  const id = ref.key;
  const currentUser = getCurrentUser();
  await ref.set({
    roomName, currentRound: 0, lastSleeperIndex: 0,
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
        usersRef.push({
          points: 0,
          uid: currentUser.uid
        });
      }
    });
  }
}

export const setGameRoles = async (roomId: string, lastSleeperIndex: number) => {
  const roomRef = getRoomRef(roomId);
  const usersRef = roomRef.child('/users');
    usersRef.once('value', (snapshot) => {
      const users: Array<RoomUser> = Object.values(snapshot.val());
      const roles = _getRolesByNumberOfPlayers(users.length);
      const sleeperIndex = _getNextSleeperIndex(lastSleeperIndex, users.length);
      users[sleeperIndex].roundRole = GameRole.Sleeper;

      users.filter(
        (u, index) => index !== sleeperIndex
      ).forEach((user) => {
        const randomIndex = Math.floor(Math.random() * roles.length);
        user.roundRole = roles.splice(randomIndex, 1)[0];
      });

      usersRef.set(users);
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