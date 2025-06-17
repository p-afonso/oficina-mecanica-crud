import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/funcionarios';

export default function FuncionariosCrud() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', cargo: '', telefone: '', data_admissao: '' });

  const fetchFuncionarios = async () => {
    const res = await axios.get(API_URL);
    setFuncionarios(res.data);
  };

  useEffect(() => { fetchFuncionarios(); }, []);

  const handleOpen = (funcionario = null) => {
    setEditing(funcionario);
    setForm(funcionario || { nome: '', cargo: '', telefone: '', data_admissao: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_funcionario}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchFuncionarios();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover este funcionário?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchFuncionarios();
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Funcionários</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Novo Funcionário</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Admissão</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios.map(funcionario => (
              <TableRow key={funcionario.id_funcionario}>
                <TableCell>{funcionario.id_funcionario}</TableCell>
                <TableCell>{funcionario.nome}</TableCell>
                <TableCell>{funcionario.cargo}</TableCell>
                <TableCell>{funcionario.telefone}</TableCell>
                <TableCell>{funcionario.data_admissao}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(funcionario)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(funcionario.id_funcionario)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Data de Admissão" name="data_admissao" value={form.data_admissao} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} />
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