import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/clientes';

export default function ClientesCrud() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', endereco: '' });

  const fetchClientes = async () => {
    const res = await axios.get(API_URL);
    setClientes(res.data);
  };

  useEffect(() => { fetchClientes(); }, []);

  const handleOpen = (cliente = null) => {
    setEditing(cliente);
    setForm(cliente || { nome: '', telefone: '', email: '', endereco: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_cliente}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchClientes();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover este cliente?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchClientes();
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Clientes</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Novo Cliente</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map(cliente => (
              <TableRow key={cliente.id_cliente}>
                <TableCell>{cliente.id_cliente}</TableCell>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.endereco}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(cliente)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(cliente.id_cliente)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} fullWidth />
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