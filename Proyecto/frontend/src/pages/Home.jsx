import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { api }                 from '../utils/api';
import InstrumentPlaceholder   from '../components/InstrumentPlaceholder';
import '../styles/Home.css';

const FAMILIAS = [
  { id:'saxofon',   nombre:'Saxofón',           categoria:'Saxofón',   descripcion:'El alma del jazz moderno. Del íntimo soprano a la profundidad del barítono.', subtipos:['Soprano','Alto','Tenor','Barítono'] },
  { id:'trompeta',  nombre:'Trompeta & Corneta', categoria:'Trompeta',  descripcion:'El heraldo del swing y el bebop. Líneas brillantes de precisión matemática.', subtipos:['Trompeta','Corneta'] },
  { id:'trombon',   nombre:'Trombón',            categoria:'Trombón',   descripcion:'Profundidad armónica y glissandos inconfundibles. La voz grave del ensamble.', subtipos:['Tenor','Bajo'] },
  { id:'clarinete', nombre:'Clarinete',          categoria:'Clarinete', descripcion:'El espíritu de Nueva Orleans. Lírico, flexible, con riqueza tímbrica única.', subtipos:['Clarinete Bb','Clarinete Bajo'] },
  { id:'flauta',    nombre:'Flauta',             categoria:'Flauta',    descripcion:'Delicadeza y agilidad para el jazz contemporáneo y la fusión moderna.', subtipos:['Flauta Traversa','Piccolo'] },
  { id:'tuba',      nombre:'Tuba & Fliscorno',   categoria:'Tuba',      descripcion:'Los graves que hacen vibrar el suelo. Fundamento del jazz orquestal.', subtipos:['Tuba','Fliscorno'] },
];

function ProductCard({ producto, onClick }) {
  const [imgError, setImgError] = useState(false);
  const usarSVG = !producto.imagen_url || producto.imagen_url.trim() === '' || imgError;

  return (
    <div className="product-card" onClick={() => onClick(producto.id)}>
      <div className="product-card__img">
        {usarSVG ? (
          <InstrumentPlaceholder categoria={producto.categoria} subtipo={producto.subtipo} />
        ) : (
          <img src={producto.imagen_url} alt={producto.nombre}
            className="product-card__img-el" onError={() => setImgError(true)} />
        )}
        <div className="product-card__overlay">
          <span className="product-card__overlay-txt">Ver detalle →</span>
        </div>
        {producto.stock === 0 && <div className="product-card__badge-stock">Sin stock</div>}
      </div>
      <div className="product-card__body">
        <div className="product-card__cat">{producto.subtipo}</div>
        <div className="product-card__nombre">{producto.nombre}</div>
        <div className="product-card__bottom">
          <span className="product-card__precio">${Number(producto.precio).toLocaleString()}</span>
          <span className="product-card__tag">
            {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
          </span>
        </div>
      </div>
    </div>
  );
}

function SeccionFamilia({ familia, productos, onSelect }) {
  const propios = productos.filter(p => p.categoria === familia.categoria);
  return (
    <section id={familia.id} className="seccion">
      <div className="seccion__header">
        <div className="seccion__left">
          <div className="seccion__eyebrow">Familia de Instrumentos</div>
          <h2 className="seccion__titulo">{familia.nombre}</h2>
          <div className="seccion__subtipos">
            {familia.subtipos.map(st => <span key={st} className="seccion__badge">{st}</span>)}
          </div>
        </div>
        <p className="seccion__desc">{familia.descripcion}</p>
      </div>

      {propios.length > 0 ? (
        <div className="product-grid">
          {propios.map(p => <ProductCard key={p.id} producto={p} onClick={onSelect} />)}
          {propios.length < 4 && Array.from({ length: 4 - propios.length }).map((_, i) => (
            <div key={`e${i}`} className="product-card__vacia" />
          ))}
        </div>
      ) : (
        <div className="seccion__vacio">
          <span className="seccion__vacio-txt">Colección en preparación</span>
        </div>
      )}
      <div className="seccion__divider" />
    </section>
  );
}

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?limite=100').then(data => {
      if (data.ok) setProductos(data.productos);
      else setError(true);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <img src="/images/hero_portada.png" alt="Jazz" className="hero__bg" />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__label">
            <span className="hero__label-line" />
            Instrumentos de Jazz Premium
          </div>
          <h1 className="hero__title">
            El Arte<br/>del Sonido<br/>
            <em>Perfecto</em>
          </h1>
          <p className="hero__sub">
            Instrumentos seleccionados para músicos que no aceptan compromisos.
            Cada pieza, una obra maestra de ingeniería acústica.
          </p>
          <div className="hero__cta">
            <button className="hero__btn-primary"
              onClick={() => document.getElementById('saxofon')?.scrollIntoView({ behavior:'smooth' })}>
              Explorar Catálogo
            </button>
            <button className="hero__btn-secondary" onClick={() => navigate('/registro')}>
              Crear Cuenta
            </button>
          </div>
          <div className="hero__stats">
            {[['12','Instrumentos'],['6','Familias'],['3','Marcas Elite']].map(([n,l]) => (
              <div key={l}>
                <span className="hero__stat-num">{n}</span>
                <span className="hero__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__bottom-line" />
      </section>

      {/* Nav familias */}
      <nav className="familia-nav">
        {FAMILIAS.map(f => (
          <a key={f.id} href={`#${f.id}`} className="familia-nav__link">{f.nombre}</a>
        ))}
      </nav>

      {/* Catálogo */}
      <div className="catalogo">
        {loading && <div className="catalogo__estado">CARGANDO CATÁLOGO...</div>}
        {error && !loading && (
          <div className="catalogo__error">
            <div className="catalogo__error-titulo">No se pudo conectar con el servidor</div>
            <p className="catalogo__error-sub">
              Backend en <span className="catalogo__error-url">http://localhost:5000</span>
            </p>
            <button className="hero__btn-primary" onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}
        {!loading && !error && FAMILIAS.map(f => (
          <SeccionFamilia key={f.id} familia={f} productos={productos}
            onSelect={id => navigate(`/producto/${id}`)} />
        ))}
      </div>
    </main>
  );
}
