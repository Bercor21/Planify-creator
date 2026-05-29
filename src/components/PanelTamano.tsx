/* eslint-disable */
import { TAMANOS, PAPELES } from '../constants'

export default function PanelTamano({ tamano, setTamano, papel, setPapel, show, setShow }: {
  tamano: string, setTamano: (v: string) => void,
  papel:  string, setPapel:  (v: string) => void,
  show:   boolean, setShow:  (v: boolean) => void
}) {
  const tamActual = TAMANOS.flatMap(c => c.items).find(t => t.id === tamano)
  const papActual = PAPELES.find(p => p.id === papel)

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setShow(!show)} style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px' }}>
        📄 {tamActual?.nombre} — {papActual?.nombre} ▾
      </button>
      {show && (
        <div onClick={(e: any) => e.stopPropagation()} style={{
          position:'absolute', top:'calc(100% + 4px)', left:0, background:'white',
          borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.12)',
          padding:'14px', zIndex:300, width:'300px', maxHeight:'440px', overflowY:'auto'
        }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', marginBottom:'10px', letterSpacing:'1px' }}>TAMAÑO DE PAPEL</div>
          {TAMANOS.map(cat => (
            <div key={cat.cat} style={{ marginBottom:'12px' }}>
              <div style={{ fontSize:'10px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'6px' }}>{cat.cat}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                {cat.items.map(item => (
                  <button key={item.id} onClick={() => { setTamano(item.id); setShow(false) }} style={{
                    padding:'10px', borderRadius:'8px', textAlign:'left', cursor:'pointer', border:'none',
                    background: tamano === item.id ? '#eff6ff' : '#f8fafc',
                    outline:    tamano === item.id ? '2px solid #3b82f6' : 'none'
                  }}>
                    <div style={{ fontSize:'12px', fontWeight:700, color:'#1e293b' }}>{item.nombre}</div>
                    <div style={{ fontSize:'10px', color:'#94a3b8' }}>{item.dim}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop:'8px', paddingTop:'10px', borderTop:'1px solid #f1f5f9' }}>
            <div style={{ fontSize:'10px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px' }}>TIPO DE PAPEL</div>
            {PAPELES.map(p => (
              <button key={p.id} onClick={() => setPapel(p.id)} style={{
                width:'100%', padding:'8px 10px', borderRadius:'8px', textAlign:'left', cursor:'pointer',
                border:'none', marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px',
                background: papel === p.id ? '#eff6ff' : '#f8fafc'
              }}>
                <div style={{ width:'16px', height:'16px', borderRadius:'50%', border:'2px solid #3b82f6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {papel === p.id && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#3b82f6' }}/>}
                </div>
                <div>
                  <div style={{ fontSize:'12px', fontWeight:600, color:'#1e293b' }}>{p.nombre}</div>
                  <div style={{ fontSize:'10px', color:'#94a3b8' }}>{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}