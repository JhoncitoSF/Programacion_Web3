export const generarFacturaPDF = async (pedido) => {
  // Importación dinámica de jsPDF (se carga solo cuando se necesita)
  const { jsPDF } = await import('jspdf');

  const doc  = new jsPDF({ unit:'mm', format:'a4' });
  const W    = 210;
  const GOLD = [212, 175, 55];
  const DARK = [5, 5, 5];
  const GRAY = [80, 80, 80];

  // ── Fondo negro ──
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 297, 'F');

  // ── Línea dorada superior ──
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(15, 18, W - 15, 18);

  // ── Logo / Nombre ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('Jazz', 15, 13);
  doc.setTextColor(...GOLD);
  doc.text('Pro', 33, 13);
  doc.setTextColor(255, 255, 255);
  doc.text('Studio', 44, 13);

  //Título FACTURA
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text('FACTURA DE COMPRA', W - 15, 10, { align: 'right' });
  doc.setFontSize(7);
  doc.text(`N° ${String(pedido.pedidoId || '0001').padStart(6, '0')}`, W - 15, 15, { align: 'right' });

  // Línea dorada inferior encabezado ──
  doc.line(15, 20, W - 15, 20);

  // Datos del cliente
  let y = 30;
  doc.setFontSize(6);
  doc.setTextColor(...GOLD);
  doc.text('CLIENTE', 15, y);
  y += 5;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text(pedido.cliente?.nombre || 'Cliente', 15, y);
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(pedido.cliente?.email || '', 15, y);

  //Fecha
  doc.setFontSize(6);
  doc.setTextColor(...GOLD);
  doc.text('FECHA', W - 60, 30);
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(new Date(pedido.fecha || Date.now()).toLocaleDateString('es-BO', {
    day:'2-digit', month:'long', year:'numeric'
  }), W - 60, 35);

  //Separador
  y = 52;
  doc.setDrawColor(30, 30, 30);
  doc.line(15, y, W - 15, y);

  //Encabezado de tabla
  y += 6;
  doc.setFillColor(15, 15, 15);
  doc.rect(15, y - 4, W - 30, 8, 'F');
  doc.setFontSize(6);
  doc.setTextColor(...GOLD);
  doc.text('PRODUCTO',            18, y);
  doc.text('CATEGORÍA',          90, y);
  doc.text('CANT.',             135, y);
  doc.text('P. UNIT.',          152, y);
  doc.text('SUBTOTAL',     W - 18, y, { align:'right' });

  //Filas de items
  y += 8;
  doc.setFont('helvetica', 'normal');
  (pedido.items || []).forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(8, 8, 8);
      doc.rect(15, y - 4, W - 30, 8, 'F');
    }
    doc.setFontSize(7.5);
    doc.setTextColor(200, 200, 200);
    const nombre = item.nombre?.length > 32 ? item.nombre.slice(0, 30) + '…' : (item.nombre || '');
    doc.text(nombre,                       18, y);
    doc.setTextColor(...GRAY);
    doc.setFontSize(6.5);
    doc.text(item.categoria || '',         90, y);
    doc.text(String(item.cantidad || 1),  137, y);
    doc.text(`$${Number(item.precio || 0).toLocaleString()}`, 152, y);
    doc.setTextColor(...GOLD);
    doc.text(`$${(Number(item.precio||0) * (item.cantidad||1)).toLocaleString()}`, W - 18, y, { align:'right' });
    y += 9;
  });

  //Total
  y += 4;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(120, y, W - 15, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text('SUBTOTAL', 120, y);
  doc.setTextColor(200, 200, 200);
  doc.text(`$${Number(pedido.total || 0).toLocaleString()}`, W - 18, y, { align:'right' });
  y += 6;
  doc.setTextColor(...GRAY);
  doc.text('IVA (incluido)', 120, y);
  doc.setTextColor(200, 200, 200);
  doc.text('Incluido', W - 18, y, { align:'right' });
  y += 8;
  doc.setFillColor(15, 15, 15);
  doc.rect(115, y - 5, W - 128, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GOLD);
  doc.text('TOTAL', 120, y + 1);
  doc.setFontSize(11);
  doc.text(`$${Number(pedido.total || 0).toLocaleString()} USD`, W - 18, y + 1, { align:'right' });

  //Pie de página
  doc.setLineWidth(0.3);
  doc.setDrawColor(...GOLD);
  doc.line(15, 275, W - 15, 275);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...GRAY);
  doc.text('JazzProStudio — Instrumentos Musicales de Jazz Premium', W / 2, 280, { align:'center' });
  doc.text('Gracias por su compra · contacto@jazzprostudio.com', W / 2, 284, { align:'center' });
  doc.setTextColor(40, 40, 40);
  doc.text('Este documento es una factura electrónica válida.', W / 2, 288, { align:'center' });

  doc.save(`JazzProStudio_Factura_${pedido.pedidoId || 'XXXX'}.pdf`);
};
