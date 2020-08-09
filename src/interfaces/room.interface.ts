import { GameRole } from "./game-role.interface";
import { RoundStatus } from "./round-status.interface";

export interface Room {
  currentRound: number;
  roundStatus: RoundStatus;
  currentWord: string;
  currentScore: CurrentScore;
  lastSleeperIndex: number;
  ownerUid: string;
  roomName: string;
  usedWords: Array<string>;
  users: Array<RoomUser>;
}

export interface RoomUser {
  points: number;
  uid: string;
  roundRole?: GameRole;
}

export interface CurrentScore {
  correct: number;
  incorrect: number;
}
