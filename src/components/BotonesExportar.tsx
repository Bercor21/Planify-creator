/* eslint-disable */
import { useState } from 'react'

export default function BotonesExportar({ onPDF, onPDFCompleto, onImprimir, exportando }: {
  onPDF:          () => void   // PDF página a página
  onPDFCompleto?: () => void   // PDF completo (opcional)
  onImprimir:     () => void
  exportando:     boolean
}) {
  const [showMenu, setShowMenu] = useState(false)
  const tieneOpciones = !!onPDFCompleto

  return (
    <div style={{ display:'flex', gap:'8px', alignItems:'center', position:'relative' }}>
      {/* Botón PDF — split si hay 2 opciones */}
      {tieneOpciones ? (
        <div style={{ display:'flex', borderRadius:'8px', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}>
          {/* Botón principal: PDF páginas */}
          <button onClick={onPDF} disabled={exportando} style={{
            padding:'6px 14px', border:'none',
            background: exportando ? '#94a3b8' : '#1e293b', color:'white',
            cursor: exportando ? 'not-allowed' : 'pointer', fontSize:'12px', fontWeight:700,
            borderRight:'1px solid rgba(255,255,255,0.2)',
          }}>
            {exportando ? '⏳ Generando...' : '📄 PDF páginas'}
          </button>
          {/* Flecha dropdown */}
          <button
            onClick={() => setShowMenu(v => !v)}
            disabled={exportando}
            style={{ padding:'6px 8px', border:'none', background: exportando ? '#94a3b8' : '#1e293b', color:'white', cursor:'pointer', fontSize:'11px' }}
          >▾</button>

          {/* Menú */}
          {showMenu && (
            <div style={{
              position:'absolute', top:'calc(100% + 4px)', right:0, background:'white',
              borderRadius:'8px', border:'1px solid #e2e8f0', boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
              zIndex:200, minWidth:'180px', overflow:'hidden',
            }}>
              <button onClick={() => { onPDF(); setShowMenu(false) }} style={{ width:'100%', padding:'10px 16px', border:'none', background:'white', cursor:'pointer', fontSize:'12px', textAlign:'left', fontWeight:600, color:'#1e293b', display:'flex', alignItems:'center', gap:'8px' }}
                onMouseEnter={(e:any) => e.currentTarget.style.background='#f8fafc'}
                onMouseLeave={(e:any) => e.currentTarget.style.background='white'}>
                📄 PDF página a página
                <span style={{ fontSize:'10px', color:'#94a3b8', fontWeight:400 }}>recomendado</span>
              </button>
              <div style={{ height:'1px', background:'#f1f5f9' }}/>
              <button onClick={() => { onPDFCompleto!(); setShowMenu(false) }} style={{ width:'100%', padding:'10px 16px', border:'none', background:'white', cursor:'pointer', fontSize:'12px', textAlign:'left', color:'#64748b', display:'flex', alignItems:'center', gap:'8px' }}
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
          display:'flex', alignItems:'center', gap:'6px'
        }}>
          {exportando ? '⏳ Generando...' : '📄 Exportar PDF'}
        </button>
      )}

      <button onClick={onImprimir} style={{
        padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0',
        background:'white', color:'#1e293b', cursor:'pointer', fontSize:'12px', fontWeight:600
      }}>🖨️ Imprimir</button>

      {/* Cierra menú al hacer clic fuera */}
      {showMenu && <div style={{ position:'fixed', inset:0, zIndex:199 }} onClick={() => setShowMenu(false)}/>}
    </div>
  )
}