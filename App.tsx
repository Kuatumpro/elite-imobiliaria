import { useEffect, useState } from "react";

export default function App() {
  const API = "https://elite-imobiliaria.onrender.com";

  // LEADS (já existe no seu sistema)
  const [leads, setLeads] = useState<any[]>([]);

  // IMÓVEIS (NOVO)
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [formImovel, setFormImovel] = useState({
    nome: "",
    preco: "",
    descricao: "",
    imagem: ""
  });

  // LOGIN SIMPLES (se você já tiver, mantém)
  const [isLogged, setIsLogged] = useState(true);

  // ---------------- LEADS ----------------
  async function loadLeads() {
    try {
      const res = await fetch(`${API}/api/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.log(err);
    }
  }

  // ---------------- IMÓVEIS ----------------
  async function loadImoveis() {
    try {
      const res = await fetch(`${API}/api/imoveis`);
      const data = await res.json();
      setImoveis(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function addImovel() {
    await fetch(`${API}/api/imoveis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formImovel)
    });

    setFormImovel({
      nome: "",
      preco: "",
      descricao: "",
      imagem: ""
    });

    loadImoveis();
  }

  useEffect(() => {
    loadLeads();
    loadImoveis();
  }, []);

  if (!isLogged) {
    return <h2>Acesso negado</h2>;
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🏠 Painel do Corretor</h1>

      {/* ---------------- LEADS ---------------- */}
      <h2>📩 Leads</h2>
      {leads.length === 0 && <p>Nenhum lead</p>}

      {leads.map((l) => (
        <div key={l.id} style={{ border: "1px solid #ccc", margin: 5, padding: 10 }}>
          <p><strong>{l.nome}</strong></p>
          <p>{l.email}</p>
          <p>{l.telefone}</p>
        </div>
      ))}

      <hr />

      {/* ---------------- IMÓVEIS ---------------- */}
      <h2>🏠 Gestão de Imóveis</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={formImovel.nome}
          onChange={(e) =>
            setFormImovel({ ...formImovel, nome: e.target.value })
          }
        />
        <br />

        <input
          placeholder="Preço"
          value={formImovel.preco}
          onChange={(e) =>
            setFormImovel({ ...formImovel, preco: e.target.value })
          }
        />
        <br />

        <input
          placeholder="Imagem URL"
          value={formImovel.imagem}
          onChange={(e) =>
            setFormImovel({ ...formImovel, imagem: e.target.value })
          }
        />
        <br />

        <textarea
          placeholder="Descrição"
          value={formImovel.descricao}
          onChange={(e) =>
            setFormImovel({ ...formImovel, descricao: e.target.value })
          }
        />
        <br />

        <button onClick={addImovel}>
          ➕ Adicionar Imóvel
        </button>
      </div>

      {imoveis.length === 0 && <p>Nenhum imóvel cadastrado</p>}

      {imoveis.map((i) => (
        <div key={i.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <h3>{i.nome}</h3>
          <p>{i.preco}</p>
          <p>{i.descricao}</p>
          {i.imagem && (
            <img src={i.imagem} width={200} />
          )}
        </div>
      ))}
    </div>
  );
}
