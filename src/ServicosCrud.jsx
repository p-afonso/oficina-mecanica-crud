import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/servicos';

export default function ServicosCrud() {
  const [servicos, setServicos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ descricao: '', preco: '' });

  const fetchServicos = async () => {
    const res = await axios.get(API_URL);
    setServicos(res.data);
  };

  useEffect(() => { fetchServicos(); }, []);

  const handleOpen = (servico = null) => {
    setEditing(servico);
    setForm(servico || { descricao: '', preco: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_servico}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchServicos();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover este serviço?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchServicos();
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Serviços</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Novo Serviço</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicos.map(servico => (
              <TableRow key={servico.id_servico}>
                <TableCell>{servico.id_servico}</TableCell>
                <TableCell>{servico.descricao}</TableCell>
                <TableCell>R$ {servico.preco}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(servico)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(servico.id_servico)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Preço" name="preco" value={form.preco} onChange={handleChange} fullWidth type="number" step="0.01" required />
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