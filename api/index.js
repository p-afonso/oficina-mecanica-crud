import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3001;

// Inicializar banco SQLite
let db;

async function initializeDatabase() {
  db = await open({
    filename: './oficina.db',
    driver: sqlite3.Database
  });

  // Criar tabelas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT,
      endereco TEXT
    );

    CREATE TABLE IF NOT EXISTS funcionarios (
      id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cargo TEXT,
      telefone TEXT,
      data_admissao TEXT
    );

    CREATE TABLE IF NOT EXISTS veiculos (
      id_veiculo INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cliente INTEGER NOT NULL,
      marca TEXT,
      modelo TEXT,
      ano INTEGER,
      placa TEXT UNIQUE,
      FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pecas (
      id_peca INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco_unitario REAL NOT NULL,
      quantidade_estoque INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS servicos (
      id_servico INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      preco REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ordens_de_servico (
      id_ordem INTEGER PRIMARY KEY AUTOINCREMENT,
      id_veiculo INTEGER NOT NULL,
      id_funcionario INTEGER NOT NULL,
      data_abertura TEXT NOT NULL,
      data_conclusao TEXT,
      observacoes TEXT,
      FOREIGN KEY (id_veiculo) REFERENCES veiculos (id_veiculo) ON DELETE CASCADE,
      FOREIGN KEY (id_funcionario) REFERENCES funcionarios (id_funcionario) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS itens_peca (
      id_item INTEGER PRIMARY KEY AUTOINCREMENT,
      id_ordem INTEGER NOT NULL,
      id_peca INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      preco_unitario REAL,
      FOREIGN KEY (id_ordem) REFERENCES ordens_de_servico (id_ordem) ON DELETE CASCADE,
      FOREIGN KEY (id_peca) REFERENCES pecas (id_peca) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS itens_servico (
      id_item INTEGER PRIMARY KEY AUTOINCREMENT,
      id_ordem INTEGER NOT NULL,
      id_servico INTEGER NOT NULL,
      quantidade INTEGER DEFAULT 1,
      preco_unitario REAL,
      FOREIGN KEY (id_ordem) REFERENCES ordens_de_servico (id_ordem) ON DELETE CASCADE,
      FOREIGN KEY (id_servico) REFERENCES servicos (id_servico) ON DELETE CASCADE
    );
  `);

  console.log('Banco de dados inicializado com sucesso!');
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API da Oficina Mecânica rodando com SQLite!');
});

// CRUD Clientes
app.get('/clientes', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM clientes ORDER BY id_cliente');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/clientes', async (req, res) => {
  try {
    const { nome, telefone, email, endereco } = req.body;
    const result = await db.run(
      'INSERT INTO clientes (nome, telefone, email, endereco) VALUES (?, ?, ?, ?)',
      [nome, telefone, email, endereco]
    );
    const newCliente = await db.get('SELECT * FROM clientes WHERE id_cliente = ?', [result.lastID]);
    res.status(201).json(newCliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, email, endereco } = req.body;
    const result = await db.run(
      'UPDATE clientes SET nome = ?, telefone = ?, email = ?, endereco = ? WHERE id_cliente = ?',
      [nome, telefone, email, endereco, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    const updatedCliente = await db.get('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    res.json(updatedCliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Funcionários
app.get('/funcionarios', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM funcionarios ORDER BY id_funcionario');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM funcionarios WHERE id_funcionario = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/funcionarios', async (req, res) => {
  try {
    const { nome, cargo, telefone, data_admissao } = req.body;
    const result = await db.run(
      'INSERT INTO funcionarios (nome, cargo, telefone, data_admissao) VALUES (?, ?, ?, ?)',
      [nome, cargo, telefone, data_admissao]
    );
    const newFuncionario = await db.get('SELECT * FROM funcionarios WHERE id_funcionario = ?', [result.lastID]);
    res.status(201).json(newFuncionario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cargo, telefone, data_admissao } = req.body;
    const result = await db.run(
      'UPDATE funcionarios SET nome = ?, cargo = ?, telefone = ?, data_admissao = ? WHERE id_funcionario = ?',
      [nome, cargo, telefone, data_admissao, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
    const updatedFuncionario = await db.get('SELECT * FROM funcionarios WHERE id_funcionario = ?', [id]);
    res.json(updatedFuncionario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM funcionarios WHERE id_funcionario = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Veículos
app.get('/veiculos', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM veiculos ORDER BY id_veiculo');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/veiculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM veiculos WHERE id_veiculo = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/veiculos', async (req, res) => {
  try {
    const { id_cliente, marca, modelo, ano, placa } = req.body;
    const result = await db.run(
      'INSERT INTO veiculos (id_cliente, marca, modelo, ano, placa) VALUES (?, ?, ?, ?, ?)',
      [id_cliente, marca, modelo, ano, placa]
    );
    const newVeiculo = await db.get('SELECT * FROM veiculos WHERE id_veiculo = ?', [result.lastID]);
    res.status(201).json(newVeiculo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/veiculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_cliente, marca, modelo, ano, placa } = req.body;
    const result = await db.run(
      'UPDATE veiculos SET id_cliente = ?, marca = ?, modelo = ?, ano = ?, placa = ? WHERE id_veiculo = ?',
      [id_cliente, marca, modelo, ano, placa, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Veículo não encontrado' });
    const updatedVeiculo = await db.get('SELECT * FROM veiculos WHERE id_veiculo = ?', [id]);
    res.json(updatedVeiculo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/veiculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM veiculos WHERE id_veiculo = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.json({ message: 'Veículo removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Peças
app.get('/pecas', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM pecas ORDER BY id_peca');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/pecas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM pecas WHERE id_peca = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Peça não encontrada' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/pecas', async (req, res) => {
  try {
    const { nome, descricao, preco_unitario, quantidade_estoque } = req.body;
    const result = await db.run(
      'INSERT INTO pecas (nome, descricao, preco_unitario, quantidade_estoque) VALUES (?, ?, ?, ?)',
      [nome, descricao, preco_unitario, quantidade_estoque]
    );
    const newPeca = await db.get('SELECT * FROM pecas WHERE id_peca = ?', [result.lastID]);
    res.status(201).json(newPeca);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/pecas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco_unitario, quantidade_estoque } = req.body;
    const result = await db.run(
      'UPDATE pecas SET nome = ?, descricao = ?, preco_unitario = ?, quantidade_estoque = ? WHERE id_peca = ?',
      [nome, descricao, preco_unitario, quantidade_estoque, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Peça não encontrada' });
    const updatedPeca = await db.get('SELECT * FROM pecas WHERE id_peca = ?', [id]);
    res.json(updatedPeca);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/pecas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM pecas WHERE id_peca = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Peça não encontrada' });
    res.json({ message: 'Peça removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Serviços
app.get('/servicos', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM servicos ORDER BY id_servico');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/servicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM servicos WHERE id_servico = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/servicos', async (req, res) => {
  try {
    const { descricao, preco } = req.body;
    const result = await db.run(
      'INSERT INTO servicos (descricao, preco) VALUES (?, ?)',
      [descricao, preco]
    );
    const newServico = await db.get('SELECT * FROM servicos WHERE id_servico = ?', [result.lastID]);
    res.status(201).json(newServico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/servicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, preco } = req.body;
    const result = await db.run(
      'UPDATE servicos SET descricao = ?, preco = ? WHERE id_servico = ?',
      [descricao, preco, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    const updatedServico = await db.get('SELECT * FROM servicos WHERE id_servico = ?', [id]);
    res.json(updatedServico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/servicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM servicos WHERE id_servico = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Ordens de Serviço
app.get('/ordens_de_servico', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM ordens_de_servico ORDER BY id_ordem');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/ordens_de_servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM ordens_de_servico WHERE id_ordem = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/ordens_de_servico', async (req, res) => {
  try {
    const { id_veiculo, id_funcionario, data_abertura, data_conclusao, observacoes } = req.body;
    const result = await db.run(
      'INSERT INTO ordens_de_servico (id_veiculo, id_funcionario, data_abertura, data_conclusao, observacoes) VALUES (?, ?, ?, ?, ?)',
      [id_veiculo, id_funcionario, data_abertura, data_conclusao, observacoes]
    );
    const newOrdem = await db.get('SELECT * FROM ordens_de_servico WHERE id_ordem = ?', [result.lastID]);
    res.status(201).json(newOrdem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/ordens_de_servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_veiculo, id_funcionario, data_abertura, data_conclusao, observacoes } = req.body;
    const result = await db.run(
      'UPDATE ordens_de_servico SET id_veiculo = ?, id_funcionario = ?, data_abertura = ?, data_conclusao = ?, observacoes = ? WHERE id_ordem = ?',
      [id_veiculo, id_funcionario, data_abertura, data_conclusao, observacoes, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    const updatedOrdem = await db.get('SELECT * FROM ordens_de_servico WHERE id_ordem = ?', [id]);
    res.json(updatedOrdem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/ordens_de_servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM ordens_de_servico WHERE id_ordem = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    res.json({ message: 'Ordem de serviço removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Itens Peça
app.get('/itens_peca', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM itens_peca ORDER BY id_item');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/itens_peca/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM itens_peca WHERE id_item = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Item de peça não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/itens_peca', async (req, res) => {
  try {
    const { id_ordem, id_peca, quantidade, preco_unitario } = req.body;
    const result = await db.run(
      'INSERT INTO itens_peca (id_ordem, id_peca, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
      [id_ordem, id_peca, quantidade, preco_unitario]
    );
    const newItem = await db.get('SELECT * FROM itens_peca WHERE id_item = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/itens_peca/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_ordem, id_peca, quantidade, preco_unitario } = req.body;
    const result = await db.run(
      'UPDATE itens_peca SET id_ordem = ?, id_peca = ?, quantidade = ?, preco_unitario = ? WHERE id_item = ?',
      [id_ordem, id_peca, quantidade, preco_unitario, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Item de peça não encontrado' });
    const updatedItem = await db.get('SELECT * FROM itens_peca WHERE id_item = ?', [id]);
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/itens_peca/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM itens_peca WHERE id_item = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Item de peça não encontrado' });
    res.json({ message: 'Item de peça removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Itens Serviço
app.get('/itens_servico', async (req, res) => {
  try {
    const result = await db.all('SELECT * FROM itens_servico ORDER BY id_item');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/itens_servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.get('SELECT * FROM itens_servico WHERE id_item = ?', [id]);
    if (!result) return res.status(404).json({ error: 'Item de serviço não encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/itens_servico', async (req, res) => {
  try {
    const { id_ordem, id_servico, quantidade, preco_unitario } = req.body;
    const result = await db.run(
      'INSERT INTO itens_servico (id_ordem, id_servico, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
      [id_ordem, id_servico, quantidade, preco_unitario]
    );
    const newItem = await db.get('SELECT * FROM itens_servico WHERE id_item = ?', [result.lastID]);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/itens_servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_ordem, id_servico, quantidade, preco_unitario } = req.body;
    const result = await db.run(
      'UPDATE itens_servico SET id_ordem = ?, id_servico = ?, quantidade = ?, preco_unitario = ? WHERE id_item = ?',
      [id_ordem, id_servico, quantidade, preco_unitario, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Item de serviço não encontrado' });
    const updatedItem = await db.get('SELECT * FROM itens_servico WHERE id_item = ?', [id]);
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/itens_servico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM itens_servico WHERE id_item = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Item de serviço não encontrado' });
    res.json({ message: 'Item de serviço removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicializar banco e iniciar servidor
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log('Banco SQLite criado automaticamente!');
  });
}); 