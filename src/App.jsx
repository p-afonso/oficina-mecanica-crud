import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, Grid, Card, CardContent, CardActions } from '@mui/material';
import { 
  People, 
  Engineering, 
  DirectionsCar, 
  Build, 
  Handyman, 
  Assignment, 
  Inventory, 
  Receipt 
} from '@mui/icons-material';
import ClientesCrud from './ClientesCrud';
import FuncionariosCrud from './FuncionariosCrud';
import VeiculosCrud from './VeiculosCrud';
import PecasCrud from './PecasCrud';
import ServicosCrud from './ServicosCrud';
import OrdensCrud from './OrdensCrud';
import ItensPecaCrud from './ItensPecaCrud';
import ItensServicoCrud from './ItensServicoCrud';

function HomePage() {
  const menuItems = [
    { title: 'Clientes', path: '/clientes', icon: <People />, description: 'Gerenciar cadastro de clientes' },
    { title: 'Funcionários', path: '/funcionarios', icon: <Engineering />, description: 'Gerenciar equipe de funcionários' },
    { title: 'Veículos', path: '/veiculos', icon: <DirectionsCar />, description: 'Controle de veículos dos clientes' },
    { title: 'Peças', path: '/pecas', icon: <Build />, description: 'Controle de estoque de peças' },
    { title: 'Serviços', path: '/servicos', icon: <Handyman />, description: 'Cadastro de serviços oferecidos' },
    { title: 'Ordens de Serviço', path: '/ordens', icon: <Assignment />, description: 'Gerenciar ordens de serviço' },
    { title: 'Itens Peça', path: '/itens-peca', icon: <Inventory />, description: 'Controle de peças utilizadas' },
    { title: 'Itens Serviço', path: '/itens-servico', icon: <Receipt />, description: 'Controle de serviços prestados' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🚗 Oficina Mecânica
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Sistema de Gerenciamento Completo
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.path}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography gutterBottom variant="h6" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  component={Link} 
                  to={item.path} 
                  variant="contained" 
                  size="small"
                  fullWidth
                >
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function ClientesPage() {
  return <ClientesCrud />;
}
function FuncionariosPage() {
  return <FuncionariosCrud />;
}
function VeiculosPage() {
  return <VeiculosCrud />;
}
function PecasPage() {
  return <PecasCrud />;
}
function ServicosPage() {
  return <ServicosCrud />;
}
function OrdensPage() {
  return <OrdensCrud />;
}
function ItensPecaPage() {
  return <ItensPecaCrud />;
}
function ItensServicoPage() {
  return <ItensServicoCrud />;
}

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🚗 Oficina Mecânica
          </Typography>
          <Button color="inherit" component={Link} to="/">Início</Button>
          <Button color="inherit" component={Link} to="/clientes">Clientes</Button>
          <Button color="inherit" component={Link} to="/funcionarios">Funcionários</Button>
          <Button color="inherit" component={Link} to="/veiculos">Veículos</Button>
          <Button color="inherit" component={Link} to="/pecas">Peças</Button>
          <Button color="inherit" component={Link} to="/servicos">Serviços</Button>
          <Button color="inherit" component={Link} to="/ordens">Ordens</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'grey.50' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/funcionarios" element={<FuncionariosPage />} />
          <Route path="/veiculos" element={<VeiculosPage />} />
          <Route path="/pecas" element={<PecasPage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/ordens" element={<OrdensPage />} />
          <Route path="/itens-peca" element={<ItensPecaPage />} />
          <Route path="/itens-servico" element={<ItensServicoPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Box>
    </Router>
  );
}
