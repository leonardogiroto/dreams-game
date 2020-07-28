import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { login } from '../services/auth.service';

export interface LoginInfo {
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

const Login = () => {
  const classes = useStyles();

  const [ loginInfo, setValues ] = useState({
    'email': '', password: ''
  } as LoginInfo);

  const history = useHistory();

  const handleInputChange = (event: React.FormEvent): void => {
    const { name, value } = event.target as HTMLInputElement;
    setValues({...loginInfo, [name]: value });
  };

  const doLogin = async () => {
    try {
      await login(loginInfo.email, loginInfo.password);
      history.push('lobby');
      
    } catch (error) {
      alert('Ocorreu um erro, por favor tente novamente mais tarde');
    }
  }

  return (
    <section className={classes.section}>
      <form>
        <h1>Login</h1>
        <div className={classes.loginForm}>
          <TextField label="Email" placeholder="Email" name="email" variant="outlined" type="email" onChange={handleInputChange} value={loginInfo.email} />
          <TextField label="Password" placeholder="Password" name="password" variant="outlined" onChange={handleInputChange} value={loginInfo.password} type="password" />
        </div>
        <Button className={classes.loginBtn} variant="contained" color="primary" type="button" onClick={doLogin} fullWidth>Login</Button>
        <hr className={classes.divider}></hr>
        <p>Ainda não possui uma conta? <Link to="/register">Registrar-se</Link></p>
      </form>
    </section>
  );
}
export default Login;