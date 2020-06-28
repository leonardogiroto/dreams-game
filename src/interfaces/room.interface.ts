import { GameRole } from "./game-role.interface";
import { RoundStatus } from "./round-status.interface";

export interface Room {
  currentRound: number;
  roundStatus: RoundStatus;
  currentWord: string;
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
