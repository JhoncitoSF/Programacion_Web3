import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api }     from '../utils/api';
import '../styles/Navbar.css';

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = async () => {
    await api.post('/auth/logout', {});
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Jazz<span>Pro</span>Studio
      </Link>

      <ul className="navbar__links">
        <li>
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>
            Catálogo
          </Link>
        </li>
        {usuario?.rol === 'ADMIN' && (
          <>
            <li><Link to="/admin/dashboard"  className={`navbar__link navbar__link--admin ${location.pathname.startsWith('/admin/dashboard')  ? 'navbar__link--admin-active' : ''}`}>Dashboard</Link></li>
            <li><Link to="/admin/inventario" className={`navbar__link navbar__link--admin ${location.pathname.startsWith('/admin/inventario') ? 'navbar__link--admin-active' : ''}`}>Inventario</Link></li>
            <li><Link to="/admin/reportes"   className={`navbar__link navbar__link--admin ${location.pathname.startsWith('/admin/reportes')   ? 'navbar__link--admin-active' : ''}`}>Reportes</Link></li>
          </>
        )}
      </ul>

      <div className="navbar__actions">
        {!usuario ? (
          <>
            <Link to="/login"    className="btn-ghost">Ingresar</Link>
            <Link to="/registro" className="btn-gold">Registrarse</Link>
          </>
        ) : (
          <>
            <span className="navbar__welcome">
              {usuario.rol === 'ADMIN' && <span className="navbar__welcome-icon">⬡</span>}
              {usuario.nombre.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="btn-gold">Salir</button>
          </>
        )}
      </div>
    </nav>
  );
}
