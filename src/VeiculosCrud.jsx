import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/veiculos';
const CLIENTES_URL = 'http://localhost:3001/clientes';

export default function VeiculosCrud() {
  const [veiculos, setVeiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id_cliente: '', marca: '', modelo: '', ano: '', placa: '' });

  const fetchVeiculos = async () => {
    const res = await axios.get(API_URL);
    setVeiculos(res.data);
  };

  const fetchClientes = async () => {
    const res = await axios.get(CLIENTES_URL);
    setClientes(res.data);
  };

  useEffect(() => { 
    fetchVeiculos(); 
    fetchClientes();
  }, []);

  const handleOpen = (veiculo = null) => {
    setEditing(veiculo);
    setForm(veiculo || { id_cliente: '', marca: '', modelo: '', ano: '', placa: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_veiculo}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchVeiculos();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover este veículo?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchVeiculos();
    }
  };

  const getClienteNome = (id_cliente) => {
    const cliente = clientes.find(c => c.id_cliente === id_cliente);
    return cliente ? cliente.nome : 'N/A';
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Veículos</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Novo Veículo</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {veiculos.map(veiculo => (
              <TableRow key={veiculo.id_veiculo}>
                <TableCell>{veiculo.id_veiculo}</TableCell>
                <TableCell>{getClienteNome(veiculo.id_cliente)}</TableCell>
                <TableCell>{veiculo.marca}</TableCell>
                <TableCell>{veiculo.modelo}</TableCell>
                <TableCell>{veiculo.ano}</TableCell>
                <TableCell>{veiculo.placa}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(veiculo)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(veiculo.id_veiculo)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Cliente</InputLabel>
              <Select name="id_cliente" value={form.id_cliente} onChange={handleChange} required>
                {clientes.map(cliente => (
                  <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField margin="dense" label="Marca" name="marca" value={form.marca} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Ano" name="ano" value={form.ano} onChange={handleChange} fullWidth type="number" />
            <TextField margin="dense" label="Placa" name="placa" value={form.placa} onChange={handleChange} fullWidth />
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