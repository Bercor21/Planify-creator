/* eslint-disable */
import { useState, useRef } from 'react'
import { MESES, DIAS, PALETAS, Paleta } from '../constants'
import { getDias, exportarPDF, exportarCalendarioPDFPaginas, imprimirCalendarioMesAMes, showToast } from '../utils'
import BtnVolver       from '../components/BtnVolver'
import SelectorFuente  from '../components/SelectorFuente'
import BarraPaletas    from '../components/BarraPaletas'
import PanelTamano     from '../components/PanelTamano'
import BotonesExportar from '../components/BotonesExportar'
import Toast           from '../components/Toast'

export default function EditorCalendario({ setVista, guardarDiseno }: {
  setVista:     (v: any) => void
  guardarDiseno:(d: any) => void
}) {
  const [anio,       setAnio]      = useState(new Date().getFullYear())
  const [tipo,       setTipo]      = useState<'pared'|'mesa'>('pared')
  const [tamano,     setTamano]    = useState('carta')
  const [papel,      setPapel]     = useState('bond')
  const [fuente,     setFuente]    = useState('Playfair Display')
  const [paleta,     setPaleta]    = useState<Paleta>(PALETAS[0])
  const [showPanel,  setShowPanel] = useState(false)
  const [titulo,     setTitulo]    = useState('Mi Calendario')
  const [fotos,      setFotos]     = useState<Record<number,string>>({})
  const [exportando, setExp]       = useState(false)
  const [toast,      setToast]     = useState<string|null>(null)
  const [guardado,   setGuardado]  = useState(false)
  // ── Logo (aparece dentro de cada tarjeta de mes) ──────────────────────────
  const [logo,        setLogo]        = useState<string|undefined>()
  const [logoX,       setLogoX]       = useState(80)   // % dentro de la tarjeta
  const [logoY,       setLogoY]       = useState(10)
  const [logoSize,    setLogoSize]    = useState(36)   // px — pequeño para caber en la tarjeta
  const [logoOpacity, setLogoOpacity] = useState(0.85)
  const [showLogo,    setShowLogo]    = useState(false)
  // Refs de cada tarjeta de mes para el drag
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(12).fill(null))

  function subirFoto(mes: number) {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = (ev: any) => setFotos(prev => ({ ...prev, [mes]: ev.target.result }))
      reader.readAsDataURL(file)
    }
    input.click()
  }
  function quitarFoto(mes: number) { setFotos(prev => { const n = { ...prev }; delete n[mes]; return n }) }

  function subirLogo() {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = (ev: any) => { setLogo(ev.target.result); setShowLogo(true) }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  // Drag del logo dentro de una tarjeta — actualiza para TODAS las tarjetas
  function handleCardLogoMouseDown(e: React.MouseEvent, cardEl: HTMLDivElement) {
    e.preventDefault()
    e.stopPropagation()
    const rect = cardEl.getBoundingClientRect()
    function onMove(ev: MouseEvent) {
      setLogoX(Math.min(92, Math.max(0, ((ev.clientX - rect.left)  / rect.width)  * 100)))
      setLogoY(Math.min(92, Math.max(0, ((ev.clientY - rect.top)   / rect.height) * 100)))
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>

      {/* ── TOOLBAR ── */}
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'10px 16px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
        <BtnVolver setVista={setVista} />
        <input value={titulo} onChange={(e:any) => setTitulo(e.target.value)}
          style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', fontWeight:600, width:'160px', outline:'none' }}/>
        <div style={{ width:'1px', height:'24px', background:'#e2e8f0' }}/>

        {(['pared','mesa'] as const).map(t => (
          <button key={t} onClick={() => setTipo(t)} style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background:tipo===t?'#1e293b':'#f1f5f9', color:tipo===t?'white':'#64748b' }}>
            {t==='pared'?'🪟 Pared':'🖥️ Mesa'}
          </button>
        ))}
        <div style={{ width:'1px', height:'24px', background:'#e2e8f0' }}/>

        <SelectorFuente fuente={fuente} setFuente={setFuente} />
        <PanelTamano tamano={tamano} setTamano={setTamano} papel={papel} setPapel={setPapel} show={showPanel} setShow={setShowPanel} />

        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button onClick={() => setAnio(anio-1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>‹</button>
          <span style={{ fontSize:'13px', fontWeight:700, minWidth:'40px', textAlign:'center' }}>{anio}</span>
          <button onClick={() => setAnio(anio+1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>›</button>
        </div>

        {/* ── Panel Logo ── */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowLogo(v => !v)} style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', background:logo?'#eff6ff':'white', cursor:'pointer', fontSize:'12px', fontWeight:600, color:logo?'#3b82f6':'#64748b' }}>
            🏷️ Logo{logo?' ✓':''}
          </button>
          {showLogo && (
            <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:'calc(100% + 4px)', left:0, background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:'14px', zIndex:300, width:'230px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'10px' }}>LOGO EN CADA MES</div>
              <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                <button onClick={subirLogo} style={{ flex:1, padding:'7px', borderRadius:'7px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'11px', fontWeight:600, color:'#64748b' }}>📷 Subir logo</button>
                {logo && <button onClick={() => setLogo(undefined)} style={{ padding:'7px 10px', borderRadius:'7px', border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:'11px', color:'#dc2626' }}>✕</button>}
              </div>
              {logo && (
                <>
                  <div style={{ textAlign:'center', marginBottom:'10px' }}>
                    <div style={{ width:'50px', height:'50px', borderRadius:'50%', background:`url('${logo}') center/cover`, margin:'0 auto', border:'2px solid #e2e8f0', opacity:logoOpacity }}/>
                  </div>
                  {[
                    { label:'Tamaño',   value:logoSize,                    set:setLogoSize,                       min:20, max:80,  unit:'px' },
                    { label:'Opacidad', value:Math.round(logoOpacity*100), set:(v:number)=>setLogoOpacity(v/100), min:10, max:100, unit:'%'  },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom:'8px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', fontWeight:700, color:'#64748b', marginBottom:'3px' }}>
                        <span>{item.label}</span><span>{item.value}{item.unit}</span>
                      </div>
                      <input type="range" min={item.min} max={item.max} value={item.value}
                        onChange={(e:any) => item.set(parseInt(e.target.value))}
                        style={{ width:'100%', accentColor:paleta.acento }}/>
                    </div>
                  ))}
                  <div style={{ fontSize:'10px', color:'#94a3b8', textAlign:'center', marginTop:'4px', lineHeight:1.4 }}>
                    💡 Arrastrá el logo en cualquier mes — se actualiza en todos
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
          <button onClick={() => { guardarDiseno({tipo:'calendario',titulo,paleta,fuente,tamano,anio}); setGuardado(true); showToast(setToast,'💾 Calendario guardado') }}
            style={{ padding:'6px 14px', borderRadius:'8px', border:'none', background:guardado?'#f0fdf4':'#f1f5f9', color:guardado?'#16a34a':'#64748b', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>
            {guardado ? '✅ Guardado' : '💾 Guardar'}
          </button>
          <BotonesExportar
            onPDF={() => exportarCalendarioPDFPaginas(anio, titulo, paleta, fuente, tipo, fotos, MESES, DIAS, tamano, setExp, setToast)}
            onPDFCompleto={() => exportarPDF('calendario-preview', `${titulo}-${anio}.pdf`, tamano, setExp, setToast)}
            onImprimir={() => imprimirCalendarioMesAMes(anio, titulo, paleta, fuente, tipo, fotos, MESES, DIAS, tamano)}
            exportando={exportando}
          />
        </div>
      </div>

      <BarraPaletas paleta={paleta} setPaleta={setPaleta} />

      {/* ── PREVIEW ── */}
      <div
        id="calendario-preview"
        style={{ flex:1, overflow:'auto', padding:'20px', background:paleta.fondo }}
        onClick={() => { setShowPanel(false); setShowLogo(false) }}
      >
        <div style={{ textAlign:'center', marginBottom:'16px', fontFamily:fuente }}>
          <div style={{ fontSize:'26px', fontWeight:800, color:paleta.header, letterSpacing:'2px' }}>{titulo.toUpperCase()}</div>
          <div style={{ fontSize:'14px', color:paleta.acento, fontWeight:600, marginTop:'2px' }}>{anio}</div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns: tipo==='pared' ? 'repeat(4,1fr)' : 'repeat(6,1fr)',
          gap:'10px',
          maxWidth: tipo==='pared' ? '900px' : '1100px',
          margin:'0 auto'
        }}>
          {MESES.map((mes, idx) => (
            <div
              key={idx}
              ref={el => { cardRefs.current[idx] = el }}
              style={{
                background: paleta.fondo==='#0f172a' ? '#1e293b' : 'white',
                borderRadius:'10px', overflow:'hidden',
                boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
                border:`1px solid ${paleta.acento}22`,
                fontFamily:fuente,
                position:'relative',   // necesario para el logo absoluto
              }}
            >
              {/* Logo dentro de la tarjeta — aparece en TODOS los meses */}
              {logo && (
                <div
                  onMouseDown={e => cardRefs.current[idx] && handleCardLogoMouseDown(e, cardRefs.current[idx]!)}
                  style={{
                    position:'absolute',
                    left:`${logoX}%`, top:`${logoY}%`,
                    width:`${logoSize}px`, height:`${logoSize}px`,
                    borderRadius:'50%',
                    backgroundImage:`url('${logo}')`,
                    backgroundSize:'cover', backgroundPosition:'center',
                    opacity: logoOpacity,
                    transform:'translate(-50%,-50%)',
                    zIndex:8,
                    cursor:'grab',
                    boxShadow:'0 2px 8px rgba(0,0,0,0.25)',
                    border:'1.5px solid rgba(255,255,255,0.7)',
                  }}
                />
              )}

              {tipo === 'pared' && (
                <div
                  style={{ height:'80px', position:'relative', cursor:'pointer', background:fotos[idx]?`url(${fotos[idx]}) center/cover`:`linear-gradient(135deg, ${paleta.header}dd, ${paleta.acento}99)` }}
                  onClick={e => { e.stopPropagation(); subirFoto(idx) }}
                >
                  <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                    onMouseEnter={(e:any)=>e.currentTarget.style.background='rgba(0,0,0,0.3)'}
                    onMouseLeave={(e:any)=>e.currentTarget.style.background='rgba(0,0,0,0)'}>
                    {!fotos[idx] && <span style={{ fontSize:'18px', opacity:0.5 }}>🖼️</span>}
                  </div>
                  <div style={{ position:'absolute', top:'5px', left:'7px', fontSize:'10px', fontWeight:700, color:'white', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>{mes}</div>
                  {fotos[idx]
                    ? <button onClick={(e:any)=>{e.stopPropagation();quitarFoto(idx)}} style={{ position:'absolute', top:'4px', right:'4px', width:'18px', height:'18px', borderRadius:'50%', border:'none', background:'rgba(0,0,0,0.5)', color:'white', cursor:'pointer', fontSize:'10px' }}>✕</button>
                    : <div style={{ position:'absolute', bottom:'3px', right:'5px', fontSize:'8px', color:'rgba(255,255,255,0.8)', background:'rgba(0,0,0,0.3)', padding:'1px 5px', borderRadius:'4px' }}>+ Foto</div>
                  }
                </div>
              )}

              <div style={{ padding:'6px' }}>
                {tipo === 'mesa' && (
                  <div style={{ fontSize:'9px', fontWeight:800, color:paleta.header, textAlign:'center', marginBottom:'4px', letterSpacing:'1px' }}>{mes.toUpperCase()}</div>
                )}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'2px' }}>
                  {DIAS.map(d => <div key={d} style={{ textAlign:'center', fontSize:'7px', fontWeight:700, color:paleta.acento, padding:'1px 0' }}>{d}</div>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px' }}>
                  {getDias(anio, idx).map((dia, i) => {
                    const isHoy = dia===new Date().getDate() && idx===new Date().getMonth() && anio===new Date().getFullYear()
                    const esDom = i%7===6
                    return (
                      <div key={i} style={{
                        textAlign:'center', fontSize:'7px',
                        color:!dia?'transparent':isHoy?'white':esDom?paleta.acento:paleta.texto,
                        background:isHoy?paleta.acento:'transparent',
                        borderRadius:'50%', width:'13px', height:'13px',
                        margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight:isHoy?700:esDom?600:400
                      }}>
                        {dia}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toast msg={toast} />
    </div>
  )
}