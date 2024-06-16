import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";

const UserPage = () => {
  const { auth, logout, deleteUser, updateUser, changePassword, uploadProfilePicture } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

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

  if (!auth.isAuthenticated || !auth.user) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }

  return (
    <div className="user-page">
      <h1>Bem-vindo, {auth.user.name}</h1>
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
              <input type="text" name="name" defaultValue={auth.user.name} />
            </label>
            <label>
              Email:
              <input type="email" name="email" defaultValue={auth.user.email} />
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
