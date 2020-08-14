import React from 'react';
import { makeStyles, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';

interface HowItWorksProps {
  isResponsibleForGuessedWord?: boolean;
}

const useStyles = makeStyles((theme) => ({
  accordionSummary: {
    fontWeight: 500,
  },
  accordionDetails: {
    flexDirection: 'column',
    
    '& p': {
      marginTop: 0,
    },
  },
}));

const HowItWorks = (props: HowItWorksProps) => {
  const { isResponsibleForGuessedWord = false } = props;
  const classes = useStyles();
  return (
    <Accordion>
      <AccordionSummary className={classes.accordionSummary} expandIcon={<span>+</span>} >
        Como Funciona?
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <p>
          Cada jogador, em ordem (conforme no rodapé do jogo), deve falar uma palavra qualquer para o Sonhador.
          <br />
          Essa palavra deve ajudá-lo ou atrapalhá-lo a adivinhar o que aparece na carta acima ("Palavra Atual").
          <br />
          Seu intuito com a palavra dita dependerá do papel que você está exercendo nessa rodada.
          <br />
          Os jogadores continuam falando palavras até que o Sonhador tente adivinhar.
        </p>
        <p>
          O objetivo do Sonhador é adivinhar as palavras que aparecem acima ("Palavra Atual").
          <br />
          Ele pode tentar adivinhar quantas palavras for possível antes que o tempo acabe.
        </p>
        {
          isResponsibleForGuessedWord && (
            <p>
              Você é o responsável por marcar os acertos e erros do Sonhador nesta rodada.
              <br />
              Caso ele acerte, clique no botão "Acertou" e caso ele erre, no botão "Errou".
            </p>
          )
        }
      </AccordionDetails>
    </Accordion>
  )
}
export default HowItWorks;
