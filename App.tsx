import { useEffect, useState } from "react";

export default function App() {
  const API = "https://elite-imobiliaria.onrender.com";

  const [imoveis, setImoveis] = useState<any[]>([]);
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    descricao: "",
    imagem: ""
  });

  async function loadImoveis() {
    try {
      const res = await fetch(`${API}/api/imoveis`);
      const data = await res.json();
      setImoveis(data);
    } catch (err) {
      console.log("Erro ao carregar imóveis", err);
    }
  }

  async function addImovel() {
    await fetch(`${API}/api/imoveis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ nome: "", preco: "", descricao: "", imagem: "" });

    loadImoveis();
  }

  useEffect(() => {
    loadImoveis();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Painel de Imóveis</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <br />

        <input
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
        />
        <br />

        <input
          placeholder="Imagem"
          value={form.imagem}
          onChange={(e) => setForm({ ...form, imagem: e.target.value })}
        />
        <br />

        <textarea
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />

        <br />

        <button onClick={addImovel}>
          ➕ Adicionar Imóvel
        </button>
      </div>

      <hr />

      <h2>Imóveis cadastrados</h2>

      {imoveis.length === 0 && <p>Nenhum imóvel ainda</p>}

      {imoveis.map((i) => (
        <div key={i.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <h3>{i.nome}</h3>
          <p>{i.preco}</p>
          <p>{i.descricao}</p>
          {i.imagem && <img src={i.imagem} width={200} />}
        </div>
      ))}
    </div>
  );
}
