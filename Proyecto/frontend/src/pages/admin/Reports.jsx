import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import '../../styles/Admin.css';

const GOLD_C = [212,175,55];

const generarPDF = async (tipo, productos, pedidos) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const W   = 210;

  // Fondo + encabezado común
  doc.setFillColor(5,5,5); doc.rect(0,0,W,297,'F');
  doc.setDrawColor(...GOLD_C); doc.setLineWidth(0.4);
  doc.line(15,18,W-15,18);
  doc.setFont('helvetica','bold'); doc.setFontSize(20);
  doc.setTextColor(255,255,255); doc.text('Jazz',15,13);
  doc.setTextColor(...GOLD_C);   doc.text('Pro',31,13);
  doc.setTextColor(255,255,255); doc.text('Studio',41,13);
  doc.setFont('helvetica','normal'); doc.setFontSize(7);
  doc.setTextColor(80,80,80);
  const titulo = tipo==='inventario' ? 'REPORTE DE INVENTARIO' : 'REPORTE DE VENTAS';
  doc.text(titulo, W-15, 10, { align:'right' });
  doc.text(new Date().toLocaleDateString('es-BO',{ day:'2-digit', month:'long', year:'numeric' }), W-15, 15, { align:'right' });
  doc.line(15,20,W-15,20);

  let y = 30;

  if (tipo === 'inventario') {
    const activos = productos.filter(p=>p.activo).length;
    const valor   = productos.filter(p=>p.activo).reduce((a,p)=>a+Number(p.precio)*Number(p.stock),0);
    doc.setFontSize(6); doc.setTextColor(...GOLD_C); doc.text('RESUMEN', 15, y); y+=6;
    [['Total activos', activos],['Inactivos', productos.length-activos],['Valor stock', `$${valor.toLocaleString()} USD`]]
      .forEach(([k,v]) => { doc.setFontSize(7); doc.setTextColor(100,100,100); doc.text(k,15,y); doc.setTextColor(200,200,200); doc.text(String(v),90,y); y+=5; });
    y+=6;
    doc.setFillColor(15,15,15); doc.rect(15,y-4,W-30,8,'F');
    doc.setFontSize(5.5); doc.setTextColor(...GOLD_C);
    doc.text('NOMBRE',18,y); doc.text('CATEGORÍA',75,y); doc.text('PRECIO',140,y); doc.text('STOCK',160,y); doc.text('ESTADO',W-18,y,{align:'right'});
    y+=7;
    productos.slice(0,40).forEach((p,i) => {
      if (y>270) return;
      if (i%2===0){ doc.setFillColor(8,8,8); doc.rect(15,y-4,W-30,7,'F'); }
      doc.setFontSize(6.5); doc.setTextColor(p.activo?180:70, p.activo?180:70, p.activo?180:70);
      doc.text((p.nombre||'').slice(0,30),18,y);
      doc.setTextColor(100,100,100); doc.text(p.categoria||'',75,y);
      doc.setTextColor(...GOLD_C); doc.text(`$${Number(p.precio).toLocaleString()}`,140,y);
      doc.setTextColor(180,180,180); doc.text(String(p.stock),160,y);
      p.activo ? (doc.setTextColor(76,175,80), doc.text('ACTIVO',W-18,y,{align:'right'}))
               : (doc.setTextColor(239,83,80), doc.text('INACTIVO',W-18,y,{align:'right'}));
      y+=7;
    });
  } else {
    const pagados   = pedidos.filter(p=>p.estado==='PAGADO');
    const totalVtas = pagados.reduce((a,p)=>a+Number(p.total_pago),0);
    doc.setFontSize(6); doc.setTextColor(...GOLD_C); doc.text('RESUMEN', 15, y); y+=6;
    [['Total pedidos', pedidos.length],['Pagados', pagados.length],['Ingresos', `$${totalVtas.toLocaleString()} USD`]]
      .forEach(([k,v]) => { doc.setFontSize(7); doc.setTextColor(100,100,100); doc.text(k,15,y); doc.setTextColor(200,200,200); doc.text(String(v),90,y); y+=5; });
    y+=6;
    doc.setFillColor(15,15,15); doc.rect(15,y-4,W-30,8,'F');
    doc.setFontSize(5.5); doc.setTextColor(...GOLD_C);
    doc.text('N°',18,y); doc.text('CLIENTE',38,y); doc.text('FECHA',120,y); doc.text('TOTAL',155,y); doc.text('ESTADO',W-18,y,{align:'right'});
    y+=7;
    pedidos.slice(0,35).forEach((p,i) => {
      if (y>270) return;
      if (i%2===0){ doc.setFillColor(8,8,8); doc.rect(15,y-4,W-30,7,'F'); }
      doc.setFontSize(6); doc.setTextColor(160,160,160);
      doc.text(`#${String(p.id).padStart(5,'0')}`,18,y);
      doc.text((p.cliente||'').slice(0,30),38,y);
      doc.setTextColor(80,80,80);
      doc.text(new Date(p.fecha).toLocaleDateString('es-BO'),120,y);
      doc.setTextColor(...GOLD_C); doc.text(`$${Number(p.total_pago).toLocaleString()}`,155,y);
      const ec=p.estado==='PAGADO'?[76,175,80]:p.estado==='CANCELADO'?[239,83,80]:[255,152,0];
      doc.setTextColor(...ec); doc.text(p.estado,W-18,y,{align:'right'});
      y+=7;
    });
  }

  doc.setDrawColor(...GOLD_C); doc.setLineWidth(0.3); doc.line(15,278,W-15,278);
  doc.setFontSize(5.5); doc.setTextColor(60,60,60);
  doc.text('JazzProStudio — Reporte generado automáticamente',W/2,283,{align:'center'});
  doc.save(`JazzProStudio_${tipo==='inventario'?'Inventario':'Ventas'}.pdf`);
};

