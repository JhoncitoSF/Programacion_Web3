import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import '../../styles/Admin.css';

const EMPTY = { nombre:'', categoria:'', subtipo:'', descripcion:'', precio:'', stock:'', imagen_url:'' };

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [modal,     setModal]     = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState('');

  const cargar = async () => {
    const data = await api.get('/products/admin/todos');
    if (data.ok) setProductos(data.productos);
  };
  useEffect(() => { cargar(); }, []);

  const abrirCrear  = () => { setForm(EMPTY); setEditId(null); setModal(true); setMsg(''); };
  const abrirEditar = (p) => {
    setForm({ nombre:p.nombre, categoria:p.categoria, subtipo:p.subtipo,
              descripcion:p.descripcion, precio:p.precio, stock:p.stock, imagen_url:p.imagen_url||'' });
    setEditId(p.id); setModal(true); setMsg('');
  };

  const guardar = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('');
    const data = editId
      ? await api.put(`/products/${editId}`, form)
      : await api.post('/products', form);
    setLoading(false);
    if (!data.ok) return setMsg(data.mensaje || 'Error al guardar');
    setModal(false); cargar();
  };

  const eliminar   = async (id) => { if (!confirm('¿Desactivar este producto?')) return; await api.delete(`/products/${id}`); cargar(); };
  const reactivar  = async (id) => { await api.patch(`/products/${id}/reactivar`, {}); cargar(); };

  const campos = [
    { label:'Nombre',       key:'nombre',     type:'text'   },
    { label:'Categoría',    key:'categoria',  type:'text'   },
    { label:'Subtipo',      key:'subtipo',    type:'text'   },
    { label:'Precio (USD)', key:'precio',     type:'number' },
    { label:'Stock',        key:'stock',      type:'number' },
    { label:'URL Imagen',   key:'imagen_url', type:'text'   },
  ];

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div>
          <span className="admin-eyebrow">Administración</span>
          <h1 className="admin-titulo">Inventario</h1>
        </div>
        <button className="admin-btn-gold" onClick={abrirCrear}>+ Nuevo Producto</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>{['ID','Nombre','Categoría','Precio','Stock','Estado','Acciones'].map(h => (
            <th key={h} className="admin-th">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} style={{ opacity: p.activo ? 1 : 0.45 }}>
              <td className="admin-td">#{p.id}</td>
              <td className="admin-td admin-td--nombre">{p.nombre}</td>
              <td className="admin-td">{p.categoria}</td>
              <td className="admin-td admin-td--precio">${Number(p.precio).toLocaleString()}</td>
              <td className="admin-td">{p.stock}</td>
              <td className="admin-td">
                <span className={`admin-badge ${p.activo ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                  {p.activo ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </td>
              <td className="admin-td">
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {p.activo ? (
                    <>
                      <button className="admin-btn-small" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="admin-btn-small admin-btn-small--danger" onClick={() => eliminar(p.id)}>Desactivar</button>
                    </>
                  ) : (
                    <button className="admin-btn-small admin-btn-small--reactivar" onClick={() => reactivar(p.id)}>Reactivar</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="admin-overlay" onClick={() => setModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-title">{editId ? 'Editar Producto' : 'Nuevo Producto'}</div>
            {msg && <div className="admin-form-error">{msg}</div>}
            <form onSubmit={guardar}>
              {campos.map(({ label, key, type }) => (
                <div key={key}>
                  <label className="admin-form-label">{label}</label>
                  <input className="admin-form-input" type={type}
                    required={key !== 'imagen_url'}
                    min={type==='number' ? 0 : undefined}
                    step={key==='precio' ? '0.01' : undefined}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <label className="admin-form-label">Descripción</label>
              <textarea className="admin-form-input admin-form-textarea" required
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-gold" disabled={loading}>
                  {loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Crear')}
                </button>
                <button type="button" className="admin-btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
