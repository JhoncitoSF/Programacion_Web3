import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import Home          from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Payment       from './pages/Payment';
import MisPedidos    from './pages/MisPedidos';
import Login         from './pages/Login';
import Registro      from './pages/Registro';
import NotFound      from './pages/NotFound';
import Dashboard     from './pages/admin/Dashboard';
import Inventario    from './pages/admin/Inventario';
import Reports       from './pages/admin/Reports';

// ── Rutas protegidas ──────────────────────────────────────
const RutaPrivada = ({ children, rolRequerido }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return (
    <div style={{ background:'#050505', minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', color:'#222', fontSize:'0.7rem', letterSpacing:'0.3em' }}>
      CARGANDO...
    </div>
  );
  if (!usuario) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/" replace />;
  return children;
};

// ── Layout con Navbar + Footer ────────────────────────────
const Layout = ({ children, sinFooter }) => (
  <>
    <Navbar />
    {children}
    {!sinFooter && <Footer />}
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Públicas ── */}
          <Route path="/" element={
            <Layout><Home /></Layout>
          } />
          <Route path="/producto/:id" element={
            <Layout><ProductDetail /></Layout>
          } />
          <Route path="/login" element={
            <Layout sinFooter><Login /></Layout>
          } />
          <Route path="/registro" element={
            <Layout sinFooter><Registro /></Layout>
          } />

          {/* ── Cliente autenticado ── */}
          <Route path="/pago" element={
            <Layout sinFooter>
              <RutaPrivada><Payment /></RutaPrivada>
            </Layout>
          } />
          <Route path="/mis-pedidos" element={
            <Layout>
              <RutaPrivada><MisPedidos /></RutaPrivada>
            </Layout>
          } />

          {/* ── Solo ADMIN ── */}
          <Route path="/admin/dashboard" element={
            <Layout sinFooter>
              <RutaPrivada rolRequerido="ADMIN"><Dashboard /></RutaPrivada>
            </Layout>
          } />
          <Route path="/admin/inventario" element={
            <Layout sinFooter>
              <RutaPrivada rolRequerido="ADMIN"><Inventario /></RutaPrivada>
            </Layout>
          } />
          <Route path="/admin/reportes" element={
            <Layout sinFooter>
              <RutaPrivada rolRequerido="ADMIN"><Reports /></RutaPrivada>
            </Layout>
          } />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
