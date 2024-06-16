// src/components/LoginForm.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; // Adicionamos Link para navegação interna
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate(); // Hook para navegação
  const { register, handleSubmit } = useForm(); // Hook para lidar com formulários
  const [setLoginSuccess] = useState(false); // Estado para sucesso de login
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagens de erro

  const onSubmit = (data) => {
    // Ajusta a chave 'utilizador' para 'name' antes de enviar ao backend
    data.name = data.utilizador;
    delete data.utilizador;

    login(data);
  };

  const login = (data) => {
    fetch('http://127.0.0.1:3001/auth/login', {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.auth) {
          setLoginSuccess(true);
          console.log('Login successful');
          navigate('/utilizador'); // Redireciona para a página do utilizador após o login
        } else {
          setErrorMessage('Login falhou. Verifique as credenciais.');
          console.log('Login failed');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        setErrorMessage('Ocorreu um erro ao tentar fazer login.');
      });
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
