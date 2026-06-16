import '../styles/PasswordStrength.css';

export default function PasswordStrength({ password }) {
  const evaluar = (pwd) => {
    if (!pwd) return { nivel: 0, texto: '', color: '#333' };
    let pts = 0;
    if (pwd.length >= 8)        pts++;
    if (/[A-Z]/.test(pwd))      pts++;
    if (/[0-9]/.test(pwd))      pts++;
    if (/[!@#$%^&*]/.test(pwd)) pts++;
    if (pwd.length >= 12)       pts++;
    if (pts <= 2) return { nivel: pts, texto: 'Débil',      color: '#8B1A1A' };
    if (pts <= 3) return { nivel: pts, texto: 'Intermedia', color: '#8B6914' };
    return               { nivel: pts, texto: 'Fuerte',     color: '#2E7D32' };
  };

  const { nivel, texto, color } = evaluar(password);
  if (!password) return null;

  const barras = [1,2,3,4].map(i => ({ filled: i <= (nivel >= 4 ? 4 : nivel <= 2 ? 1 : nivel === 3 ? 2 : 3) }));

  return (
    <div className="pwd-strength">
      <div className="pwd-strength__bars">
        {barras.map((b, i) => (
          <div key={i} className="pwd-strength__bar" style={{ background: b.filled ? color : '#1c1c1c' }} />
        ))}
      </div>
      <div className="pwd-strength__label" style={{ color }}>
        Contraseña {texto}
        {nivel < 3 && <span className="pwd-strength__hint">· Agrega mayúsculas, números y símbolos</span>}
      </div>
    </div>
  );
}
