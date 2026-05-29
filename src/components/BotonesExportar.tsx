/* eslint-disable */
import { useState } from 'react'

export default function BotonesExportar({ onPDF, onPDFCompleto, onImprimir, exportando }: {
  onPDF:          () => void
  onPDFCompleto?: () => void
  onImprimir:     () => void
  exportando:     boolean
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showTip,  setShowTip]  = useState(false)
  const tieneOpciones = !!onPDFCompleto

  return (
    <div style={{ display:'flex', gap:'8px', alignItems:'center', position:'relative' }}>

      {/* Botón PDF */}
      {tieneOpciones ? (
        <div style={{ display:'flex', borderRadius:'8px', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}>
          <button onClick={onPDF} disabled={exportando} style={{
            padding:'6px 14px', border:'none',
            background: exportando ? '#94a3b8' : '#1e293b', color:'white',
            cursor: exportando ? 'not-allowed' : 'pointer', fontSize:'12px', fontWeight:700,
            borderRight:'1px solid rgba(255,255,255,0.2)',
          }}>
            {exportando ? '⏳ Generando...' : '📄 PDF páginas'}
          </button>
          <button onClick={() => setShowMenu(v => !v)} disabled={exportando} style={{
            padding:'6px 8px', border:'none',
            background: exportando ? '#94a3b8' : '#1e293b',
            color:'white', cursor:'pointer', fontSize:'11px'
          }}>▾</button>

          {showMenu && (
            <div style={{
              position:'absolute', top:'calc(100% + 4px)', right:0, background:'white',
              borderRadius:'10px', border:'1px solid #e2e8f0',
              boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:200, minWidth:'200px', overflow:'hidden',
            }}>
              <button onClick={() => { onPDF(); setShowMenu(false) }} style={{
                width:'100%', padding:'10px 16px', border:'none', background:'white',
                cursor:'pointer', fontSize:'12px', textAlign:'left', fontWeight:600, color:'#1e293b',
                display:'flex', alignItems:'center', gap:'8px'
              }}
              onMouseEnter={(e:any) => e.currentTarget.style.background='#f8fafc'}
              onMouseLeave={(e:any) => e.currentTarget.style.background='white'}>
                📄 PDF página a página
                <span style={{ fontSize:'10px', color:'#94a3b8', fontWeight:400 }}>preview rápido</span>
              </button>
              <div style={{ height:'1px', background:'#f1f5f9' }}/>
              <button onClick={() => { onPDFCompleto!(); setShowMenu(false) }} style={{
                width:'100%', padding:'10px 16px', border:'none', background:'white',
                cursor:'pointer', fontSize:'12px', textAlign:'left', color:'#64748b',
                display:'flex', alignItems:'center', gap:'8px'
              }}
              onMouseEnter={(e:any) => e.currentTarget.style.background='#f8fafc'}
              onMouseLeave={(e:any) => e.currentTarget.style.background='white'}>
                🗒️ PDF completo (1 imagen)
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={onPDF} disabled={exportando} style={{
          padding:'6px 16px', borderRadius:'8px', border:'none',
          background: exportando ? '#94a3b8' : '#1e293b', color:'white',
          cursor: exportando ? 'not-allowed' : 'pointer', fontSize:'12px', fontWeight:700,
        }}>
          {exportando ? '⏳ Generando...' : '📄 Exportar PDF'}
        </button>
      )}

      {/* Botón Imprimir con tooltip de calidad */}
      <div style={{ position:'relative' }}>
        <button
          onClick={onImprimir}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          style={{
            padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0',
            background:'white', color:'#1e293b', cursor:'pointer', fontSize:'12px', fontWeight:600,
            display:'flex', alignItems:'center', gap:'6px',
          }}
        >
          🖨️ Imprimir
        </button>

        {/* Tooltip */}
        {showTip && (
          <div style={{
            position:'absolute', top:'calc(100% + 8px)', right:0,
            background:'#1e293b', color:'white', borderRadius:'10px',
            padding:'10px 14px', zIndex:300, width:'240px',
            boxShadow:'0 8px 24px rgba(0,0,0,0.2)', fontSize:'11px', lineHeight:1.6,
          }}>
            <div style={{ fontWeight:700, marginBottom:'6px', fontSize:'12px' }}>⭐ Máxima calidad</div>
            <div style={{ color:'#94a3b8', marginBottom:'6px' }}>Para imprimir en USB o impresora profesional:</div>
            <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'6px', padding:'6px 8px', fontSize:'10px' }}>
              Destino → <strong style={{ color:'#60a5fa' }}>Microsoft Print to PDF</strong><br/>
              Márgenes → <strong style={{ color:'#60a5fa' }}>Ninguno</strong><br/>
              ✅ <strong style={{ color:'#60a5fa' }}>Gráficos de fondo</strong>
            </div>
            <div style={{ marginTop:'6px', color:'#94a3b8', fontSize:'10px' }}>
              Genera PDF vectorial de alta resolución
            </div>
            {/* Flecha arriba */}
            <div style={{
              position:'absolute', top:'-6px', right:'20px',
              width:'12px', height:'12px', background:'#1e293b',
              transform:'rotate(45deg)', borderRadius:'2px',
            }}/>
          </div>
        )}
      </div>

      {/* Cierra menú al hacer clic fuera */}
      {showMenu && <div style={{ position:'fixed', inset:0, zIndex:199 }} onClick={() => setShowMenu(false)}/>}
    </div>
  )
}