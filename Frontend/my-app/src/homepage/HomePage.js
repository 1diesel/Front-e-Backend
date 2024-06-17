// homepage/HomePage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("http://localhost:3001/produtos");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="homepage">
      <div className="content">
        <h1>Bem-vindo à Loja de Bricolage DT</h1>
        <p>Destaques da semana</p>
        <div className="product-grid">
          {produtos.map((produto) => (
            <div className="product-card" key={produto._id}>
              <img
                src={`data:image/jpeg;base64,${produto.imagemBase64}`} // Exibe a imagem em base64
                alt={produto.nome}
                className="product-image"
              />
              <h2>{produto.nome}</h2>
              <p>Preço: €{produto.preco.toFixed(2)}</p>
              <p>{produto.descricao}</p>
              <Link to={`/produtos/${produto._id}`}>
                <button className="view-details-button">Ver Detalhes</button>
              </Link>
            </div>
          ))}
        </div>
        <Link to="/produtos">
          <button className="ver-produtos-button">Ver Todos os Produtos</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
