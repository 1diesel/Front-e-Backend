import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/vendas")
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        calculateTotal(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculateTotal = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.preco * item.quantidade;
    });
    setTotal(total);
  };

  const handleQuantityChange = (itemId, quantity) => {
    fetch(`vendas/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantidade: quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        calculateTotal(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveItem = (itemId) => {
    fetch(`/vendas/${itemId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        calculateTotal(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCheckout = () => {
    fetch("/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produtos: cartItems }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item._id}>
            <div className="product-info">
              <img
                src={item.imagem}
                alt={item.nome}
                className="product-image"
              />
              <div className="product-details">
                <h3>{item.nome}</h3>
                <p>Preço: R$ {item.preco}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantidade - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantidade}
                    className="quantity-input"
                    onChange={(e) =>
                      handleQuantityChange(item._id, e.target.value)
                    }
                  />
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantidade + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              className="remove-btn"
              onClick={() => handleRemoveItem(item._id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Resumo do Carrinho</h2>
        <div className="summary-item">
          <p>Total: € {total}</p>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Prosseguir com a Compra
        </button>
      </div>
    </div>
  );
};

export default CartPage;
