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
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculateTotal = (produtos) => {
    let total = 0;
    produtos.forEach((item) => {
      total += item.produto.preco * item.quantidade;
    });
    setTotal(total);
  };

  const handleQuantityChange = (produtoId, quantity) => {
    fetch("http://127.0.0.1:3001/vendas/carrinho/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cliente: "user@example.com", produtoId, quantidade: quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.produtos);
        calculateTotal(data.produtos);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveItem = (produtoId) => {
    fetch("http://127.0.0.1:3001/vendas/carrinho/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cliente: "user@example.com", produtoId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.produtos);
        calculateTotal(data.produtos);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCheckout = () => {
    fetch("http://127.0.0.1:3001/vendas/carrinho/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cliente: "user@example.com" }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Compra finalizada com sucesso!");
        setCartItems([]);
        setTotal(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <CartContainer>
      <h2>Carrinho de Compras</h2>
      <CartItems>
        {cartItems.map((item) => (
          <CartItem key={item.produto._id}>
            <ProductInfo>
              <ProductImage src={`http://127.0.0.1:3001/uploads/${item.produto.imagem}`} alt={item.produto.nome} />
              <ProductDetails>
                <ProductName>{item.produto.nome}</ProductName>
                <ProductPrice>R$ {item.produto.preco.toFixed(2)}</ProductPrice>
              </ProductDetails>
            </ProductInfo>
            <QuantityControls>
              <input
                type="number"
                value={item.quantidade}
                onChange={(e) => handleQuantityChange(item.produto._id, parseInt(e.target.value))}
                min="1"
              />
              <button onClick={() => handleRemoveItem(item.produto._id)}>Remover</button>
            </QuantityControls>
          </CartItem>
        ))}
      </CartItems>
      <CartSummary>
        <span>Total: R$ {total.toFixed(2)}</span>
        <button onClick={handleCheckout}>Finalizar Compra</button>
        <Link to="/">Continuar Comprando</Link>
      </CartSummary>
    </CartContainer>
  );
};

export default CartPage;
