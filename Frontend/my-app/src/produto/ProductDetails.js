// src/product/ProductDetails.js

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [produto, setProduto] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/produtos/${productId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduto(data);
        console.log("Produto carregado:", data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
    };

    fetchProduto();
  }, [productId]);

  const handleAddToCart = async () => {
    console.log("Auth state:", auth); // Log the auth state to inspect

    if (!auth.isAuthenticated) {
      setMessage("Você precisa estar logado para adicionar produtos ao carrinho.");
      navigate("/login");
      return;
    }

    if (!auth.user) {
      setMessage("Informação do usuário não disponível.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/vendas/carrinho/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`, // Include token for authorization
        },
        body: JSON.stringify({
          cliente: auth.user.name,  // Use authenticated user's name
          produtoId: produto._id,
          quantidade: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao adicionar ao carrinho");
      }
      const data = await response.json();
      setMessage("Produto adicionado ao carrinho com sucesso!");
      console.log("Produto adicionado ao carrinho:", data);
    } catch (error) {
      setMessage("Erro ao adicionar ao carrinho");
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const handleEditProduct = () => {
    navigate(`/produtos/editar/${productId}`);
  };

  if (!produto) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="product-details">
      <div className="breadcrumbs">
        <Link to="/">Início</Link> &gt;
        <Link to="/produtos"> Produtos</Link> &gt;
        <span> {produto.nome}</span>
      </div>
      <div className="product-main">
        <div className="product-image">
          {produto.imagemBase64 ? (
            <img
              src={`data:image/jpeg;base64,${produto.imagemBase64}`}
              alt={produto.nome}
              className="product-image"
            />
          ) : (
            <p>Sem imagem disponível</p>
          )}
        </div>
        <div className="product-info">
          <h1>{produto.nome}</h1>
          <p className="price">€{produto.preco.toFixed(2)}</p>
          <p className="ref">Referência: {produto.ref}</p>
          <p className="categoria">Categoria: {produto.categoria}</p>
          <p className="subcategoria">Subcategoria: {produto.subcategoria}</p>
          <div className="quantity">
            Quantidade Disponível: {produto.quantidadeDisponivel}
          </div>
          <div className="buttons">
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </button>
            {auth.isAuthenticated && auth.user?.role?.scopes?.includes("manage-products") && (
              <button className="edit-product-button" onClick={handleEditProduct}>
                Editar Produto
              </button>
            )}
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
      <div className="product-description">
        <h2>Descrição do Produto</h2>
        <p>{produto.descricao}</p>
      </div>
      <Link to="/" className="back-to-home">
        ← Voltar para a Home Page
      </Link>
    </div>
  );
};

export default ProductDetails;
