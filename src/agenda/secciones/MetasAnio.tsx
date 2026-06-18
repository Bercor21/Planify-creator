/* eslint-disable */
import { AgendaConfig } from '../types'

function MetasAnio({ config }: { config: AgendaConfig }) {
  const { paleta, fuente, anio } = config

  const categorias = [
    { icon: '🎯', titulo: 'Metas Personales'    },
    { icon: '💼', titulo: 'Metas Profesionales'  },
    { icon: '📚', titulo: 'Metas de Aprendizaje' },
    { icon: '❤️', titulo: 'Metas de Salud'        },
  ]

  return (
    <div data-section="metas" style={{
      width: '100%',
      minHeight: '100vh',
      background: 'white',
      fontFamily: fuente,
      padding: '32px',
      boxSizing: 'border-box',
      pageBreakAfter: 'always',
    }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'28px', borderBottom:`2px solid ${paleta.acento}33`, paddingBottom:'16px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:paleta.acento, letterSpacing:'3px', marginBottom:'6px' }}>
          {anio}
        </div>
        <div style={{ fontSize:'26px', fontWeight:900, color:paleta.header, letterSpacing:'2px' }}>
          MIS METAS DEL AÑO
        </div>
      </div>

      {/* Grid 2x2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
        {categorias.map((cat, i) => (
          <div key={i} style={{ border:`1px solid ${paleta.acento}33`, borderRadius:'12px', padding:'16px', minHeight:'160px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
              <span style={{ fontSize:'18px' }}>{cat.icon}</span>
              <span style={{ fontSize:'11px', fontWeight:800, color:paleta.header, letterSpacing:'1px' }}>
                {cat.titulo.toUpperCase()}
              </span>
            </div>
            {[0,1,2,3].map((j) => (
              <div key={j} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'10px' }}>
                <div style={{ width:'14px', height:'14px', borderRadius:'50%', border:`2px solid ${paleta.acento}66`, flexShrink:0 }}/>
                <div style={{ flex:1, height:'1px', background:`${paleta.texto}15` }}/>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Palabra del año */}
      <div style={{ border:`1px solid ${paleta.acento}33`, borderRadius:'12px', padding:'16px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:paleta.header, letterSpacing:'2px', marginBottom:'10px' }}>
          ✨ MI PALABRA DEL AÑO
        </div>
        <div style={{ height:'36px', borderBottom:`1px solid ${paleta.texto}15`, marginBottom:'16px' }}/>
        <div style={{ fontSize:'11px', fontWeight:700, color:paleta.header, letterSpacing:'2px', marginBottom:'10px' }}>
          💭 LO QUE QUIERO DEJAR ATRÁS
        </div>
        <div style={{ height:'36px', borderBottom:`1px solid ${paleta.texto}15` }}/>
      </div>

      <div style={{ textAlign:'center', marginTop:'20px', fontSize:'10px', color:`${paleta.texto}44` }}>
        Planify Creator · {config.titulo}
      </div>
    </div>
  )
}

export default MetasAnio