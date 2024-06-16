import "./App.css";
import React from 'react';
import { Route, Routes } from "react-router-dom";
import LoginForm from "./login/LoginForm";
import RegisterForm from './registar/RegisterForm';
import Header from "./header/Header";
import Produtos from "./produto/Produtos";
import HomePage from "./homepage/HomePage";
import ProductDetails from './produto/ProductDetails';
import ErrorPage from "./error/ErrorPage";
import Carrinho from './carrinho/CartPage';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/registar" element={<RegisterForm />} />
          <Route path="/produtos/:productId" element={<ProductDetails />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;