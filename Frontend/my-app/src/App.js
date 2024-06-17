import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./registar/RegisterForm";
import Header from "./header/Header";
import Produtos from "./produto/Produtos"; // Importação do Produtos
import HomePage from "./homepage/HomePage";
import ProductDetails from "./produto/ProductDetails";
import UserPage from "./components/UserPage";
import ErrorPage from "./error/ErrorPage";
import Carrinho from "./carrinho/CartPage";
import EditProduct from "./produto/EditProduct";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/utilizador" element={<UserPage />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/registar" element={<RegisterForm />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:productId" element={<ProductDetails />} />
          <Route path="/produtos/:productId" component={ProductDetails} />
          <Route path="/produtos/editar/:productId" element={<EditProduct />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
