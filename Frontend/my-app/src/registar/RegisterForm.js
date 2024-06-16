import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async (data) => {
    // Renomeia 'nome' para 'name' e remove campos desnecessários
    data.name = data.nome;
    delete data.nome;

    try {
      const response = await fetch("http://127.0.0.1:3001/auth/registar", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log("Status da resposta:", response.status);

      const result = await response.json();
      console.log("Resposta do servidor:", result);

      if (response.ok && result.auth) {
        // Registro bem-sucedido
        console.log("Registro bem-sucedido:", result);
        navigate("/login"); // Redireciona para a página de login após o registro
      } else {
        // Lida com falha no registro
        setErrorMessage(
          result.message ||
            "O registro falhou. Verifique as informações fornecidas."
        );
        console.log("Falha no registro:", result);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Ocorreu um erro ao tentar registrar.");
    }
  };

  return (
    <div className="register-container">
      <h2>Criar Conta</h2>
      <form className="form-register" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            name="nome"
            {...register("nome", { required: true })}
          />
          {errors.nome && (
            <p className="error-message">O nome é obrigatório.</p>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="error-message">O email é obrigatório.</p>
          )}
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              {...register("password", { required: true, minLength: 6 })}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {errors.password && (
            <p className="error-message">
              A senha deve ter pelo menos 6 caracteres.
            </p>
          )}
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
