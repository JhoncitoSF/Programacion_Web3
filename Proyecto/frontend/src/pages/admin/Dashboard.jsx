import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../../utils/api';
import '../../styles/Admin.css';

const GOLD = '#D4AF37';

export default function Dashboard() {
  const [kpis,    setKpis]    = useState(null);
  const [grafico, setGrafico] = useState([]);
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/ventas-categoria'),
      api.get('/admin/logs'),
    ]).then(([d, v, l]) => {
      if (d.ok) setKpis(d.kpis);
      if (v.ok) setGrafico(v.datos);
      if (l.ok) setLogs(l.logs.slice(0, 10));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="admin-loading">Cargando dashboard...</div>;

  const kpiList = [
    { label: 'Ingresos del Mes',      val: `$${(kpis?.ingresos_mes || 0).toLocaleString()}` },
    { label: 'Pedidos del Mes',       val:  kpis?.pedidos_mes || 0 },
    { label: 'Usuarios Activos',      val:  kpis?.total_usuarios || 0 },
    { label: 'Productos en Vitrina',  val:  kpis?.total_productos || 0 },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <span className="admin-eyebrow">Panel Administrativo</span>
        <h1 className="admin-titulo">Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="admin-kpi-grid">
        {kpiList.map(({ label, val }) => (
          <div key={label} className="admin-kpi">
            <span className="admin-kpi-val">{val}</span>
            <span className="admin-kpi-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="admin-panels">

        {/* Gráfico */}
        <div className="admin-panel">
          <div className="admin-panel-title">
            Ingresos por Categoría
            <span>Recharts</span>
          </div>
          {grafico.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={grafico} margin={{ top: 10, right: 10, bottom: 24, left: 10 }}>
                <XAxis
                  dataKey="categoria"
                  tick={{ fill: '#cccccc', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#cccccc', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ background: '#111', border: '0.5px solid #333', color: '#fff', fontSize: '0.75rem' }}
                  formatter={v => [`$${Number(v).toLocaleString()}`, 'Ingresos']}
                />
                <Bar dataKey="ingresos" radius={[3, 3, 0, 0]}>
                  {grafico.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? GOLD : '#2a2a2a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: '#666', fontSize: '0.75rem', textAlign: 'center', marginTop: '5rem', letterSpacing: '0.1em' }}>
              Sin datos de ventas aún — realiza tus primeras ventas.
            </div>
          )}
        </div>

        {/* Log de accesos */}
        <div className="admin-panel">
          <div className="admin-panel-title">
            Log de Acceso
          </div>
          {logs.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: '0.72rem', letterSpacing: '0.1em' }}>Sin registros</div>
          ) : (
            <table className="admin-log-table">
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="admin-log-tr">
                    <td style={{ padding: '0.7rem 0' }}>
                      <div className="admin-log-nombre">{log.nombre}</div>
                      <span className={log.evento === 'INGRESO' ? 'admin-log-ingreso' : 'admin-log-salida'}>
                        {log.evento}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.7rem 0', verticalAlign: 'top' }}>
                      <div className="admin-log-ip">{log.ip}</div>
                      <div className="admin-log-time">
                        {new Date(log.fecha_hora).toLocaleTimeString('es-BO', {
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </div>
                      <div style={{ fontSize: '0.58rem', color: '#888', marginTop: '2px' }}>
                        {new Date(log.fecha_hora).toLocaleDateString('es-BO', {
                          day: '2-digit', month: 'short'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
