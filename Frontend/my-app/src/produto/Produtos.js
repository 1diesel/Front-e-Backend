import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Produtos.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [propriedades, setPropriedades] = useState({
    nome: "",
    fabricante: "",
  });
  const [precoMinimo, setPrecoMinimo] = useState(0);
  const [precoMaximo, setPrecoMaximo] = useState(0);
  const [precoMinSelecionado, setPrecoMinSelecionado] = useState(0);
  const [precoMaxSelecionado, setPrecoMaxSelecionado] = useState(0);
  const [favoritos, setFavoritos] = useState({});
  const [favorites, setFavorites] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // Buscar produtos
    fetch("http://localhost:3001/produtos")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProdutos(data);

          // Determinar o preço mínimo e máximo dos produtos
          const precos = data.map((produto) => produto.preco);
          const precoMin = Math.min(...precos);
          const precoMax = Math.max(...precos);
          setPrecoMinimo(precoMin);
          setPrecoMaximo(precoMax);
          setPrecoMinSelecionado(precoMin);
          setPrecoMaxSelecionado(precoMax);
        } else {
          setProdutos([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setProdutos([]);
      });

    // Buscar favoritos
    fetch("http://localhost:3001/favoritos")
      .then((response) => response.json())
      .then((data) =>
        setFavoritos(
          Array.isArray(data)
            ? data.reduce((acc, cur) => ({ ...acc, [cur.produtoId]: cur }), {})
            : {}
        )
      )
      .catch((error) => console.error(error));
  }, []);

  const handlePropriedadesChange = (event) => {
    const { name, value } = event.target;
    setPropriedades({ ...propriedades, [name]: value });
  };

  const handlePrecoChange = (value) => {
    setPrecoMinSelecionado(value[0]);
    setPrecoMaxSelecionado(value[1]);
  };

  const toggleFavorite = (produtoId) => {
    const updatedFavorites = { ...favorites };
    updatedFavorites[produtoId] = !updatedFavorites[produtoId];
    setFavorites(updatedFavorites);
  };

  const toggleCategory = (categoria) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const categorias = Array.from(
    new Set(produtos.map((produto) => produto.categoria))
  );
  const subcategorias = Array.from(
    new Set(produtos.map((produto) => produto.subcategoria))
  );

  const produtosFiltrados = produtos.filter((produto) => {
    const todasTags = new Set([produto.categoria, produto.subcategoria]);

    const passaFiltro =
      !filtro || Array.from(todasTags).some((tag) => tag.includes(filtro));
    const passaNome =
      !propriedades.nome || produto.nome.includes(propriedades.nome);
    const passaFabricante =
      !propriedades.fabricante ||
      produto.fabricante.includes(propriedades.fabricante);
    const passaPreco =
      produto.preco >= precoMinSelecionado &&
      produto.preco <= precoMaxSelecionado;

    return passaFiltro && passaNome && passaFabricante && passaPreco;
  });

  return (
    <div className="produtos-page">
      <div className="filtro-lateral">
        <h2>Pesquisa Avançada</h2>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={propriedades.nome}
          onChange={handlePropriedadesChange}
        />
        <label>Fabricante:</label>
        <input
          type="text"
          name="fabricante"
          value={propriedades.fabricante}
          onChange={handlePropriedadesChange}
        />
        <label>Preço:</label>
        <div className="preco-slider">
          <Slider
            min={precoMinimo}
            max={precoMaximo}
            value={[precoMinSelecionado, precoMaxSelecionado]}
            onChange={handlePrecoChange}
            range
          />
        </div>
        <span>{`€ ${precoMinSelecionado} - € ${precoMaxSelecionado}`}</span>
        <div className="abas-filtro">
          <h3>Categorias:</h3>
          {categorias.map((categoria) => (
            <div key={categoria}>
              <button
                className="categoria-button"
                onClick={() => toggleCategory(categoria)}
              >
                {categoria} (
                {
                  produtos.filter((produto) => produto.categoria === categoria)
                    .length
                }
                )
              </button>
              {expandedCategories[categoria] && (
                <div className="subcategorias-lista">
                  {subcategorias
                    .filter((subcategoria) =>
                      produtos.find(
                        (produto) =>
                          produto.subcategoria === subcategoria &&
                          produto.categoria === categoria
                      )
                    )
                    .map((subcategoria) => (
                      <button
                        key={subcategoria}
                        onClick={() => setFiltro(subcategoria)}
                      >
                        {subcategoria}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="produtos-lista">
        {produtosFiltrados.map((produto) => (
          <div className="produto-card" key={produto._id}>
            <img
              src={`data:image/jpeg;base64,${produto.imagemBase64}`} // Usando o campo "imagemBase64" atualizado corretamente
              alt={produto.nome}
              className="product-image"
            />
            <h3>{produto.nome}</h3>
            <p>{produto.fabricante}</p>
            <p>Preço: € {produto.preco.toFixed(2)}</p>
            <button
              onClick={() => toggleFavorite(produto._id)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <img
                src={
                  favorites[produto._id]
                    ? "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3217549%2Fbookmark-icon-md.png&f=1&nofb=1&ipt=73afbfade9f39602a28b0fbf7acd8d84c71e6867e1df96cc808305869cc8ccdd&ipo=images"
                    : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3250939%2Fbookmark-icon-md.png&f=1&nofb=1&ipt=9aca3bf209d11021e246cd9d6b8a8bd214e75ac51e7cb290cb04317e76b9990a&ipo=images"
                }
                alt="Bookmark"
                style={{ width: "24px", height: "24px" }}
              />
            </button>
            <Link to={`/produtos/${produto._id}`}>
              <button className="view-details-button">Ver Detalhes</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produtos;
