import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { api }                 from '../utils/api';
import { useAuth }             from '../context/AuthContext';
import { generarFacturaPDF }   from '../utils/pdfFactura';
import '../styles/Payment.css';

const PASOS = ['Resumen', 'Datos de Pago', 'Confirmación'];

export default function Payment() {
  const { usuario }             = useAuth();
  const navigate                = useNavigate();
  const [items,    setItems]    = useState([]);
  const [paso,     setPaso]     = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [pedidoOk, setPedidoOk] = useState(null);
  const [pdfLoad,  setPdfLoad]  = useState(false);

  // ── Estado del pago en el componente raíz (evita re-render en subcomponentes) ──
  const [metodo,      setMetodo]      = useState('tarjeta');
  const [titular,     setTitular]     = useState('');
  const [numero,      setNumero]      = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv,         setCvv]         = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('jps_cart');
    if (!raw) { navigate('/'); return; }
    setItems(JSON.parse(raw));
  }, []);

  const total = items.reduce((acc, i) => acc + Number(i.precio) * i.cantidad, 0);

  const handleConfirmar = async () => {
    if (metodo === 'tarjeta') {
      if (!titular || !numero || !vencimiento || !cvv)
        return setError('Por favor completa todos los campos de pago');
      if (!/^\d{16}$/.test(numero.replace(/\s/g, '')))
        return setError('Número de tarjeta inválido (16 dígitos)');
      if (!/^\d{3,4}$/.test(cvv))
        return setError('CVV inválido');
    }
    setError(''); setLoading(true);
    const data = await api.post('/orders', {
      items: items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
    });
    setLoading(false);
    if (!data.ok) return setError(data.mensaje || 'Error al procesar el pago');
    sessionStorage.removeItem('jps_cart');
    setPedidoOk({
      pedidoId: data.pedidoId, total: data.total,
      fecha: new Date().toISOString(),
      cliente: { nombre: usuario?.nombre, email: usuario?.email },
      items: items.map(i => ({ nombre: i.nombre, categoria: i.categoria || '', cantidad: i.cantidad, precio: Number(i.precio) })),
    });
    setPaso(2);
  };

  const descargar = async () => {
    setPdfLoad(true);
    await generarFacturaPDF(pedidoOk);
    setPdfLoad(false);
  };

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* Indicador de pasos */}
        <div className="payment-steps">
          {PASOS.map((p, i) => (
            <div key={p} className="payment-step">
              <div className={`payment-step__circle ${i <= paso ? 'payment-step__circle--active' : ''}`}>
                {i < paso ? '✓' : i + 1}
              </div>
              <span className={`payment-step__label ${i <= paso ? 'payment-step__label--active' : ''}`}>{p}</span>
              {i < PASOS.length - 1 && (
                <div className={`payment-step__line ${i < paso ? 'payment-step__line--done' : ''}`} />
              )}
            </div>
          ))}
        </div>

        <div className="payment-content">

          {/* ── PASO 0: Resumen ── */}
          {paso === 0 && (
            <div>
              <div className="payment-title">Resumen de tu pedido</div>
              {items.map((item, i) => (
                <div key={i} className="payment-item-row">
                  <div>
                    <div className="payment-item-nombre">{item.nombre}</div>
                    <div className="payment-item-sub">Cantidad: {item.cantidad}</div>
                  </div>
                  <div className="payment-item-precio">
                    ${(Number(item.precio) * item.cantidad).toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="payment-total-row">
                <span className="payment-total-label">Total a Pagar</span>
                <span className="payment-total-valor">${total.toLocaleString()}</span>
              </div>
              <button className="payment-btn-continue" onClick={() => setPaso(1)}>
                Continuar al Pago →
              </button>
            </div>
          )}

          {/* ── PASO 1: Datos de Pago ── */}
          {paso === 1 && (
            <div>
              <div className="payment-title">Método de Pago</div>
              {error && <div className="payment-error">{error}</div>}

              {/* Selector método */}
              <div className="payment-metodos">
                {[['tarjeta','Tarjeta'],['transferencia','Transferencia'],['efectivo','Efectivo']].map(([val, lbl]) => (
                  <button key={val}
                    className={`payment-metodo-btn ${metodo === val ? 'payment-metodo-btn--active' : ''}`}
                    onClick={() => setMetodo(val)}>
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Tarjeta */}
              {metodo === 'tarjeta' && (
                <div>
                  <label className="payment-label">Nombre del Titular</label>
                  <input className="payment-input" type="text"
                    placeholder="Como aparece en la tarjeta"
                    value={titular}
                    onChange={e => setTitular(e.target.value)} />

                  <label className="payment-label">Número de Tarjeta</label>
                  <input className="payment-input" type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={numero}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim();
                      setNumero(v);
                    }} />

                  <label className="payment-label">Vencimiento</label>
                  <input className="payment-input" type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={vencimiento}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'$1/$2');
                      setVencimiento(v);
                    }} />

                  <label className="payment-label">CVV</label>
                  <input className="payment-input" type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={cvv}
                    onChange={e => setCvv(e.target.value)} />
                </div>
              )}

              {/* Transferencia */}
              {metodo === 'transferencia' && (
                <div className="payment-info-box">
                  <div className="payment-info-title">Datos para Transferencia</div>
                  {[['Banco','Banco Unión S.A.'],['Cuenta','1234-567890-00'],['Titular','JazzProStudio SRL'],['Monto',`$${total.toLocaleString()} USD`]].map(([k,v]) => (
                    <div key={k} className="payment-info-item"><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              )}

              {/* Efectivo */}
              {metodo === 'efectivo' && (
                <div className="payment-info-box">
                  <div className="payment-info-title">Pago en Tienda</div>
                  <p style={{ color:'#666', fontSize:'0.75rem', lineHeight:2 }}>
                    Tu pedido se reservará por 48 horas. Presenta tu número de pedido en cualquier sucursal.
                  </p>
                </div>
              )}

              <div className="payment-actions">
                <button className="payment-btn-back" onClick={() => setPaso(0)}>← Volver</button>
                <button className="payment-btn-confirm" onClick={handleConfirmar} disabled={loading}>
                  {loading ? 'Procesando...' : `Confirmar · $${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 2: Confirmación ── */}
          {paso === 2 && (
            <div style={{ textAlign:'center' }}>
              <div className="payment-check-circle">✓</div>
              <h2 className="payment-confirm-titulo">¡Pago Confirmado!</h2>
              <div className="payment-confirm-sub">
                Pedido N° <span style={{ color:'#D4AF37' }}>#{String(pedidoOk?.pedidoId).padStart(6,'0')}</span>
              </div>
              <p className="payment-confirm-desc">
                Recibirás la confirmación en <strong style={{ color:'#ccc' }}>{usuario?.email}</strong>.
              </p>
              <div className="payment-confirm-total">
                Total: <span>${Number(pedidoOk?.total||0).toLocaleString()} USD</span>
              </div>
              <div className="payment-confirm-btns">
                <button className="payment-btn-pdf" onClick={descargar} disabled={pdfLoad}>
                  {pdfLoad ? 'Generando...' : '⬇ Descargar Factura PDF'}
                </button>
                <button className="payment-btn-ver" onClick={() => navigate('/')}>
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