export default function Reports() {
  const [productos, setProductos] = useState([]);
  const [pedidos,   setPedidos]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [genLoad,   setGenLoad]   = useState('');

  useEffect(() => {
    Promise.all([api.get('/products/admin/todos'), api.get('/orders/admin/todos')]).then(([p,o]) => {
      if (p.ok) setProductos(p.productos);
      if (o.ok) setPedidos(o.pedidos);
      setLoading(false);
    });
  }, []);

  const generar = async (tipo) => {
    setGenLoad(tipo);
    await generarPDF(tipo, productos, pedidos);
    setGenLoad('');
  };

  if (loading) return <div className="admin-loading">Cargando reportes...</div>;

  const pagados   = pedidos.filter(p=>p.estado==='PAGADO');
  const totalVtas = pagados.reduce((a,p)=>a+Number(p.total_pago),0);
  const activos   = productos.filter(p=>p.activo).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <span className="admin-eyebrow">Administración</span>
        <h1 className="admin-titulo">Reportes & Exportación</h1>
      </div>

      <div className="admin-reports-grid">
        <div className="admin-report-card">
          <div className="admin-report-icon"> </div>
          <div className="admin-report-title">Reporte de Inventario</div>
          <p className="admin-report-desc">Estado completo del inventario con precios, stock y estado de activación.</p>
          <div className="admin-report-stats">
            {[['Activos',activos],['Inactivos',productos.length-activos],['Total',productos.length]].map(([l,v]) => (
              <div key={l} className="admin-report-stat">
                <span className="admin-report-stat-num">{v}</span>
                <span className="admin-report-stat-label">{l}</span>
              </div>
            ))}
          </div>
          <button className="admin-btn-gold" onClick={() => generar('inventario')} disabled={genLoad==='inventario'}>
            {genLoad==='inventario' ? 'Generando...' : '⬇ Descargar PDF — Inventario'}
          </button>
        </div>

        <div className="admin-report-card">
          <div className="admin-report-icon"> </div>
          <div className="admin-report-title">Reporte de Ventas</div>
          <p className="admin-report-desc">Historial completo de pedidos con clientes, montos y estados.</p>
          <div className="admin-report-stats">
            {[['Pagados',pagados.length],['Total',pedidos.length],[`$${(totalVtas/1000).toFixed(1)}k`,'Ingresos']].map(([v,l]) => (
              <div key={l} className="admin-report-stat">
                <span className="admin-report-stat-num">{v}</span>
                <span className="admin-report-stat-label">{l}</span>
              </div>
            ))}
          </div>
          <button className="admin-btn-gold" onClick={() => generar('ventas')} disabled={genLoad==='ventas'}>
            {genLoad==='ventas' ? 'Generando...' : '⬇ Descargar PDF — Ventas'}
          </button>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop:'1px' }}>
        <div className="admin-panel-title">Pedidos Recientes</div>
        <table className="admin-table">
          <thead>
            <tr>{['Pedido','Cliente','Email','Fecha','Total','Estado'].map(h=>(
              <th key={h} className="admin-th">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {pedidos.slice(0,10).map(p => (
              <tr key={p.id}>
                <td className="admin-td">#{String(p.id).padStart(5,'0')}</td>
                <td className="admin-td admin-td--nombre">{p.cliente}</td>
                <td className="admin-td">{p.email}</td>
                <td className="admin-td">{new Date(p.fecha).toLocaleDateString('es-BO')}</td>
                <td className="admin-td admin-td--precio">${Number(p.total_pago).toLocaleString()}</td>
                <td className="admin-td">
                  <span className={`admin-badge ${p.estado==='PAGADO'?'admin-badge--active':p.estado==='CANCELADO'?'admin-badge--inactive':''}`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length===0 && <div style={{ color:'#222', textAlign:'center', padding:'2rem', fontSize:'0.72rem', letterSpacing:'0.2em' }}>Sin pedidos registrados aún</div>}
      </div>
    </div>
  );
}
