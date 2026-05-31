import { useEffect, useState } from "react";

const [imoveis, setImoveis] = useState<any[]>([]);
const [titulo, setTitulo] = useState("");
const [preco, setPreco] = useState("");
const [descricao, setDescricao] = useState("");

export default function App() {
  const API = "https://elite-imobiliaria.onrender.com";

  const [imoveis, setImoveis] = useState<any[]>([]);
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    descricao: "",
    imagem: ""
  });

  function adicionarImovel() {
  const novo = {
    id: Date.now(),
    titulo,
    preco,
    descricao
  };

  const atualizados = [...imoveis, novo];
  setImoveis(atualizados);

  localStorage.setItem("imoveis", JSON.stringify(atualizados));

  setTitulo("");
  setPreco("");
  setDescricao("");
}

  async function loadImoveis() {
    const res = await fetch(`${API}/api/imoveis`);
    const data = await res.json();
    setImoveis(data);
  }

  useEffect(() => {
    loadImoveis();
  }, []);

  <div class="bg-white p-4 rounded-xl border mt-6">
  <h3 class="font-bold mb-3">Adicionar Imóvel</h3>

  <input placeholder="Título" class="border p-2 w-full mb-2" onInput="setTitulo(event.target.value)" />
  <input placeholder="Preço" class="border p-2 w-full mb-2" onInput="setPreco(event.target.value)" />
  <textarea placeholder="Descrição" class="border p-2 w-full mb-2" onInput="setDescricao(event.target.value)"></textarea>

  <button onclick="adicionarImovel()" class="bg-blue-600 text-white px-4 py-2 rounded">
    Adicionar
  </button>

  <div class="mt-4">
    <div id="lista-imoveis">
      {imoveis.map((i) => (
        <div key={i.id} class="border p-2 mt-2 rounded">
          <strong>{i.titulo}</strong>
          <p>{i.preco}</p>
          <p>{i.descricao}</p>
        </div>
      ))}
    </div>
  </div>
</div>

  async function addImovel() {
    await fetch(`${API}/api/imoveis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ nome: "", preco: "", descricao: "", imagem: "" });

    loadImoveis();
  }

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
          placeholder="Imagem (URL)"
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
          {i.imagem && (
            <img src={i.imagem} style={{ width: 200 }} />
          )}
        </div>
      ))}
    </div>
  );
}
