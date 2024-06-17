import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

const EditProduct = () => {
  const { productId } = useParams();
  const [produto, setProduto] = useState({
    nome: "",
    preco: 0,
    descricao: "",
    categoria: "",
    subcategoria: "",
    quantidadeDisponivel: 0,
    quantidadeMinima: 0,
  });
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/produtos/${productId}`
        );
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prevProduto) => ({
      ...prevProduto,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/produtos/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(produto),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao salvar o produto");
      }
      const data = await response.json();
      setMessage("Produto atualizado com sucesso!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      setMessage("Erro ao salvar o produto");
      console.error("Erro ao salvar o produto:", error);
    }
  };

  const handleBack = () => {
    navigate(`/produtos/${productId}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/produtos/${productId}/imagem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imagemBase64: reader.result.split(",")[1] }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao fazer upload da imagem");
        }
        const data = await response.json();
        setProduto(data);
        setMessage("Imagem do produto atualizada com sucesso!");
      } catch (error) {
        setMessage("Erro ao fazer upload da imagem");
        console.error("Erro ao fazer upload da imagem:", error);
      }
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="edit-product">
      <h1>Editar Produto</h1>
      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={produto.nome}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Preço:</label>
        <input
          type="number"
          name="preco"
          value={produto.preco}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Descrição:</label>
        <textarea
          name="descricao"
          value={produto.descricao}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Categoria:</label>
        <input
          type="text"
          name="categoria"
          value={produto.categoria}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Subcategoria:</label>
        <input
          type="text"
          name="subcategoria"
          value={produto.subcategoria}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Quantidade Disponível:</label>
        <input
          type="number"
          name="quantidadeDisponivel"
          value={produto.quantidadeDisponivel}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Quantidade Mínima:</label>
        <input
          type="number"
          name="quantidadeMinima"
          value={produto.quantidadeMinima}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Imagem:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && (
          <img src={previewImage} alt="Preview" className="preview-image" />
        )}
        <button onClick={handleImageUpload}>Upload Imagem</button>
      </div>
      <div className="buttons">
        <button onClick={handleBack}>Voltar</button>
        <button onClick={handleSave}>Salvar</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default EditProduct;
