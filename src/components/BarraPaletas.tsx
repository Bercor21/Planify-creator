/* eslint-disable */
import { PALETAS, Paleta } from '../constants'

export default function BarraPaletas({ paleta, setPaleta }: { paleta: Paleta, setPaleta: (p: Paleta) => void }) {
  return (
    <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'8px 16px', display:'flex', gap:'6px', alignItems:'center', flexWrap:'wrap' }}>
      <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:600, marginRight:'4px' }}>Estilo:</span>
      {PALETAS.map(p => (
        <button key={p.nombre} onClick={() => setPaleta(p)} style={{
          padding:'4px 12px', borderRadius:'20px', border:'none', cursor:'pointer',
          fontSize:'11px', fontWeight:600, transition:'all 0.15s',
          background: paleta.nombre === p.nombre ? p.header : '#f1f5f9',
          color:       paleta.nombre === p.nombre ? 'white'  : '#64748b',
        }}>{p.nombre}</button>
      ))}
    </div>
  )
}