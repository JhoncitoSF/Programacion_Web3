import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api }          from '../utils/api';
import { useAuth }      from '../context/AuthContext';
import Captcha          from '../components/Captcha';
import PasswordStrength from '../components/PasswordStrength';
import '../styles/Auth.css';

export default function Registro() {
  const [form,    setForm]    = useState({ nombre:'', email:'', password:'', confirmar:'' });
  const [captcha, setCaptcha] = useState({ captchaToken:'', captchaRespuesta:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden');
    setLoading(true);
    const data = await api.post('/auth/registro', {
      nombre: form.nombre, email: form.email, password: form.password, ...captcha,
    });
    setLoading(false);
    if (!data.ok) return setError(data.mensaje || 'Error al registrarse');
    iniciarSesion(data.token, data.usuario);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Jazz<span>Pro</span>Studio</div>
        <div className="auth-eyebrow">Crear cuenta</div>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {[
            { label:'Nombre completo', key:'nombre', type:'text'  },
            { label:'Correo',          key:'email',  type:'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="auth-label">{label}</label>
              <input className="auth-input" type={type} required value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <label className="auth-label">Contraseña</label>
          <input className="auth-input" type="password" required value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          <PasswordStrength password={form.password} />
          <div style={{ marginBottom:'1.5rem' }} />
          <label className="auth-label">Confirmar contraseña</label>
          <input className="auth-input" type="password" required value={form.confirmar}
            onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))} />
          <Captcha onChange={setCaptcha} />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="auth-footer">¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
      </div>
    </div>
  );
}
