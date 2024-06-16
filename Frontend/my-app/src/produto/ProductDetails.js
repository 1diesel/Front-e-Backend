// src/components/ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [produto, setProduto] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/produtos/${productId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
    };

    fetchProduto();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:3001/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          produtoId: produto._id, 
          quantidade: 1 }), // Adiciona 1 unidade ao carrinho
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar ao carrinho');
      }
      const data = await response.json();
      setMessage('Produto adicionado ao carrinho com sucesso!');
      console.log('Produto adicionado ao carrinho:', data);
    } catch (error) {
      setMessage('Erro ao adicionar ao carrinho');
      console.error('Erro ao adicionar ao carrinho:', error);
    }
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
          <img
            src={produto.imagemUrl || "https://via.placeholder.com/300"} // Substitua pela URL real da imagem do produto
            alt={produto.nome}
          />
        </div>
        <div className="product-info">
          <h1>{produto.nome}</h1>
          <p className="price">€{produto.preco.toFixed(2)}</p>
          <p className="ref">Referência: {produto.ref}</p>
          <p className="categoria">Categoria: {produto.categoria}</p>
          <p className="subcategoria">Subcategoria: {produto.subcategoria}</p>
          <div className="quantity">Quantidade Disponível: {produto.quantidadeDisponivel}</div>
          <div className="buttons">
            <button className="add-to-cart-button" onClick={handleAddToCart}>Adicionar ao Carrinho</button>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
      <div className="product-description">
        <h2>Descrição do Produto</h2>
        <p>{produto.descricao}</p>
      </div>
      <Link to="/" className="back-to-home">← Voltar para a Home</Link>
    </div>
  );
};

export default ProductDetails;