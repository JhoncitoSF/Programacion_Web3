import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  const familias = ['Saxofón','Trompeta','Trombón','Clarinete','Flauta','Tuba'];
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <div className="footer__logo">Jazz<span>Pro</span>Studio</div>
          <p className="footer__tagline">Instrumentos de jazz de nivel profesional para músicos que no aceptan compromisos sonoros.</p>
          <div className="footer__gold-line" />
          <p className="footer__contacto">contacto@jazzprostudio.com</p>
          <p className="footer__contacto">La Paz, Bolivia</p>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Catálogo</div>
          {familias.map(f => <Link key={f} to={`/#${f.toLowerCase()}`} className="footer__col-link">{f}</Link>)}
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Mi Cuenta</div>
          {[['Ingresar','/login'],['Registrarse','/registro']].map(([l,h]) => (
            <Link key={l} to={h} className="footer__col-link">{l}</Link>
          ))}
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Información</div>
          {['Política de Devoluciones','Garantías','Envíos','Sobre Nosotros'].map(l => (
            <span key={l} className="footer__col-link">{l}</span>
          ))}
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__copy">© {new Date().getFullYear()} JazzProStudio · Todos los derechos reservados</span>
        <span className="footer__stack">React · Node.js · MySQL · JWT</span>
      </div>
    </footer>
  );
}
