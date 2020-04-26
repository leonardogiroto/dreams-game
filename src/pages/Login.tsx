import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../services/auth.service';

export interface LoginInfo {
  email: string,
  password: string,
};

const Login = () => {

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
    <div>
      <form>
        <h1>Login</h1>
        <div>
          <input placeholder="Email" name="email" type="email" onChange={handleInputChange} value={loginInfo.email}></input>
        </div>
        <div>
          <input placeholder="Password" name="password" onChange={handleInputChange} value={loginInfo.password} type="password"></input>
        </div>
        <div>
          <button type="button" onClick={doLogin} >Login</button>
        </div>
        <hr></hr>
        <p>Ainda não possui uma conta? <Link to="/register">Registrar-se</Link></p>
      </form>
    </div>
  );
}
export default Login;