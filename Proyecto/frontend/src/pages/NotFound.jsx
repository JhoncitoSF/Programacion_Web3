import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ background:'#050505', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'2rem' }}>
      <div style={{ fontFamily:'Georgia,serif', fontSize:'8rem', color:'#0f0f0f', lineHeight:1 }}>404</div>
      <div style={{ width:'40px', height:'0.5px', background:'#D4AF37' }} />
      <div style={{ fontFamily:'Georgia,serif', fontSize:'1.8rem', fontWeight:300, color:'#333' }}>Página no encontrada</div>
      <button onClick={() => navigate('/')}
        style={{ background:'#D4AF37', border:'none', color:'#050505', fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', fontWeight:700, padding:'0.85rem 2.5rem', cursor:'pointer' }}>
        Volver al Inicio
      </button>
    </div>
  );
}
