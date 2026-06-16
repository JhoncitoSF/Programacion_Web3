import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api }               from '../utils/api';
import { useAuth }           from '../context/AuthContext';
import InstrumentPlaceholder from '../components/InstrumentPlaceholder';
import '../styles/ProductDetail.css';

const SPECS = {
  'Saxofón':   [['Tonalidad','Mi♭ / Si♭'],['Campana','Latón amarillo'],['Acabado','Laca dorada'],['Llaves','21-23 llaves']],
  'Trompeta':  [['Tonalidad','Si♭'],['Diámetro campana','4.8"'],['Pistones','3 monel'],['Acabado','Lacado brillante']],
  'Trombón':   [['Tonalidad','Si♭'],['Tubo','0.547"'],['Campana','8"'],['Deslizador','Cromo pulido']],
  'Clarinete': [['Tonalidad','Si♭'],['Material','Granadilla africana'],['Llaves','17 llaves'],['Boquilla','B45']],
  'Flauta':    [['Tonalidad','Do'],['Material','Plata de ley'],['Agujeros','16 abiertos'],['Cabezal','Sólido']],
  'Tuba':      [['Tonalidad','Si♭ / Mi♭'],['Válvulas','4 rotativas'],['Campana','16"'],['Peso','5.2 kg']],
  'Fliscorno': [['Tonalidad','Si♭'],['Pistones','3 monel'],['Campana','5"'],['Acabado','Plata mate']],
};

export default function ProductDetail() {
  const { id }              = useParams();
  const navigate            = useNavigate();
  const { usuario }         = useAuth();
  const [producto, setP]    = useState(null);
  const [loading,  setL]    = useState(true);
  const [error,    setE]    = useState('');
  const [cantidad, setCant] = useState(1);
  const [imgError, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
    api.get(`/products/${id}`).then(data => {
      if (!data.ok) { setE('Producto no encontrado'); setL(false); return; }
      setP(data.producto); setL(false);
    });
  }, [id]);

  const handleComprar = () => {
    if (!usuario) return navigate('/login');
    sessionStorage.setItem('jps_cart', JSON.stringify([{
      productoId: producto.id, nombre: producto.nombre,
      precio: producto.precio, cantidad,
    }]));
    navigate('/pago');
  };

  if (loading) return <div className="detail-estado">Cargando producto...</div>;
  if (error)   return <div className="detail-estado">{error}</div>;

  const usarSVG = !producto.imagen_url || producto.imagen_url.trim() === '' || imgError;
  const specs   = SPECS[producto.categoria] || [];
  const stockClass = producto.stock > 5 ? 'detail-stock--ok' : producto.stock > 0 ? 'detail-stock--warn' : 'detail-stock--empty';

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <span className="detail-breadcrumb__link" onClick={() => navigate('/')}>Catálogo</span>
        <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__link" onClick={() => navigate('/')}>{producto.categoria}</span>
        <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__current">{producto.nombre}</span>
      </div>

      <div className="detail-grid">
        {/* Imagen */}
        <div>
          <div className="detail-img-frame">
            <div className="detail-img-tag">{producto.subtipo}</div>
            {usarSVG ? (
              <InstrumentPlaceholder categoria={producto.categoria} subtipo={producto.subtipo} style={{ height:'100%' }} />
            ) : (
              <img src={producto.imagen_url} alt={producto.nombre}
                className="detail-img-el" onError={() => setImgErr(true)} />
            )}
          </div>
          <div className={`detail-stock ${stockClass}`}>
            {producto.stock > 5 ? `✓ En stock — ${producto.stock} disponibles`
             : producto.stock > 0 ? `⚠ Últimas ${producto.stock} unidades`
             : '✗ Sin stock temporalmente'}
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="detail-eyebrow">Instrumento · {producto.categoria}</span>
          <h1 className="detail-titulo">{producto.nombre}</h1>
          <div className="detail-gold-line" />
          <p className="detail-desc">{producto.descripcion}</p>

          <div className="detail-specs">
            <div className="detail-specs__title">Especificaciones</div>
            <table className="detail-specs-table">
              <tbody>
                {[['Categoría', producto.categoria],['Modelo', producto.subtipo], ...specs].map(([k,v]) => (
                  <tr key={k}>
                    <td className="detail-spec-key">{k}</td>
                    <td className="detail-spec-val">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detail-precio-row">
            <span className="detail-precio">${Number(producto.precio).toLocaleString()}</span>
            <span className="detail-precio-note">USD · IVA incluido</span>
          </div>

          <div className="detail-cantidad-row">
            <span className="detail-cantidad-label">Cantidad</span>
            <div className="detail-cantidad-ctrl">
              <button className="detail-cantidad-btn" onClick={() => setCant(c => Math.max(1, c-1))}>−</button>
              <span className="detail-cantidad-val">{cantidad}</span>
              <button className="detail-cantidad-btn" onClick={() => setCant(c => Math.min(producto.stock, c+1))}>+</button>
            </div>
          </div>

          <button className="detail-btn-comprar"
            onClick={handleComprar} disabled={producto.stock === 0}>
            {producto.stock === 0 ? 'Sin Stock' : 'Comprar Ahora'}
          </button>

          <div className="detail-garantias">
            {['✓ Garantía 2 años','✓ Envío asegurado','✓ Devolución 30 días'].map(t => (
              <span key={t} className="detail-garantia-item">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
