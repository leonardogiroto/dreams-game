import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  timer: {
    fontWeight: 500,
    margin: '18px 6px',
  },
}));

type TimerProps = {
  triggerTimer: boolean;
};

const Timer = (props: TimerProps) => {
  const classes = useStyles();
  const [timer, setTimer] = useState<number>(120);

  useEffect(() => {
    setTimer(120);
    updateRoundTimer(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.triggerTimer]);

  const updateRoundTimer = (timerValue: number) => {
    if (timerValue !== 0) {
      const updatedTimer = timerValue - 1;
      setTimer(updatedTimer);
      setTimeout(() => updateRoundTimer(updatedTimer), 1000);
    }
  };

  const formatTime = (timerValue: number): string => {
    const minutes = Math.floor(timerValue / 60);
    const seconds = (timerValue - (minutes * 60)) % 60;
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    return `${minutesStr}:${secondsStr}`;
  };

  return (
    <Typography className={classes.timer} color="textPrimary">
      Tempo restante: {formatTime(timer)}
    </Typography>
  );
}
export default Timer;
