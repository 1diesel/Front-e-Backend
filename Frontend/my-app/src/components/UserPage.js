import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";

const UserPage = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (password) {
      deleteUser(password);
      navigate("/");
    } else {
      alert("Por favor, insira sua palavra-passe para confirmar.");
    }
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleProfilePictureUpload = () => {
    if (profilePicture) {
      uploadProfilePicture(profilePicture);
    } else {
      alert("Por favor, selecione uma foto de perfil.");
    }
  };

  const handleChangePassword = () => {
    if (password && newPassword) {
      changePassword(password, newPassword);
      setPassword("");
      setNewPassword("");
      setShowChangePassword(false);
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const updateUser = async (form) => {
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData);

    try {
      const response = await fetch('http://127.0.0.1:3001/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Detalhes do utilizador atualizados com sucesso!");
        // Atualize o estado do utilizador localmente
        const updatedUser = { ...auth.user, ...userData };
        const updatedAuth = { ...auth, user: updatedUser };
        localStorage.setItem('auth', JSON.stringify(updatedAuth));
      } else {
        alert(`Erro ao atualizar detalhes do utilizador: ${result.message}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar detalhes do utilizador:", error);
      alert("Ocorreu um erro ao atualizar os detalhes do utilizador.");
    }
  };

  const deleteUser = (password) => {
    // Adicione aqui a lógica para apagar o utilizador
    // Isso geralmente envolve enviar uma solicitação para o servidor com a palavra-passe para autenticação
    console.log("Deleting user with password:", password);
  };

  const uploadProfilePicture = (file) => {
    // Adicione aqui a lógica para fazer upload da foto de perfil
    // Isso geralmente envolve enviar o arquivo para o servidor
    console.log("Uploading profile picture:", file);
  };

  const changePassword = (currentPassword, newPassword) => {
    // Adicione aqui a lógica para mudar a palavra-passe
    // Isso geralmente envolve enviar uma solicitação para o servidor com as palavras-passe atual e nova
    console.log("Changing password from:", currentPassword, "to:", newPassword);
  };

  if (!auth.isAuthenticated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="user-page">
      <h1>Bem-vindo, {auth.user ? auth.user.name : "utilizador"}</h1>
      <div className="user-actions">
        <button onClick={() => setShowEdit(!showEdit)}>Editar Detalhes</button>
        <button onClick={() => navigate("/")}>Voltar ao Menu</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => setShowChangePassword(!showChangePassword)}>Alterar Palavra-passe</button>
      </div>
      {showEdit && (
        <div className="edit-details">
          <h2>Editar Detalhes</h2>
          <form onSubmit={(e) => { e.preventDefault(); updateUser(e.target); }}>
            <label>
              Nome:
              <input type="text" name="name" defaultValue={auth.user ? auth.user.name : ""} />
            </label>
            <label>
              Email:
              <input type="email" name="email" defaultValue={auth.user ? auth.user.email : ""} />
            </label>
            {/* Adicione outros campos conforme necessário */}
            <button type="submit">Salvar</button>
          </form>
        </div>
      )}
      {showChangePassword && (
        <div className="change-password">
          <h2>Alterar Palavra-passe</h2>
          <input
            type="password"
            placeholder="Palavra-passe Atual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nova Palavra-passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Alterar</button>
        </div>
      )}
      <div className="profile-picture-upload">
        <h2>Adicionar Foto de Perfil</h2>
        <input type="file" onChange={handleProfilePictureChange} />
        <button onClick={handleProfilePictureUpload}>Upload</button>
      </div>
      <div className="delete-account">
        <h2>Apagar Conta</h2>
        <input
          type="password"
          placeholder="Confirme com sua palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleDeleteAccount}>Apagar Conta</button>
      </div>
    </div>
  );
};

export default UserPage;
