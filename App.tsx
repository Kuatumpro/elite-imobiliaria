import { useEffect, useState } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    descricao: "",
    imagem: ""
  });

  // 🔄 buscar imóveis
  useEffect(() => {
    fetch("https://elite-imobiliaria.onrender.com/api/imoveis")
      .then(res => res.json())
      .then(data => setImoveis(data))
      .catch(() => setImoveis([]));
  }, []);

  // ➕ adicionar imóvel
  async function addImovel() {
    await fetch("https://SEU-BACKEND/api/imoveis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ nome: "", preco: "", descricao: "", imagem: "" });

    const res = await fetch("https://SEU-BACKEND/api/imoveis");
    const data = await res.json();
    setImoveis(data);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🏠 Painel de Imóveis</h1>

      {/* FORMULÁRIO */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        <br />

        <input
          placeholder="Preço"
          value={form.preco}
          onChange={e => setForm({ ...form, preco: e.target.value })}
        />
        <br />

        <input
          placeholder="Imagem (URL)"
          value={form.imagem}
          onChange={e => setForm({ ...form, imagem: e.target.value })}
        />
        <br />

        <textarea
          placeholder="Descrição"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
        />

        <br />

        <button onClick={addImovel}>
          Adicionar Imóvel
        </button>
      </div>

      {/* LISTA DE IMÓVEIS */}
      <div>
        {imoveis.map((i, index) => (
          <div key={index} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
            <h3>{i.nome}</h3>
            <p>{i.preco}</p>
            <p>{i.descricao}</p>
            {i.imagem && (
              <img src={i.imagem} style={{ width: 200 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
