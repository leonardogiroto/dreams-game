import { db, getCurrentUser } from '../config';

export const createRoom = async (roomName: string): Promise<string | null> => {
  const ref = db.ref('rooms').push();
  const id = db.ref('rooms').push().key;
  const currentUser = getCurrentUser();
  await ref.set({
    roomName, currentRound: 0,
    users: [{ uid: currentUser?.uid, points: 0 }]
  });
  return id;
};