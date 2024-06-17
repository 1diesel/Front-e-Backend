import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = ({ darkMode }) => {
  const { auth } = useContext(AuthContext);

  return (
    <header className={`header ${darkMode ? 'header-dark' : 'header-light'}`}>
      <div className="header-left">
        <Link to="/">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pikpng.com%2Fpngl%2Fb%2F369-3694577_homem-washing-machine-repair-clipart.png&f=1&nofb=1&ipt=756f9d7b2d635b6cb0b3abf6c6598da9e67e6b1ac6f5c5c27c31ea5ddf5b9516&ipo=images"
            alt="DT Bricolagem Logo"
            className="logo"
          />
        </Link>
        <Link to="/" className="title-link">
          <h2 className="title">DT Bricolagem</h2>
        </Link>
      </div>
      <div className="header-center">
      </div>
      <div className="header-right">
        {auth.isAuthenticated ? (
          <Link to="/utilizador">
            <button className="button profile-button">
              <img
                src="https://via.placeholder.com/30"
                alt="Profile"
                className="profile-icon"
              />
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="button login-button">Login</button>
          </Link>
        )}
        <Link to="/carrinho">
          <button className="button cart-button">Carrinho</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;