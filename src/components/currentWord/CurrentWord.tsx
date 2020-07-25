import React from 'react';
import { makeStyles, Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';

interface CurrentWordProps {
  word: string;
  setCorrectWord: any;
  setIncorrectWord: any;
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
  const { word, setCorrectWord, setIncorrectWord } = props;
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
      <CardActions className={classes.actionsContainer}>
        <Button variant="contained" color="primary" onClick={() => setCorrectWord()}>Acertou</Button>
        <Button variant="contained" color="secondary" onClick={() => setIncorrectWord()}>Errou</Button>
      </CardActions>
    </Card>
  );
}
export default CurrentWord;
