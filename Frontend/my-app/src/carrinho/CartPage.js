// src/carrinho/CartPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CartItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.span`
  font-weight: bold;
`;

const ProductPrice = styled.span`
  color: #888;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;

  input {
    width: 50px;
    margin-right: 10px;
    padding: 5px;
  }
`;

const CartSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #ccc;
  margin-top: 20px;

  span {
    font-size: 1.2em;
    font-weight: bold;
  }

  button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #218838;
    }
  }

  a {
    text-decoration: none;
    color: #007bff;

    &:hover {
      color: #0056b3;
    }
  }
`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:3001/vendas")
      .then((response) => response.json())
      .then((data) => {
        const carrinhoAtual = data.find(venda => venda.estado === "Carrinho");
        if (carrinhoAtual) {
          setCartItems(carrinhoAtual.produtos);
          calculateTotal(carrinhoAtual.produtos);
        }
      })
      .catch((error) => console.error("Error fetching cart items:", error));
  }, []);

  const calculateTotal = (items) => {
    const totalValue = items.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    setTotal(totalValue);
  };

  const updateQuantity = (id, quantidade) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantidade };
      }
      return item;
    });
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  return (
    <CartContainer>
      <h2>Carrinho de Compras</h2>
      <CartItems>
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <ProductInfo>
              <ProductImage src={item.imagem} alt={item.nome} />
              <ProductDetails>
                <ProductName>{item.nome}</ProductName>
                <ProductPrice>{item.preco}€</ProductPrice>
              </ProductDetails>
            </ProductInfo>
            <QuantityControls>
              <input
                type="number"
                value={item.quantidade}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value, 10))
                }
                min="1"
              />
              <button onClick={() => removeItem(item.id)}>Remover</button>
            </QuantityControls>
          </CartItem>
        ))}
      </CartItems>
      <CartSummary>
        <span>Total: {total.toFixed(2)}€</span>
        <Link to="/checkout">Finalizar Compra</Link>
      </CartSummary>
    </CartContainer>
  );
};

export default CartPage;
