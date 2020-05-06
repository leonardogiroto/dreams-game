import { GameRole } from "./game-role.interface";

export interface Room {
  currentRound: number;
  lastSleeperIndex: number;
  ownerUid: string;
  roomName: string;
  users: Array<RoomUser>;
}

export interface RoomUser {
  points: number;
  uid: string;
  roundRole?: GameRole;
}
