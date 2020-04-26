import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/auth.service';

export interface RegisterInfo {
  email: string,
  password: string,
};

const Register = () => {

  const [ registerInfo, setValues ] = useState({
    'email': '', password: ''
  } as RegisterInfo);

  const handleInputChange = (event: React.FormEvent): void => {
    const { name, value } = event.target as HTMLInputElement;
    setValues({...registerInfo, [name]: value });
  };

  const doRegister = async () => {
    try {
      const result = await register(registerInfo.email, registerInfo.password);
      alert('registrado com sucesso!');
    } catch (error) {
      alert('Ocorreu um erro, por favor tente novamente mais tarde');
    }
  }

  return (
    <div>
      <form>
        <h1>Registro</h1>
        <div>
          <input placeholder="Email" name="email" type="email" onChange={handleInputChange} value={registerInfo.email}></input>
        </div>
        <div>
          <input placeholder="Password" name="password" onChange={handleInputChange} value={registerInfo.password} type="password"></input>
        </div>
        <div>
          <button type="button" onClick={doRegister} >Registrar-se</button>
        </div>
        <hr></hr>
        <p>Já possui uma conta? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
export default Register;