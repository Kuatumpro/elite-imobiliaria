import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

// Ensure data folder and file exist
async function ensureLeadsFile() {
  try {
    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    try {
      await fs.access(LEADS_FILE);
    } catch {
      await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error creating leads storage directory:", err);
  }
}

app.use(cors());
app.use(express.json());

// API: Save Contact Form Submission
app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Nome, e-mail e telefone são obrigatórios." });
    }

    await ensureLeadsFile();

    const data = await fs.readFile(LEADS_FILE, "utf-8");
    const leads = JSON.parse(data);

    const newLead = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      interest: interest || "Dúvida Geral",
      message: message || "",
      createdAt: new Date().toISOString(),
      status: "Novo" // Statuses: Novo, Em Atendimento, Finalizado
    };

    leads.unshift(newLead); // Store newest first
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");

    res.status(201).json({ success: true, message: "Lead registrado com sucesso!" });
  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ error: "Erro interno do servidor ao salvar lead." });
  }
});

// Secret/Token validation middleware for Admin Panel
const ADMIN_PASSWORD = "elite2026"; // Feel free to customize this or use process.env.ADMIN_PASSWORD

// API: Get Leads (Secure)
app.get("/api/leads", async (req, res) => {
  try {
    const password = req.headers["authorization"] || req.query.password;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Não autorizado. Código de acesso inválido de corretor." });
    }

    await ensureLeadsFile();
    const data = await fs.readFile(LEADS_FILE, "utf-8");
    const leads = JSON.parse(data);

    res.json(leads);
  } catch (error) {
    console.error("Error retrieving leads:", error);
    res.status(500).json({ error: "Erro ao carregar leads." });
  }
});

// API: Delete lead (Secure)
app.delete("/api/leads/:id", async (req, res) => {
  try {
    const password = req.headers["authorization"] || req.query.password;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    const leadId = req.params.id;
    await ensureLeadsFile();

    const data = await fs.readFile(LEADS_FILE, "utf-8");
    const leads = JSON.parse(data);

    const filteredLeads = leads.filter((lead: any) => lead.id !== leadId);
    await fs.writeFile(LEADS_FILE, JSON.stringify(filteredLeads, null, 2), "utf-8");

    res.json({ success: true, message: "Lead removido com sucesso." });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Erro ao excluir lead." });
  }
});

// API: Update lead status (Secure)
app.patch("/api/leads/:id/status", async (req, res) => {
  try {
    const password = req.headers["authorization"] || req.query.password;
    const { status } = req.body;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    const leadId = req.params.id;
    await ensureLeadsFile();

    const data = await fs.readFile(LEADS_FILE, "utf-8");
    const leads = JSON.parse(data);

    const leadIndex = leads.findIndex((l: any) => l.id === leadId);
    if (leadIndex === -1) {
      return res.status(404).json({ error: "Lead não encontrado." });
    }

    leads[leadIndex].status = status;
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");

    res.json({ success: true, lead: leads[leadIndex] });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ error: "Erro ao atualizar status do lead." });
  }
});

// Initialize Vite server for development
async function start() {
  await ensureLeadsFile();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}
let imoveis: any[] = [];

app.get("/api/imoveis", (req, res) => {
  res.json(imoveis);
});

app.post("/api/imoveis", (req, res) => {
  const { nome, preco, descricao, imagem } = req.body;

  const novoImovel = {
    id: Date.now(),
    nome,
    preco,
    descricao,
    imagem
  };

  imoveis.push(novoImovel);

  res.json(novoImovel);
});

start();
