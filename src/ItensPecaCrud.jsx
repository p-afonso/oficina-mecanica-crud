import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/itens_peca';
const ORDENS_URL = 'http://localhost:3001/ordens_de_servico';
const PECAS_URL = 'http://localhost:3001/pecas';

export default function ItensPecaCrud() {
  const [itens, setItens] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id_ordem: '', id_peca: '', quantidade: '', preco_unitario: '' });

  const fetchItens = async () => {
    const res = await axios.get(API_URL);
    setItens(res.data);
  };

  const fetchOrdens = async () => {
    const res = await axios.get(ORDENS_URL);
    setOrdens(res.data);
  };

  const fetchPecas = async () => {
    const res = await axios.get(PECAS_URL);
    setPecas(res.data);
  };

  useEffect(() => { 
    fetchItens(); 
    fetchOrdens();
    fetchPecas();
  }, []);

  const handleOpen = (item = null) => {
    setEditing(item);
    setForm(item || { id_ordem: '', id_peca: '', quantidade: '', preco_unitario: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_item}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchItens();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover este item de peça?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchItens();
    }
  };

  const getOrdemInfo = (id_ordem) => {
    const ordem = ordens.find(o => o.id_ordem === id_ordem);
    return ordem ? `Ordem #${ordem.id_ordem}` : 'N/A';
  };

  const getPecaNome = (id_peca) => {
    const peca = pecas.find(p => p.id_peca === id_peca);
    return peca ? peca.nome : 'N/A';
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Itens de Peça</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Novo Item</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ordem</TableCell>
              <TableCell>Peça</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens.map(item => (
              <TableRow key={item.id_item}>
                <TableCell>{item.id_item}</TableCell>
                <TableCell>{getOrdemInfo(item.id_ordem)}</TableCell>
                <TableCell>{getPecaNome(item.id_peca)}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>R$ {item.preco_unitario}</TableCell>
                <TableCell>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item.id_item)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar Item de Peça' : 'Novo Item de Peça'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Ordem de Serviço</InputLabel>
              <Select name="id_ordem" value={form.id_ordem} onChange={handleChange} required>
                {ordens.map(ordem => (
                  <MenuItem key={ordem.id_ordem} value={ordem.id_ordem}>
                    Ordem #{ordem.id_ordem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Peça</InputLabel>
              <Select name="id_peca" value={form.id_peca} onChange={handleChange} required>
                {pecas.map(peca => (
                  <MenuItem key={peca.id_peca} value={peca.id_peca}>
                    {peca.nome} - R$ {peca.preco_unitario}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField margin="dense" label="Quantidade" name="quantidade" value={form.quantidade} onChange={handleChange} fullWidth type="number" required />
            <TextField margin="dense" label="Preço Unitário" name="preco_unitario" value={form.preco_unitario} onChange={handleChange} fullWidth type="number" step="0.01" required />
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