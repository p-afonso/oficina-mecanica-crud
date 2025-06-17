import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:3001/ordens_de_servico';
const VEICULOS_URL = 'http://localhost:3001/veiculos';
const FUNCIONARIOS_URL = 'http://localhost:3001/funcionarios';

export default function OrdensCrud() {
  const [ordens, setOrdens] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id_veiculo: '', id_funcionario: '', data_abertura: '', data_conclusao: '', observacoes: '' });

  const fetchOrdens = async () => {
    const res = await axios.get(API_URL);
    setOrdens(res.data);
  };

  const fetchVeiculos = async () => {
    const res = await axios.get(VEICULOS_URL);
    setVeiculos(res.data);
  };

  const fetchFuncionarios = async () => {
    const res = await axios.get(FUNCIONARIOS_URL);
    setFuncionarios(res.data);
  };

  useEffect(() => { 
    fetchOrdens(); 
    fetchVeiculos();
    fetchFuncionarios();
  }, []);

  const handleOpen = (ordem = null) => {
    setEditing(ordem);
    setForm(ordem || { id_veiculo: '', id_funcionario: '', data_abertura: '', data_conclusao: '', observacoes: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/${editing.id_ordem}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    fetchOrdens();
    handleClose();
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja remover esta ordem de serviço?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchOrdens();
    }
  };

  const getVeiculoInfo = (id_veiculo) => {
    const veiculo = veiculos.find(v => v.id_veiculo === id_veiculo);
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}` : 'N/A';
  };

  const getFuncionarioNome = (id_funcionario) => {
    const funcionario = funcionarios.find(f => f.id_funcionario === id_funcionario);
    return funcionario ? funcionario.nome : 'N/A';
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Ordens de Serviço</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Nova Ordem</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Funcionário</TableCell>
              <TableCell>Data Abertura</TableCell>
              <TableCell>Data Conclusão</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordens.map(ordem => (
              <TableRow key={ordem.id_ordem}>
                <TableCell>{ordem.id_ordem}</TableCell>
                <TableCell>{getVeiculoInfo(ordem.id_veiculo)}</TableCell>
                <TableCell>{getFuncionarioNome(ordem.id_funcionario)}</TableCell>
                <TableCell>{ordem.data_abertura}</TableCell>
                <TableCell>{ordem.data_conclusao || '-'}</TableCell>
                <TableCell>{ordem.observacoes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(ordem)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(ordem.id_ordem)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Veículo</InputLabel>
              <Select name="id_veiculo" value={form.id_veiculo} onChange={handleChange} required>
                {veiculos.map(veiculo => (
                  <MenuItem key={veiculo.id_veiculo} value={veiculo.id_veiculo}>
                    {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Funcionário</InputLabel>
              <Select name="id_funcionario" value={form.id_funcionario} onChange={handleChange} required>
                {funcionarios.map(funcionario => (
                  <MenuItem key={funcionario.id_funcionario} value={funcionario.id_funcionario}>
                    {funcionario.nome} - {funcionario.cargo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField margin="dense" label="Data de Abertura" name="data_abertura" value={form.data_abertura} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} required />
            <TextField margin="dense" label="Data de Conclusão" name="data_conclusao" value={form.data_conclusao} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} />
            <TextField margin="dense" label="Observações" name="observacoes" value={form.observacoes} onChange={handleChange} fullWidth multiline rows={3} />
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