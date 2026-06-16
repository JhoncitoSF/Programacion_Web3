import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { api }                 from '../utils/api';
import { useAuth }             from '../context/AuthContext';
import { generarFacturaPDF }   from '../utils/pdfFactura';
import '../styles/MisPedidos.css';

export default function MisPedidos() {
  const { usuario }              = useAuth();
  const navigate                 = useNavigate();
  const [pedidos,  setPedidos]   = useState([]);
  const [loading,  setLoading]   = useState(true);
  const [expanded, setExpanded]  = useState(null);
  const [pdfLoad,  setPdfLoad]   = useState(null);

  useEffect(() => {
    api.get('/orders/mis-pedidos').then(data => {
      if (data.ok) setPedidos(data.pedidos);
      setLoading(false);
    });
  }, []);

  const descargarFactura = async (pedido) => {
    setPdfLoad(pedido.id);
    const items = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : (pedido.items||[]);
    await generarFacturaPDF({
      pedidoId: pedido.id, total: pedido.total_pago, fecha: pedido.fecha,
      cliente: { nombre: usuario?.nombre, email: usuario?.email },
      items: items.map(i => ({ nombre:i.producto, categoria:i.categoria||'', cantidad:i.cantidad, precio:Number(i.precio) })),
    });
    setPdfLoad(null);
  };

  const estadoClass = (e) => ({
    PAGADO:'pedidos-estado--pagado', PENDIENTE:'pedidos-estado--pendiente',
    CANCELADO:'pedidos-estado--cancelado', ENVIADO:'pedidos-estado--enviado',
  }[e] || 'pedidos-estado--pendiente');

  if (loading) return <div className="pedidos-loading">Cargando pedidos...</div>;

  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <span className="pedidos-eyebrow">Mi Cuenta</span>
        <h1 className="pedidos-titulo">Mis Pedidos</h1>
      </div>

      {pedidos.length === 0 ? (
        <div className="pedidos-vacio">
          <div className="pedidos-vacio__icon">♩</div>
          <div className="pedidos-vacio__titulo">Aún no tienes pedidos</div>
          <p className="pedidos-vacio__desc">Explora nuestro catálogo y encuentra el instrumento perfecto.</p>
          <button className="pedidos-vacio__btn" onClick={() => navigate('/')}>Explorar Catálogo</button>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map(pedido => {
            const items    = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : (pedido.items||[]);
            const abierto  = expanded === pedido.id;
            return (
              <div key={pedido.id} className="pedidos-card">
                <div className="pedidos-card__header" onClick={() => setExpanded(abierto ? null : pedido.id)}>
                  <div className="pedidos-card__left">
                    <div className="pedidos-card__num">Pedido #{String(pedido.id).padStart(6,'0')}</div>
                    <div className="pedidos-card__fecha">
                      {new Date(pedido.fecha).toLocaleDateString('es-BO',{ day:'2-digit', month:'long', year:'numeric' })}
                    </div>
                  </div>
                  <span className={`pedidos-estado ${estadoClass(pedido.estado)}`}>{pedido.estado}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
                    <span className="pedidos-card__total">${Number(pedido.total_pago).toLocaleString()}</span>
                    <span className="pedidos-card__chevron">{abierto ? '▲' : '▼'}</span>
                  </div>
                </div>

                {abierto && (
                  <div className="pedidos-detalle">
                    <div className="pedidos-detalle-header">
                      {['Producto','Categoría','Cant.','Precio','Subtotal'].map(h => (
                        <span key={h} className="pedidos-detalle-th">{h}</span>
                      ))}
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className="pedidos-detalle-fila">
                        <span className="pedidos-detalle-nombre">{item.producto}</span>
                        <span className="pedidos-detalle-td">{item.categoria||'—'}</span>
                        <span className="pedidos-detalle-td">{item.cantidad}</span>
                        <span className="pedidos-detalle-td">${Number(item.precio).toLocaleString()}</span>
                        <span className="pedidos-detalle-subtotal">${(Number(item.precio)*item.cantidad).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pedidos-detalle-footer">
                      <span className="pedidos-detalle-count">{items.length} artículo{items.length!==1?'s':''}</span>
                      <button className="pedidos-btn-pdf"
                        onClick={() => descargarFactura(pedido)} disabled={pdfLoad===pedido.id}>
                        {pdfLoad===pedido.id ? 'Generando...' : '⬇ Factura PDF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
