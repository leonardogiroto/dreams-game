import React, { useEffect, useState } from 'react';
import { RoundStatus } from '../../interfaces/round-status.interface';
import { getRoomRef } from '../../services/game.service';
import { Room } from '../../interfaces/room.interface';

interface HeaderProps {
  roomId: string;
}

const Header = (props: HeaderProps) => {
  const { roomId } = props;

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>(RoundStatus.Idle);
  // const [scores, setCurrentRound] = useState<Array<>(0);

  useEffect(() => {
    getRoomRef(roomId).on('value', (snapshot) => {
      const room = snapshot.val() as Room;

      setCurrentRound(room.currentRound);
      setRoundStatus(room.roundStatus);

      // if (room.roundStatus === RoundStatus.SettingRoles && room.users) {
      //   const user = room.users.find(u => u.uid === currentUser?.uid);
      //   setCurrentRole(user?.roundRole as GameRole);
      // }
    }); 
  }, [roomId, currentRound, roundStatus]);

  return (
    <header>
      <p>Round: {currentRound}</p>
      <p>Round Status: {roundStatus}</p>
      {/* <p>Scores: {score}</p> */}
    </header>
  )
}
export default Header;
