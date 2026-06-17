/* eslint-disable */
import { useState, useRef } from 'react'
import { MESES, DIAS, PALETAS, TAMANOS_AGENDA, Paleta } from '../constants'
import { getDias, exportarPDF, imprimirElemento, showToast } from '../utils'
import BtnVolver       from '../components/BtnVolver'
import SelectorFuente  from '../components/SelectorFuente'
import BarraPaletas    from '../components/BarraPaletas'
import BotonesExportar from '../components/BotonesExportar'
import Toast           from '../components/Toast'

export default function EditorPlanificador({ setVista, guardarDiseno }: {
  setVista:       (v: any) => void
  guardarDiseno:  (d: any) => void
  disenoInicial?: any
}) {
  const [vistaP,    setVistaP]    = useState<'semanal'|'mensual'|'diario'>('semanal')
  const [paleta,    setPaleta]    = useState<Paleta>(PALETAS[0])
  const [fuente,    setFuente]    = useState('Montserrat')
  const [tamano,    setTamano]    = useState('a5')  // A5 es el más común para planificadores
  const tamActual = (TAMANOS_AGENDA as any[]).flatMap((c:any)=>c.items).find((t:any)=>t.id===tamano)
  const [papel,     setPapel]     = useState('bond')
  const [titulo,    setTitulo]    = useState('Mi Planificador')
  const [anio,      setAnio]      = useState(new Date().getFullYear())
  const [mes,       setMes]       = useState(new Date().getMonth())
  const [fecha,     setFecha]     = useState(() => new Date().toISOString().split('T')[0])
  const [showPanel, setShowPanel] = useState(false)
  const [exportando,setExp]       = useState(false)
  const [toast,     setToast]     = useState<string|null>(null)
  const [guardado,  setGuardado]  = useState(false)
  // ── Logo ──────────────────────────────────────────────────────────────────
  const [logo,        setLogo]        = useState<string|undefined>()
  const [logoX,       setLogoX]       = useState(85)
  const [logoY,       setLogoY]       = useState(4)
  const [logoSize,    setLogoSize]    = useState(70)
  const [logoOpacity, setLogoOpacity] = useState(1)
  const [showLogo,    setShowLogo]    = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const semana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
  const horas  = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']

  const fechaObj   = new Date(fecha + 'T12:00:00')
  const fechaLabel = fechaObj.toLocaleDateString('es-CR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

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

  function handleLogoMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    const container = previewRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
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
          style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', fontWeight:600, width:'180px', outline:'none' }}/>
        <div style={{ width:'1px', height:'24px', background:'#e2e8f0' }}/>

        {(['semanal','mensual','diario'] as const).map(v => (
          <button key={v} onClick={() => setVistaP(v)} style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background:vistaP===v?'#1e293b':'#f1f5f9', color:vistaP===v?'white':'#64748b' }}>
            {v==='semanal'?'📅 Semanal':v==='mensual'?'📆 Mensual':'📋 Diario'}
          </button>
        ))}
        <div style={{ width:'1px', height:'24px', background:'#e2e8f0' }}/>

        <SelectorFuente fuente={fuente} setFuente={setFuente} />
        {/* Selector de tamaño con TAMANOS_AGENDA */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowPanel(!showPanel)} style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px' }}>
            📄 {tamActual?.nombre ?? tamano} ▾
          </button>
          {showPanel && (
            <div onClick={(e:any)=>e.stopPropagation()} style={{ position:'absolute', top:'calc(100% + 4px)', left:0, background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.12)', padding:'14px', zIndex:300, width:'280px', maxHeight:'400px', overflowY:'auto' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', marginBottom:'10px', letterSpacing:'1px' }}>TAMAÑO DE PAPEL</div>
              {TAMANOS_AGENDA.map(cat => (
                <div key={cat.cat} style={{ marginBottom:'12px' }}>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'6px' }}>{cat.cat}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                    {cat.items.map(item => (
                      <button key={item.id} onClick={() => { setTamano(item.id); setShowPanel(false) }} style={{ padding:'8px', borderRadius:'8px', textAlign:'left', cursor:'pointer', border:'none', background: tamano===item.id ? '#eff6ff' : '#f8fafc', outline: tamano===item.id ? '2px solid #3b82f6' : 'none' }}>
                        <div style={{ fontSize:'11px', fontWeight:700, color:'#1e293b' }}>{item.nombre}</div>
                        <div style={{ fontSize:'10px', color:'#94a3b8' }}>{item.dim}</div>
                        {item.horiz && <div style={{ fontSize:'9px', color:'#3b82f6', fontWeight:600 }}>↔ Horizontal</div>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Año siempre visible */}
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button onClick={() => setAnio(anio-1)} style={{ width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>‹</button>
          <span style={{ fontSize:'12px', fontWeight:700, minWidth:'40px', textAlign:'center' }}>{anio}</span>
          <button onClick={() => setAnio(anio+1)} style={{ width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>›</button>
        </div>

        {/* Mes en vistas semanal/mensual */}
        {(vistaP === 'mensual' || vistaP === 'semanal') && (
          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <button onClick={() => { if(mes===0){setMes(11);setAnio(anio-1)}else setMes(mes-1) }} style={{ width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>‹</button>
            <span style={{ fontSize:'12px', fontWeight:600, minWidth:'76px', textAlign:'center' }}>{MESES[mes]}</span>
            <button onClick={() => { if(mes===11){setMes(0);setAnio(anio+1)}else setMes(mes+1) }} style={{ width:'26px', height:'26px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>›</button>
          </div>
        )}

        {/* Fecha en vista diaria */}
        {vistaP === 'diario' && (
          <input type="date" value={fecha} onChange={(e:any) => setFecha(e.target.value)}
            style={{ padding:'5px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none', cursor:'pointer', fontFamily:'inherit' }}/>
        )}

        {/* ── Panel Logo ── */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowLogo(v => !v)} style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', background:logo?'#eff6ff':'white', cursor:'pointer', fontSize:'12px', fontWeight:600, color:logo?'#3b82f6':'#64748b' }}>
            🏷️ Logo{logo?' ✓':''}
          </button>
          {showLogo && (
            <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:'calc(100% + 4px)', left:0, background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:'14px', zIndex:300, width:'230px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'10px' }}>LOGO / MARCA</div>
              <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                <button onClick={subirLogo} style={{ flex:1, padding:'7px', borderRadius:'7px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'11px', fontWeight:600, color:'#64748b' }}>📷 Subir logo</button>
                {logo && <button onClick={() => setLogo(undefined)} style={{ padding:'7px 10px', borderRadius:'7px', border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:'11px', color:'#dc2626' }}>✕</button>}
              </div>
              {logo && (
                <>
                  <div style={{ textAlign:'center', marginBottom:'10px' }}>
                    <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:`url('${logo}') center/cover`, margin:'0 auto', border:'2px solid #e2e8f0', opacity:logoOpacity }}/>
                  </div>
                  {[
                    { label:'Tamaño',   value:logoSize,                    set:setLogoSize,                        min:30, max:160, unit:'px' },
                    { label:'Opacidad', value:Math.round(logoOpacity*100), set:(v:number)=>setLogoOpacity(v/100),  min:10, max:100, unit:'%'  },
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
                  <div style={{ fontSize:'10px', color:'#94a3b8', textAlign:'center', marginTop:'4px' }}>
                    💡 Arrastrá el logo en el preview
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
          <button onClick={() => { guardarDiseno({tipo:'planificador',titulo,paleta,fuente,tamano,anio}); setGuardado(true); showToast(setToast,'💾 Planificador guardado') }}
            style={{ padding:'6px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background:guardado?'#f0fdf4':'#f1f5f9', color:guardado?'#16a34a':'#64748b' }}>
            {guardado ? '✅ Guardado' : '💾 Guardar'}
          </button>
          <BotonesExportar
            onPDF={() => exportarPDF('planificador-preview', `${titulo}-${anio}.pdf`, tamano, setExp, setToast)}
            onPDFCompleto={() => exportarPDF('planificador-preview', `${titulo}-${anio}.pdf`, tamano, setExp, setToast)}
            onImprimir={() => imprimirElemento('planificador-preview', tamano)}
            exportando={exportando}
          />
        </div>
      </div>

      <BarraPaletas paleta={paleta} setPaleta={setPaleta} />

      {/* ── PREVIEW ── */}
      <div style={{ flex:1, overflow:'auto', padding:'20px', background:paleta.fondo }} onClick={() => { setShowPanel(false); setShowLogo(false) }}>
        <div
          ref={previewRef}
          id="planificador-preview"
          style={{ maxWidth:vistaP==='semanal'?'960px':'700px', margin:'0 auto', background:paleta.fondo, fontFamily:fuente, borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', position:'relative' }}
        >
          {/* Logo draggable sobre el planificador */}
          {logo && (
            <div
              onMouseDown={handleLogoMouseDown}
              style={{
                position:'absolute',
                left:`${logoX}%`, top:`${logoY}%`,
                width:`${logoSize}px`, height:`${logoSize}px`,
                borderRadius:'50%',
                backgroundImage:`url('${logo}')`, backgroundSize:'cover', backgroundPosition:'center',
                opacity: logoOpacity,
                transform:'translate(-50%,-50%)',
                zIndex:20, cursor:'grab',
                boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
                border:'2px solid rgba(255,255,255,0.7)',
              }}
            />
          )}

          {/* Header */}
          <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, color:'white', letterSpacing:'2px' }}>{titulo.toUpperCase()}</div>
              <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.75)', marginTop:'2px' }}>
                {vistaP==='diario' ? fechaLabel : `${MESES[mes]} ${anio}`}
              </div>
            </div>
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)' }}>
              {vistaP==='semanal'?'📅 Vista Semanal':vistaP==='mensual'?'📆 Vista Mensual':'📋 Vista Diaria'}
            </div>
          </div>

          <div style={{ padding:'16px' }}>

            {/* ── SEMANAL ── */}
            {vistaP === 'semanal' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', gap:'4px', marginBottom:'4px' }}>
                  <div/>
                  {semana.map(d => <div key={d} style={{ textAlign:'center', padding:'8px 4px', background:`${paleta.header}12`, borderRadius:'8px', fontSize:'10px', fontWeight:700, color:paleta.header }}>{d.slice(0,3).toUpperCase()}</div>)}
                </div>
                {horas.slice(0,13).map(hora => (
                  <div key={hora} style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', gap:'4px', marginBottom:'2px' }}>
                    <div style={{ fontSize:'9px', color:paleta.acento, fontWeight:600, textAlign:'right', paddingRight:'8px', paddingTop:'6px' }}>{hora}</div>
                    {semana.map(d => <div key={d} style={{ height:'28px', border:`1px solid ${paleta.texto}10`, borderRadius:'6px' }}/>)}
                  </div>
                ))}
                <div style={{ marginTop:'16px', borderTop:`2px solid ${paleta.acento}22`, paddingTop:'12px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                    {['Tareas pendientes','Metas de la semana','Prioridades','Recordatorios'].map(s => (
                      <div key={s} style={{ padding:'10px', background:`${paleta.header}08`, borderRadius:'8px', border:`1px solid ${paleta.acento}15` }}>
                        <div style={{ fontSize:'9px', fontWeight:700, color:paleta.header, marginBottom:'8px', textTransform:'uppercase' }}>{s}</div>
                        {[...Array(3)].map((_,i) => <div key={i} style={{ height:'16px', borderBottom:`1px solid ${paleta.texto}10`, marginBottom:'6px' }}/>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MENSUAL ── */}
            {vistaP === 'mensual' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', marginBottom:'4px' }}>
                  {DIAS.map(d => <div key={d} style={{ textAlign:'center', padding:'8px', fontSize:'10px', fontWeight:700, color:paleta.acento }}>{d}</div>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
                  {getDias(anio,mes).map((dia,i) => {
                    const isHoy = dia===new Date().getDate()&&mes===new Date().getMonth()&&anio===new Date().getFullYear()
                    return (
                      <div key={i} style={{ minHeight:'70px', padding:'6px', background:!dia?'transparent':isHoy?`${paleta.acento}18`:`${paleta.header}06`, borderRadius:'8px', border:isHoy?`1px solid ${paleta.acento}66`:'1px solid transparent', opacity:!dia?0:1 }}>
                        {dia && <>
                          <div style={{ fontSize:'11px', fontWeight:700, color:isHoy?paleta.acento:paleta.texto, marginBottom:'4px' }}>{dia}</div>
                          {[...Array(2)].map((_,j) => <div key={j} style={{ height:'10px', borderRadius:'3px', background:`${paleta.texto}08`, marginBottom:'3px' }}/>)}
                        </>}
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop:'16px', borderTop:`2px solid ${paleta.acento}22`, paddingTop:'12px' }}>
                  {[...Array(4)].map((_,i) => (
                    <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
                      <div style={{ width:'16px', height:'16px', borderRadius:'4px', border:`1.5px solid ${paleta.acento}66`, flexShrink:0 }}/>
                      <div style={{ flex:1, height:'16px', borderBottom:`1px solid ${paleta.texto}12` }}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DIARIO ── */}
            {vistaP === 'diario' && (
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', padding:'0 4px' }}>
                  <div>
                    <div style={{ fontSize:'11px', fontWeight:700, color:paleta.acento, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'2px' }}>
                      {fechaObj.toLocaleDateString('es-CR',{weekday:'long'})}
                    </div>
                    <div style={{ fontSize:'22px', fontWeight:800, color:paleta.header }}>
                      {fechaObj.getDate()} de {MESES[fechaObj.getMonth()]} {fechaObj.getFullYear()}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'4px' }}>
                    {['☀️','⛅','🌧️','❄️'].map(e => <div key={e} style={{ width:'28px', height:'28px', borderRadius:'50%', background:`${paleta.header}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', cursor:'pointer' }}>{e}</div>)}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 200px', gap:'16px' }}>
                  <div>
                    {horas.map(hora => (
                      <div key={hora} style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'4px' }}>
                        <div style={{ fontSize:'9px', color:paleta.acento, fontWeight:600, minWidth:'36px', paddingTop:'6px' }}>{hora}</div>
                        <div style={{ flex:1, height:'28px', border:`1px solid ${paleta.texto}12`, borderRadius:'6px', background:`${paleta.header}04` }}/>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {['🎯 Prioridades','📝 Tareas','💡 Ideas','✨ Reflexión'].map((s,i) => (
                      <div key={i} style={{ padding:'10px', background:`${paleta.header}08`, borderRadius:'10px', border:`1px solid ${paleta.acento}15` }}>
                        <div style={{ fontSize:'10px', fontWeight:700, color:paleta.header, marginBottom:'8px' }}>{s}</div>
                        {[...Array(3)].map((_,j) => (
                          <div key={j} style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'6px' }}>
                            {i < 2 && <div style={{ width:'12px', height:'12px', borderRadius:'3px', border:`1.5px solid ${paleta.acento}88`, flexShrink:0 }}/>}
                            <div style={{ flex:1, height:'12px', borderBottom:`1px solid ${paleta.texto}10` }}/>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Toast msg={toast} />
    </div>
  )
}