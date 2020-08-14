import React from 'react';
import { makeStyles, Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';

interface CurrentWordProps {
  word: string;
  setGuessedWord: Function;
  isResponsibleForGuessedWord?: boolean;
}

const useStyles = makeStyles((theme) => ({
  wordContainer: {
    display: 'flex',
  },
  actionsContainer: {
    padding: '0px 16px 16px 16px',
  },
}));

const CurrentWord = (props: CurrentWordProps) => {
  const { word, setGuessedWord, isResponsibleForGuessedWord = false } = props;
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Palavra Atual
        </Typography>
        <Typography variant="h5" component="h2">
          {word}
        </Typography>
      </CardContent>
      {
        isResponsibleForGuessedWord && (
          <CardActions className={classes.actionsContainer}>
            <Button variant="contained" color="primary" onClick={() => setGuessedWord(true)}>Acertou</Button>
            <Button variant="contained" color="secondary" onClick={() => setGuessedWord(false)}>Errou</Button>
          </CardActions>
        ) 
      }
    </Card>
  );
}
export default CurrentWord;
