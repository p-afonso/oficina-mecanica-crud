import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/pecas';

export default function PecasCrud() {
  const [pecas, setPecas] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', descricao: '', preco_unitario: '', quantidade_estoque: '' });

  const fetchPecas = async () => {
    const res = await axios.get(API_URL);
    setPecas(res.data);
  };

  useEffect(() => { fetchPecas(); }, []);

  const handleOpen = (peca = null) => {
    setEditing(peca);
    setForm(peca || { nome: '', descricao: '', preco_unitario: '', quantidade_estoque: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_peca}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchPecas();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover esta peça?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchPecas();
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Peças</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Nova Peça</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Quantidade em Estoque</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pecas.map(peca => (
              <TableRow key={peca.id_peca}>
                <TableCell>{peca.id_peca}</TableCell>
                <TableCell>{peca.nome}</TableCell>
                <TableCell>{peca.descricao}</TableCell>
                <TableCell>R$ {peca.preco_unitario}</TableCell>
                <TableCell>{peca.quantidade_estoque}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(peca)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(peca.id_peca)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Peça' : 'Nova Peça'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} fullWidth multiline rows={3} />
            <TextField margin="dense" label="Preço Unitário" name="preco_unitario" value={form.preco_unitario} onChange={handleChange} fullWidth type="number" step="0.01" required />
            <TextField margin="dense" label="Quantidade em Estoque" name="quantidade_estoque" value={form.quantidade_estoque} onChange={handleChange} fullWidth type="number" required />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
} 