// src/login/LoginForm.js
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    data.name = data.utilizador; // Ajusta o campo 'utilizador' para 'name'
    delete data.utilizador;

    const result = await login(data);
    if (result.success) {
      navigate('/utilizador'); // Redireciona para a página do utilizador após o login
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Minha conta</h2>
      <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Utilizador:</label>
          <input name="utilizador" {...register('utilizador', { required: true })} />
        </div>
        <div className="field">
          <label>Palavra-passe:</label>
          <input name="password" type="password" {...register('password', { required: true })} />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className="submit-button">Login</button>
      </form>
      <p className="register-link">
        Sem conta? <Link to="/registar">Crie uma aqui!</Link>
      </p>
    </div>
  );
};

export default LoginForm;
