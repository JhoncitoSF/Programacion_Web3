import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api }      from '../utils/api';
import { useAuth }  from '../context/AuthContext';
import Captcha      from '../components/Captcha';
import '../styles/Auth.css';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState({ captchaToken: '', captchaRespuesta: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const data = await api.post('/auth/login', { ...form, ...captcha });
    setLoading(false);
    if (!data.ok) return setError(data.mensaje || 'Error al iniciar sesión');
    iniciarSesion(data.token, data.usuario);
    navigate(data.usuario.rol === 'ADMIN' ? '/admin/dashboard' : '/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Jazz<span>Pro</span>Studio</div>
        <div className="auth-eyebrow">Iniciar sesión</div>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <label className="auth-label">Correo electrónico</label>
          <input className="auth-input" type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <label className="auth-label">Contraseña</label>
          <input className="auth-input" type="password" required value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          <Captcha onChange={setCaptcha} />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-footer">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}
