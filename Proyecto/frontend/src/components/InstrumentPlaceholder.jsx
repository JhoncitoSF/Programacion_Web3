const GOLD   = '#D4AF37';
const GOLD2  = '#9A7D22';
const DARK   = '#0A0A0A';

// ── Saxofón ─────────────────────────────────────────────────
const SaxSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    {/* Cuerpo principal curvo */}
    <path d="M88 20 C88 20 98 40 96 80 C94 120 88 150 76 170 C68 182 54 188 46 184 C36 178 34 164 40 156 C46 148 58 150 62 158"
      stroke={GOLD} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85"/>
    {/* Campana */}
    <path d="M40 156 C32 162 24 172 26 182 C28 192 44 196 56 190 C68 184 72 172 66 162"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Cuello */}
    <path d="M88 20 C88 20 84 14 80 12 C76 10 72 12 70 18"
      stroke={GOLD} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7"/>
    {/* Llaves decorativas */}
    {[50,70,90,110,130].map((y,i) => (
      <g key={i}>
        <circle cx={92 + (i%2)*4} cy={y} r="5" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.5"/>
        <circle cx={92 + (i%2)*4} cy={y} r="2" fill={GOLD2} opacity="0.4"/>
        <line x1={92+(i%2)*4} y1={y} x2={96+(i%2)*4+6} y2={y} stroke={GOLD2} strokeWidth="1" opacity="0.4"/>
        <rect x={98+(i%2)*4+5} y={y-4} width="8" height="8" rx="1" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.3"/>
      </g>
    ))}
    {/* Subtipo */}
    <text x="80" y="210" textAnchor="middle" fill={GOLD2} fontSize="10"
      fontFamily="Georgia,serif" letterSpacing="3" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Trompeta ─────────────────────────────────────────────────
const TrompetaSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    {/* Tubo principal */}
    <path d="M30 100 L80 100" stroke={GOLD} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85"/>
    {/* Curva 1 */}
    <path d="M80 100 C100 100 100 80 80 80" stroke={GOLD} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Tubo central */}
    <path d="M80 80 L50 80" stroke={GOLD} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Curva 2 */}
    <path d="M50 80 C30 80 30 60 50 60" stroke={GOLD} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.75"/>
    {/* Tubo superior */}
    <path d="M50 60 L100 60" stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75"/>
    {/* Campana */}
    <path d="M100 60 C120 60 130 68 128 80 C126 92 110 100 96 98"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    <ellipse cx="128" cy="80" rx="14" ry="18" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.4"/>
    {/* Boquilla */}
    <rect x="16" y="95" width="18" height="10" rx="5" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.5"/>
    {/* Pistones */}
    {[55,75,95].map((x,i) => (
      <g key={i}>
        <rect x={x-6} y="88" width="12" height="24" rx="3" stroke={GOLD2} strokeWidth="1.5" fill="none" opacity="0.55"/>
        <rect x={x-4} y="84" width="8" height="6" rx="2" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.4"/>
        <line x1={x} y1="112" x2={x} y2="118" stroke={GOLD2} strokeWidth="1.5" opacity="0.4"/>
      </g>
    ))}
    <text x="80" y="210" textAnchor="middle" fill={GOLD2} fontSize="10"
      fontFamily="Georgia,serif" letterSpacing="3" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Trombón ──────────────────────────────────────────────────
const TrombonSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    {/* Tubo largo superior */}
    <line x1="20" y1="70" x2="130" y2="70" stroke={GOLD} strokeWidth="6" strokeLinecap="round" opacity="0.85"/>
    {/* Curva derecha */}
    <path d="M130 70 C145 70 145 90 130 90" stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Tubo largo inferior (vara) */}
    <line x1="20" y1="90" x2="130" y2="90" stroke={GOLD} strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
    {/* Curva izquierda (vara) */}
    <path d="M20 90 C5 90 5 110 20 110" stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75"/>
    {/* Vara deslizante */}
    <line x1="20" y1="110" x2="90" y2="110" stroke={GOLD} strokeWidth="5" strokeLinecap="round" opacity="0.6" strokeDasharray="4 2"/>
    {/* Campana arriba izquierda */}
    <path d="M20 70 C8 70 4 62 8 54 C12 46 26 44 34 50"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    <ellipse cx="6" cy="62" rx="8" ry="12" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.35"/>
    {/* Boquilla derecha */}
    <rect x="126" y="64" width="20" height="12" rx="6" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.5"/>
    {/* Vara decorativa */}
    <rect x="55" y="98" width="16" height="24" rx="3" stroke={GOLD2} strokeWidth="1.5" fill="none" opacity="0.4"/>
    <text x="80" y="210" textAnchor="middle" fill={GOLD2} fontSize="10"
      fontFamily="Georgia,serif" letterSpacing="3" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Clarinete ────────────────────────────────────────────────
const ClarineteSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    {/* Cuerpo principal */}
    <line x1="80" y1="15" x2="80" y2="185" stroke={GOLD} strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
    {/* Campana inferior */}
    <path d="M80 185 C80 185 68 190 66 198 C64 206 72 212 80 212 C88 212 96 206 94 198 C92 190 80 185 80 185Z"
      stroke={GOLD} strokeWidth="3" fill="none" opacity="0.7"/>
    {/* Boquilla superior */}
    <path d="M80 15 C80 15 74 10 72 6 C70 2 76 0 80 2 C84 0 90 2 88 6 C86 10 80 15 80 15Z"
      stroke={GOLD} strokeWidth="2" fill="none" opacity="0.6"/>
    {/* Llaves / orificios */}
    {[40,60,80,100,120,140,155].map((y,i) => (
      <g key={i}>
        <circle cx={80 + (i%2===0 ? -10 : 10)} cy={y} r="4.5" stroke={GOLD2} strokeWidth="1.2" fill="none" opacity="0.55"/>
        <circle cx={80 + (i%2===0 ? -10 : 10)} cy={y} r="1.8" fill={GOLD2} opacity="0.35"/>
        <line x1="80" y1={y} x2={80 + (i%2===0 ? -10 : 10)} y2={y} stroke={GOLD2} strokeWidth="1" opacity="0.3"/>
      </g>
    ))}
    {/* Anillos de unión */}
    {[50,105,160].map((y,i) => (
      <rect key={i} x="74" y={y} width="12" height="5" rx="1" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.4"/>
    ))}
    <text x="80" y="218" textAnchor="middle" fill={GOLD2} fontSize="9"
      fontFamily="Georgia,serif" letterSpacing="2" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Flauta ───────────────────────────────────────────────────
const FlautaSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    {/* Tubo horizontal principal */}
    <line x1="16" y1="100" x2="144" y2="100" stroke={GOLD} strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
    {/* Tapa izquierda */}
    <ellipse cx="16" cy="100" rx="7" ry="7" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.6"/>
    {/* Embocadura */}
    <rect x="30" y="91" width="18" height="18" rx="4" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.7"/>
    <ellipse cx="39" cy="100" rx="5" ry="6" stroke={GOLD2} strokeWidth="1.5" fill="none" opacity="0.5"/>
    {/* Llaves decorativas */}
    {[70,86,102,118,134].map((x,i) => (
      <g key={i}>
        <ellipse cx={x} cy={100+(i%2===0?-14:14)} rx="6" ry="5" stroke={GOLD2} strokeWidth="1.2" fill="none" opacity="0.55"/>
        <ellipse cx={x} cy={100+(i%2===0?-14:14)} rx="2.5" ry="2" fill={GOLD2} opacity="0.35"/>
        <line x1={x} y1="100" x2={x} y2={100+(i%2===0?-14:14)} stroke={GOLD2} strokeWidth="1" opacity="0.35"/>
      </g>
    ))}
    {/* Anillos */}
    {[60,95,130].map((x,i) => (
      <rect key={i} x={x} y="93" width="5" height="14" rx="1" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.35"/>
    ))}
    <text x="80" y="145" textAnchor="middle" fill={GOLD2} fontSize="10"
      fontFamily="Georgia,serif" letterSpacing="3" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Tuba ─────────────────────────────────────────────────────
const TubaSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    {/* Campana grande */}
    <ellipse cx="80" cy="75" rx="52" ry="55" stroke={GOLD} strokeWidth="4" fill="none" opacity="0.7"/>
    <ellipse cx="80" cy="75" rx="38" ry="40" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.4"/>
    {/* Tubo lateral izquierdo */}
    <path d="M28 75 C20 75 16 90 16 105 C16 130 24 148 36 155"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Tubo lateral derecho */}
    <path d="M132 75 C140 75 144 90 144 105 C144 128 136 146 124 154"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Base */}
    <path d="M36 155 C50 164 65 168 80 168 C95 168 110 164 124 154"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Válvulas */}
    {[55,80,105].map((x,i) => (
      <g key={i}>
        <rect x={x-8} y="138" width="16" height="26" rx="4" stroke={GOLD2} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <rect x={x-5} y="134" width="10" height="6" rx="2" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.4"/>
        <line x1={x} y1="164" x2={x} y2="170" stroke={GOLD2} strokeWidth="1.5" opacity="0.4"/>
        <circle cx={x} cy={151} r="3" fill={GOLD2} opacity="0.3"/>
      </g>
    ))}
    {/* Boquilla */}
    <path d="M80 20 C80 20 76 14 74 10" stroke={GOLD} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"/>
    <ellipse cx="72" cy="8" rx="5" ry="4" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.45"/>
    <text x="80" y="210" textAnchor="middle" fill={GOLD2} fontSize="10"
      fontFamily="Georgia,serif" letterSpacing="3" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Fliscorno ────────────────────────────────────────────────
const FliscornoSVG = ({ subtipo }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
    <rect width="160" height="220" fill={DARK}/>
    <path d="M40 110 L85 110" stroke={GOLD} strokeWidth="6" strokeLinecap="round" opacity="0.85"/>
    <path d="M85 110 C105 110 105 90 85 90" stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    <path d="M85 90 L55 90" stroke={GOLD} strokeWidth="5" strokeLinecap="round" opacity="0.8"/>
    <path d="M55 90 C35 90 35 70 55 70" stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75"/>
    <path d="M55 70 L105 70" stroke={GOLD} strokeWidth="5" strokeLinecap="round" opacity="0.75"/>
    <path d="M105 70 C125 70 132 80 128 95 C124 108 108 114 96 112"
      stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8"/>
    <ellipse cx="130" cy="90" rx="16" ry="20" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.35"/>
    <rect x="26" y="105" width="18" height="10" rx="5" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.5"/>
    {[58,76,94].map((x,i) => (
      <g key={i}>
        <rect x={x-6} y="98" width="12" height="22" rx="3" stroke={GOLD2} strokeWidth="1.5" fill="none" opacity="0.55"/>
        <rect x={x-4} y="94" width="8" height="6" rx="2" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.4"/>
      </g>
    ))}
    <text x="80" y="210" textAnchor="middle" fill={GOLD2} fontSize="10"
      fontFamily="Georgia,serif" letterSpacing="3" opacity="0.6">{subtipo?.toUpperCase()}</text>
  </svg>
);

// ── Componente principal exportado ───────────────────────────
const SVG_MAP = {
  'Saxofón':   SaxSVG,
  'Trompeta':  TrompetaSVG,
  'Corneta':   TrompetaSVG,
  'Trombón':   TrombonSVG,
  'Clarinete': ClarineteSVG,
  'Flauta':    FlautaSVG,
  'Tuba':      TubaSVG,
  'Fliscorno': FliscornoSVG,
};

export default function InstrumentPlaceholder({ categoria, subtipo, style = {} }) {
  const Component = SVG_MAP[categoria] || SaxSVG;
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0A',
      ...style,
    }}>
      <Component subtipo={subtipo} />
    </div>
  );
}
