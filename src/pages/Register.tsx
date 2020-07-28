import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { register } from '../services/auth.service';

export interface RegisterInfo {
  email: string,
  password: string,
};

const useStyles = makeStyles(() => ({
  section: {
    maxWidth: 400,
    margin: '12px auto',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',

    '& .MuiTextField-root': {
      margin: '12px 0px',
    },
  },
  loginBtn: {
    marginTop: 8,
  },
  divider: {
    marginTop: 20,
  }
}));

const Register = () => {
  const classes = useStyles();

  const [ registerInfo, setValues ] = useState({
    'email': '', password: ''
  } as RegisterInfo);

  const handleInputChange = (event: React.FormEvent): void => {
    const { name, value } = event.target as HTMLInputElement;
    setValues({...registerInfo, [name]: value });
  };

  const doRegister = async () => {
    try {
      await register(registerInfo.email, registerInfo.password);
      alert('registrado com sucesso!');
    } catch (error) {
      alert('Ocorreu um erro, por favor tente novamente mais tarde');
    }
  }

  return (
    <section className={classes.section}>
      <form>
        <h1>Registro</h1>
        <div className={classes.loginForm} >
          <TextField label="Email" placeholder="Email" name="email" variant="outlined" type="email" onChange={handleInputChange} value={registerInfo.email} />
          <TextField label="Password" placeholder="Password" name="password" variant="outlined" onChange={handleInputChange} value={registerInfo.password} type="password" />
        </div>
        <Button className={classes.loginBtn} variant="contained" color="primary" type="button" onClick={doRegister} fullWidth>
          Registrar-se
        </Button>
        <hr className={classes.divider}></hr>
        <p>Já possui uma conta? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
export default Register;