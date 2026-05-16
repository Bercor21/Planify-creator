/* eslint-disable */
import { useState } from 'react'

type Vista = 'home' | 'calendario' | 'agenda' | 'planificador'

export default function App() {
  const [vista, setVista] = useState<Vista>('home')
  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      {vista === 'home'         && <Home setVista={setVista} />}
      {vista === 'calendario'   && <EditorCalendario setVista={setVista} />}
      {vista === 'agenda'       && <WizardAgenda setVista={setVista} />}
      {vista === 'planificador' && <EditorPlanificador setVista={setVista} />}
    </div>
  )
}

// ═══════════════════════════════════════════
// PANTALLA INICIO
// ═══════════════════════════════════════════
function Home({ setVista }: { setVista: any }) {
  const [tab, setTab] = useState<'calendarios'|'agendas'>('calendarios')

  const productos = [
    { id:'calendario',   icon:'🗓️', nombre:'Nuevo Calendario',  desc:'Pared, mesa o escritorio',      color:'#3b82f6', bg:'#eff6ff', vista:'calendario'   },
    { id:'agenda',       icon:'📓', nombre:'Nueva Agenda',       desc:'Personal, ejecutiva, cuaderno', color:'#10b981', bg:'#f0fdf4', vista:'agenda'        },
    { id:'planificador', icon:'📋', nombre:'Nuevo Planificador', desc:'Semanal, mensual o diario',     color:'#8b5cf6', bg:'#faf5ff', vista:'planificador'  },
  ]

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding:'20px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>🖨️</div>
          <div>
            <div style={{ fontSize:'20px', fontWeight:800, color:'white' }}>Planify Creator</div>
            <div style={{ fontSize:'11px', color:'#94a3b8' }}>Crea · Personaliza · Imprime</div>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'12px', color:'#94a3b8' }}>{new Date().toLocaleDateString('es-CR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
          <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>v1.0.0</div>
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'28px 32px' }}>
        <div style={{ marginBottom:'28px' }}>
          <h2 style={{ fontSize:'22px', fontWeight:800, color:'#1e293b', marginBottom:'4px' }}>¿Qué quieres crear hoy? 👋</h2>
          <p style={{ fontSize:'13px', color:'#94a3b8' }}>Diseña, personaliza e imprime calendarios, agendas y planificadores profesionales</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' }}>
          {productos.map(p => (
            <button key={p.id} onClick={() => setVista(p.vista as Vista)}
              style={{ padding:'24px', borderRadius:'16px', border:`1px solid ${p.color}33`, background:'white', cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:'12px', boxShadow:`0 1px 3px ${p.color}11`, transition:'all 0.2s', position:'relative', overflow:'hidden' }}
              onMouseEnter={(e:any) => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 12px 30px ${p.color}33`; e.currentTarget.style.borderColor=p.color }}
              onMouseLeave={(e:any) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 1px 3px ${p.color}11`; e.currentTarget.style.borderColor=`${p.color}33` }}>
              <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:p.bg, opacity:0.8 }}/>
              <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px' }}>{p.icon}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:'16px', color:'#1e293b', marginBottom:'4px' }}>{p.nombre}</div>
                <div style={{ fontSize:'12px', color:'#94a3b8', lineHeight:'1.5' }}>{p.desc}</div>
              </div>
              <div style={{ fontSize:'12px', fontWeight:700, color:p.color }}>+ Crear nuevo →</div>
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'28px' }}>
          {[
            { label:'Diseños guardados', value:'0', icon:'📁', color:'#3b82f6', bg:'#eff6ff' },
            { label:'Calendarios',       value:'0', icon:'🗓️', color:'#10b981', bg:'#f0fdf4' },
            { label:'Agendas',           value:'0', icon:'📓', color:'#8b5cf6', bg:'#faf5ff' },
            { label:'Planificadores',    value:'0', icon:'📋', color:'#f59e0b', bg:'#fffbeb' },
          ].map((s,i) => (
            <div key={i} style={{ background:'white', borderRadius:'12px', padding:'16px', border:`1px solid ${s.color}22`, display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:'22px', fontWeight:800, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:'11px', color:'#94a3b8' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:700, color:'#1e293b' }}>Mis Diseños</h3>
            <div style={{ display:'flex', gap:'0', background:'#f1f5f9', borderRadius:'10px', padding:'3px' }}>
              {(['calendarios','agendas'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding:'6px 16px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, transition:'all 0.15s', background: tab===t?'white':'transparent', color: tab===t?'#1e293b':'#94a3b8', boxShadow: tab===t?'0 1px 3px rgba(0,0,0,0.1)':'none' }}>
                  {t === 'calendarios' ? '🗓️ Calendarios' : '📓 Agendas'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', padding:'48px', textAlign:'center' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', margin:'0 auto 14px' }}>
              {tab === 'calendarios' ? '🗓️' : '📓'}
            </div>
            <div style={{ fontSize:'16px', fontWeight:700, color:'#334155', marginBottom:'6px' }}>No tienes {tab} guardados aún</div>
            <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'20px' }}>Crea tu primer diseño usando los botones de arriba</div>
            <button onClick={() => setVista(tab === 'calendarios' ? 'calendario' : 'agenda')}
              style={{ padding:'10px 28px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg, #3b82f6, #6366f1)', color:'white', cursor:'pointer', fontSize:'13px', fontWeight:700, boxShadow:'0 4px 12px #3b82f633' }}>
              + Crear {tab === 'calendarios' ? 'calendario' : 'agenda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// CONSTANTES COMPARTIDAS
// ═══════════════════════════════════════════
const MESES   = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS    = ['L','M','X','J','V','S','D']
const FUENTES = ['Playfair Display','Georgia','Arial','Helvetica','Times New Roman','Montserrat','Raleway']

const PALETAS = [
  { nombre:'Clásico',     fondo:'#ffffff', header:'#1e293b', texto:'#1e293b', acento:'#3b82f6' },
  { nombre:'Azul',        fondo:'#f0f7ff', header:'#1d4ed8', texto:'#1e3a5f', acento:'#1d4ed8' },
  { nombre:'Verde',       fondo:'#f0fdf4', header:'#166534', texto:'#14532d', acento:'#16a34a' },
  { nombre:'Rosa',        fondo:'#fff1f2', header:'#9f1239', texto:'#881337', acento:'#e11d48' },
  { nombre:'Púrpura',     fondo:'#faf5ff', header:'#6b21a8', texto:'#4c1d95', acento:'#9333ea' },
  { nombre:'Naranja',     fondo:'#fff7ed', header:'#9a3412', texto:'#7c2d12', acento:'#ea580c' },
  { nombre:'Minimalista', fondo:'#fafafa', header:'#374151', texto:'#111827', acento:'#6b7280' },
  { nombre:'Oscuro',      fondo:'#0f172a', header:'#3b82f6', texto:'#e2e8f0', acento:'#60a5fa' },
]

const TAMANOS = [
  { cat:'ESTÁNDAR', items:[
    { id:'carta',     nombre:'Carta',     dim:'21.6 × 27.9 cm' },
    { id:'oficio',    nombre:'Oficio',    dim:'21.6 × 33.0 cm' },
    { id:'ejecutivo', nombre:'Ejecutivo', dim:'18.4 × 26.7 cm' },
  ]},
  { cat:'ISO', items:[
    { id:'a4', nombre:'A4', dim:'21.0 × 29.7 cm' },
    { id:'a3', nombre:'A3', dim:'29.7 × 42.0 cm' },
    { id:'a5', nombre:'A5', dim:'14.8 × 21.0 cm' },
    { id:'a6', nombre:'A6', dim:'10.5 × 14.8 cm' },
  ]},
  { cat:'GRANDE', items:[
    { id:'tabloide', nombre:'Tabloide',   dim:'27.9 × 43.2 cm' },
    { id:'11x17',    nombre:'11" × 17"', dim:'27.9 × 43.2 cm' },
  ]},
  { cat:'ESPECIAL', items:[
    { id:'cuaderno', nombre:'Cuaderno', dim:'16.0 × 21.5 cm' },
  ]},
]

const PAPELES = [
  { id:'bond',      nombre:'Bond',      desc:'Liso y económico'       },
  { id:'brillante', nombre:'Brillante', desc:'Alta definición, fotos' },
  { id:'mate',      nombre:'Mate',      desc:'Sin brillo, elegante'   },
  { id:'reciclado', nombre:'Reciclado', desc:'Ecológico'              },
]

const TAMANOS_AGENDA = [
  { cat:'BOLSILLO',   items:[
    { id:'bolsillo',     nombre:'Bolsillo',     dim:'10 × 15 cm',    horiz:false, pronto:false },
  ]},
  { cat:'CUADERNO',   items:[
    { id:'cuaderno-s',   nombre:'Cuaderno S',   dim:'14 × 21 cm',    horiz:false, pronto:false },
    { id:'cuaderno-m',   nombre:'Cuaderno M',   dim:'17 × 24 cm',    horiz:false, pronto:false },
  ]},
  { cat:'ESTÁNDAR',   items:[
    { id:'a5',           nombre:'A5',           dim:'14.8 × 21 cm',  horiz:false, pronto:false },
    { id:'carta',        nombre:'Carta',        dim:'21.6 × 27.9 cm',horiz:false, pronto:false },
    { id:'a4',           nombre:'A4',           dim:'21 × 29.7 cm',  horiz:false, pronto:false },
  ]},
  { cat:'ESCRITORIO', items:[
    { id:'escritorio-s', nombre:'Escritorio S', dim:'21 × 15 cm',    horiz:true,  pronto:false },
    { id:'escritorio-m', nombre:'Escritorio M', dim:'30 × 21 cm',    horiz:true,  pronto:true  },
    { id:'escritorio-l', nombre:'Escritorio L', dim:'42 × 29.7 cm',  horiz:true,  pronto:true  },
  ]},
]

// ═══════════════════════════════════════════
// EDITOR DE CALENDARIO — CON FOTOS
// ═══════════════════════════════════════════
function EditorCalendario({ setVista }: { setVista: any }) {
  const [anio,      setAnio]      = useState(2026)
  const [tipo,      setTipo]      = useState<'pared'|'mesa'>('pared')
  const [tamano,    setTamano]    = useState('carta')
  const [papel,     setPapel]     = useState('bond')
  const [fuente,    setFuente]    = useState('Playfair Display')
  const [paleta,    setPaleta]    = useState(PALETAS[0])
  const [showPanel, setShowPanel] = useState(false)
  const [titulo,    setTitulo]    = useState('Mi Calendario')
  const [fotos,     setFotos]     = useState<Record<number,string>>({})

  const tamanoActual = TAMANOS.flatMap(c => c.items).find(t => t.id === tamano)
  const papelActual  = PAPELES.find(p => p.id === papel)

  function subirFoto(mes: number) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev: any) => {
        setFotos(prev => ({ ...prev, [mes]: ev.target.result }))
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  function quitarFoto(mes: number) {
    setFotos(prev => { const n = {...prev}; delete n[mes]; return n })
  }

  function getDias(mes: number) {
    const dim = new Date(anio, mes+1, 0).getDate()
    const fd  = new Date(anio, mes, 1).getDay()
    const ini = fd === 0 ? 6 : fd - 1
    return Array.from({ length: Math.ceil((ini+dim)/7)*7 }, (_,i) => {
      const d = i - ini + 1
      return d >= 1 && d <= dim ? d : null
    })
  }

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>

      {/* TOOLBAR */}
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'10px 16px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
        <button onClick={() => setVista('home')} style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px', color:'#64748b' }}>← Inicio</button>
        <input value={titulo} onChange={(e:any) => setTitulo(e.target.value)} style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', fontWeight:600, width:'160px', outline:'none' }}/>
        <div style={{ width:'1px', height:'24px', background:'#e2e8f0' }}/>

        {(['pared','mesa'] as const).map(t => (
          <button key={t} onClick={() => setTipo(t)}
            style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background: tipo===t?'#1e293b':'#f1f5f9', color: tipo===t?'white':'#64748b' }}>
            {t === 'pared' ? '🪟 Pared' : '🖥️ Mesa'}
          </button>
        ))}
        <div style={{ width:'1px', height:'24px', background:'#e2e8f0' }}/>

        <select value={fuente} onChange={(e:any) => setFuente(e.target.value)}
          style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', cursor:'pointer', outline:'none' }}>
          {FUENTES.map(f => <option key={f} value={f}>T {f}</option>)}
        </select>

        {/* Panel de tamaño y papel */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowPanel(!showPanel)}
            style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px' }}>
            📄 {tamanoActual?.nombre} — {papelActual?.nombre} ▾
          </button>
          {showPanel && (
            <div onClick={(e:any) => e.stopPropagation()}
              style={{ position:'absolute', top:'100%', left:0, marginTop:'4px', background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,0.12)', padding:'14px', zIndex:200, width:'300px', maxHeight:'440px', overflowY:'auto' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', marginBottom:'10px', letterSpacing:'1px' }}>TAMAÑO DE PAPEL</div>
              {TAMANOS.map(cat => (
                <div key={cat.cat} style={{ marginBottom:'12px' }}>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'6px' }}>{cat.cat}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                    {cat.items.map(item => (
                      <button key={item.id} onClick={() => { setTamano(item.id); setShowPanel(false) }}
                        style={{ padding:'10px', borderRadius:'8px', textAlign:'left', cursor:'pointer', border:'none', background: tamano===item.id?'#eff6ff':'#f8fafc', outline: tamano===item.id?'2px solid #3b82f6':'none' }}>
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
                  <button key={p.id} onClick={() => setPapel(p.id)}
                    style={{ width:'100%', padding:'8px 10px', borderRadius:'8px', textAlign:'left', cursor:'pointer', border:'none', marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px', background: papel===p.id?'#eff6ff':'#f8fafc' }}>
                    <div style={{ width:'16px', height:'16px', borderRadius:'50%', border:'2px solid #3b82f6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {papel===p.id && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#3b82f6' }}/>}
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

        <button style={{ padding:'6px 16px', borderRadius:'8px', border:'none', background:'#1e293b', color:'white', cursor:'pointer', fontSize:'12px', fontWeight:700, marginLeft:'auto' }}>📄 PDF</button>
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button onClick={() => setAnio(anio-1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>‹</button>
          <span style={{ fontSize:'13px', fontWeight:700, minWidth:'40px', textAlign:'center' }}>{anio}</span>
          <button onClick={() => setAnio(anio+1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>›</button>
        </div>
      </div>

      {/* PALETAS */}
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'8px 16px', display:'flex', gap:'6px', alignItems:'center' }}>
        <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:600, marginRight:'4px' }}>Estilo:</span>
        {PALETAS.map(p => (
          <button key={p.nombre} onClick={() => setPaleta(p)}
            style={{ padding:'4px 10px', borderRadius:'20px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, background: paleta.nombre===p.nombre?p.header:'#f1f5f9', color: paleta.nombre===p.nombre?'white':'#64748b' }}>
            {p.nombre}
          </button>
        ))}
      </div>

      {/* 12 MESES CON FOTOS */}
      <div style={{ flex:1, overflow:'auto', padding:'20px' }} onClick={() => setShowPanel(false)}>
        <div style={{ fontSize:'11px', color:'#94a3b8', marginBottom:'12px', textAlign:'center' }}>
          {tamanoActual?.nombre} {tamanoActual?.dim} · Papel {papelActual?.nombre} — {papelActual?.desc}
          &nbsp;·&nbsp; Haz clic en la foto de cada mes para cambiarla
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', maxWidth:'900px', margin:'0 auto' }}>
          {MESES.map((mes, idx) => (
            <div key={idx} style={{ background:paleta.fondo, borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', border:'1px solid #e2e8f0', fontFamily:fuente }}>

              {/* FOTO DEL MES — click para subir */}
              <div style={{ height:'80px', position:'relative', cursor:'pointer',
                background: fotos[idx] ? `url(${fotos[idx]}) center/cover` : `linear-gradient(135deg, ${paleta.header}dd, ${paleta.acento}99)` }}
                onClick={() => subirFoto(idx)}>

                {/* Overlay hover */}
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                  onMouseEnter={(e:any) => e.currentTarget.style.background='rgba(0,0,0,0.35)'}
                  onMouseLeave={(e:any) => e.currentTarget.style.background='rgba(0,0,0,0)'}>
                  {!fotos[idx] && <span style={{ fontSize:'20px', opacity:0.5 }}>🖼️</span>}
                </div>

                {/* Nombre del mes */}
                <div style={{ position:'absolute', top:'6px', left:'8px', fontSize:'11px', fontWeight:700, color:'white', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>{mes}</div>

                {/* Botón quitar foto */}
                {fotos[idx] ? (
                  <button onClick={(e:any) => { e.stopPropagation(); quitarFoto(idx) }}
                    style={{ position:'absolute', top:'4px', right:'4px', width:'20px', height:'20px', borderRadius:'50%', border:'none', background:'rgba(0,0,0,0.5)', color:'white', cursor:'pointer', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    ✕
                  </button>
                ) : (
                  <div style={{ position:'absolute', bottom:'4px', right:'6px', fontSize:'9px', color:'rgba(255,255,255,0.8)', background:'rgba(0,0,0,0.3)', padding:'1px 5px', borderRadius:'4px' }}>
                    + Foto
                  </div>
                )}
              </div>

              {/* GRILLA DE DÍAS */}
              <div style={{ padding:'6px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'2px' }}>
                  {DIAS.map(d => <div key={d} style={{ textAlign:'center', fontSize:'7px', fontWeight:700, color:paleta.acento, padding:'1px 0' }}>{d}</div>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px' }}>
                  {getDias(idx).map((dia,i) => {
                    const isHoy = dia===new Date().getDate() && idx===new Date().getMonth() && anio===new Date().getFullYear()
                    return (
                      <div key={i} style={{ textAlign:'center', fontSize:'7px', color: dia?(isHoy?'white':paleta.texto):'transparent', background: isHoy?paleta.acento:'transparent', borderRadius:'50%', width:'14px', height:'14px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:isHoy?700:400 }}>
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
    </div>
  )
}

// ═══════════════════════════════════════════
// WIZARD AGENDA — 4 PASOS
// ═══════════════════════════════════════════
const TIPOS_AGENDA = [
  { id:'personal',     icon:'📓', nombre:'Agenda Personal',          desc:'Planificación diaria con espacio para notas y metas',    tags:['Semanal','Notas','Metas']          },
  { id:'ejecutiva',    icon:'💼', nombre:'Agenda Ejecutiva',          desc:'Profesional con reuniones, prioridades y seguimiento',   tags:['Reuniones','Prioridades']           },
  { id:'planificador', icon:'📋', nombre:'Planificador',              desc:'Vista semanal y mensual con objetivos y proyectos',      tags:['Vista semanal','Proyectos']         },
  { id:'cuaderno',     icon:'📔', nombre:'Cuaderno',                  desc:'Hojas rayadas, cuadriculadas o en blanco para escribir', tags:['Blanco','Rayado','Cuadriculado']   },
  { id:'escritorio',   icon:'🖥️', nombre:'Planificador Escritorio',   desc:'Formato horizontal para tu escritorio',                 tags:['Semanal','Grande','Horizontal']    },
]

function WizardAgenda({ setVista }: { setVista: any }) {
  const [paso,   setPaso]   = useState(1)
  const [tipo,   setTipo]   = useState('')
  const [tam,    setTam]    = useState('')
  const [estilo, setEstilo] = useState(PALETAS[0])
  const [titulo, setTitulo] = useState('Mi Agenda')
  const [anio,   setAnio]   = useState(2026)

  const tamActual = TAMANOS_AGENDA.flatMap(c => c.items).find(t => t.id === tam)
  const esHoriz   = tamActual?.horiz

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px' }}>
        <button onClick={() => setVista('home')} style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px', color:'#64748b' }}>← Inicio</button>
        <div style={{ fontSize:'16px', fontWeight:700 }}>Nueva Agenda</div>
        <div style={{ fontSize:'12px', color:'#94a3b8' }}>Paso {paso} de 4</div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
          {[1,2,3,4].map(p => (
            <div key={p} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, background: paso>p?'#10b981':paso===p?'#1e293b':'#e2e8f0', color: paso>=p?'white':'#94a3b8' }}>
                {paso > p ? '✓' : p}
              </div>
              {p < 4 && <div style={{ width:'24px', height:'2px', background: paso>p?'#10b981':'#e2e8f0' }}/>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <div style={{ flex:1, overflow:'auto', padding:'28px' }}>

          {paso === 1 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>¿Qué tipo de agenda necesitas?</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Elige el formato que mejor se adapte a ti</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                {TIPOS_AGENDA.map(t => (
                  <button key={t.id} onClick={() => setTipo(t.id)}
                    style={{ padding:'18px', borderRadius:'12px', textAlign:'left', cursor:'pointer', border:'none', background: tipo===t.id?'#eff6ff':'white', outline: tipo===t.id?'2px solid #3b82f6':'1px solid #e2e8f0', boxShadow: tipo===t.id?'0 4px 12px #3b82f633':'none' }}>
                    <div style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                      <span style={{ fontSize:'24px' }}>{t.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'14px', color:'#1e293b', marginBottom:'4px' }}>{t.nombre}</div>
                        <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'8px' }}>{t.desc}</div>
                        <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                          {t.tags.map(tag => <span key={tag} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'20px', background:'#f1f5f9', color:'#64748b', fontWeight:600 }}>{tag}</span>)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {paso === 2 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>¿Qué tamaño necesitas?</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Elige el tamaño del papel</div>
              {TAMANOS_AGENDA.map(cat => (
                <div key={cat.cat} style={{ marginBottom:'20px' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'10px' }}>{cat.cat}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
                    {cat.items.map(item => (
                      <button key={item.id} onClick={() => !item.pronto && setTam(item.id)}
                        style={{ padding:'14px', borderRadius:'10px', textAlign:'center', cursor:item.pronto?'not-allowed':'pointer', border:'none', opacity:item.pronto?0.5:1, background: tam===item.id?'#eff6ff':'white', outline: tam===item.id?'2px solid #3b82f6':'1px solid #e2e8f0' }}>
                        <div style={{ fontSize:'20px', marginBottom:'6px' }}>{item.horiz ? '⬜' : '▭'}</div>
                        <div style={{ fontSize:'13px', fontWeight:700, color:'#1e293b' }}>{item.nombre}</div>
                        <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'2px' }}>{item.dim}</div>
                        {item.pronto && <div style={{ fontSize:'9px', color:'#f59e0b', fontWeight:700, marginTop:'4px' }}>DISPONIBLE PRONTO</div>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {paso === 3 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>Elige el estilo</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Personaliza los colores de tu agenda</div>
              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>TÍTULO</label>
                <input value={titulo} onChange={(e:any) => setTitulo(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'14px', outline:'none', fontWeight:600 }}/>
              </div>
              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>AÑO</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  {[2025,2026,2027,2028].map(a => (
                    <button key={a} onClick={() => setAnio(a)} style={{ padding:'8px 16px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:700, background: anio===a?'#1e293b':'#f1f5f9', color: anio===a?'white':'#64748b' }}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>ESTILO DE COLOR</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                  {PALETAS.map(p => (
                    <button key={p.nombre} onClick={() => setEstilo(p)}
                      style={{ padding:'14px', borderRadius:'10px', border:'none', cursor:'pointer', background:p.fondo, outline: estilo.nombre===p.nombre?`2px solid ${p.header}`:'1px solid #e2e8f0' }}>
                      <div style={{ width:'100%', height:'24px', borderRadius:'6px', background:p.header, marginBottom:'6px' }}/>
                      <div style={{ fontSize:'11px', fontWeight:600, color:p.texto }}>{p.nombre}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {paso === 4 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>¡Lista para crear!</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Revisa los detalles de tu agenda</div>
              <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden', marginBottom:'20px' }}>
                {[
                  { label:'Tipo',   value: TIPOS_AGENDA.find(t=>t.id===tipo)?.nombre||'' },
                  { label:'Tamaño', value: `${tamActual?.nombre} — ${tamActual?.dim}`     },
                  { label:'Título', value: titulo                                          },
                  { label:'Año',    value: String(anio)                                   },
                  { label:'Estilo', value: estilo.nombre                                  },
                ].map((item,i) => (
                  <div key={i} style={{ padding:'14px 18px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'13px', color:'#94a3b8', fontWeight:600 }}>{item.label}</span>
                    <span style={{ fontSize:'13px', color:'#1e293b', fontWeight:700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <button style={{ width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg, #1e293b, #334155)', color:'white', cursor:'pointer', fontSize:'15px', fontWeight:700, marginBottom:'8px' }}>📄 Exportar PDF</button>
              <button style={{ width:'100%', padding:'12px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'white', color:'#1e293b', cursor:'pointer', fontSize:'14px', fontWeight:600 }}>🖨️ Imprimir directamente</button>
            </div>
          )}

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'28px' }}>
            <button onClick={() => paso>1 ? setPaso(paso-1) : setVista('home')}
              style={{ padding:'10px 24px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'13px', fontWeight:600, color:'#64748b' }}>
              {paso===1 ? 'Cancelar' : '← Atrás'}
            </button>
            {paso < 4 && (
              <button onClick={() => { if(paso===1&&!tipo) return; if(paso===2&&!tam) return; setPaso(paso+1) }}
                style={{ padding:'10px 28px', borderRadius:'10px', border:'none', background:(paso===1&&!tipo)||(paso===2&&!tam)?'#e2e8f0':'#1e293b', color:(paso===1&&!tipo)||(paso===2&&!tam)?'#94a3b8':'white', cursor:(paso===1&&!tipo)||(paso===2&&!tam)?'not-allowed':'pointer', fontSize:'13px', fontWeight:700 }}>
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* VISTA PREVIA */}
        <div style={{ width:'260px', borderLeft:'1px solid #e2e8f0', background:'white', padding:'20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'16px' }}>VISTA PREVIA</div>
          <div style={{ background:estilo.fondo, borderRadius:'8px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', width: esHoriz?'200px':'130px', height: esHoriz?'130px':'180px', display:'flex', flexDirection:'column' }}>
            <div style={{ background:estilo.header, padding:'12px', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.7)', marginBottom:'4px' }}>{anio}</div>
              <div style={{ fontSize:'14px', fontWeight:800, color:'white', textAlign:'center' }}>{titulo}</div>
            </div>
            <div style={{ padding:'6px', display:'flex', gap:'4px', justifyContent:'center' }}>
              {['P','M','S','D','N'].map(l => <div key={l} style={{ fontSize:'8px', color:estilo.acento, fontWeight:700 }}>{l}</div>)}
            </div>
          </div>
          {tamActual && (
            <div style={{ marginTop:'12px', fontSize:'11px', color:'#94a3b8', textAlign:'center' }}>
              <div style={{ fontWeight:600, color:'#64748b' }}>{tamActual.nombre}</div>
              <div>{tamActual.dim}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// EDITOR PLANIFICADOR — COMPLETO CON 4 PASOS
// ═══════════════════════════════════════════
const TIPOS_PLAN = [
  { id:'semanal',  icon:'📆', nombre:'Planificador Semanal',  desc:'Una semana completa por página con espacio diario',  tags:['Lunes-Domingo','Notas']       },
  { id:'mensual',  icon:'📅', nombre:'Planificador Mensual',  desc:'Un mes completo con tareas y seguimiento',           tags:['30 días','Metas']             },
  { id:'diario',   icon:'📝', nombre:'Planificador Diario',   desc:'Un día completo con horario hora a hora',            tags:['Hora a hora','Prioridades']   },
  { id:'anual',    icon:'📊', nombre:'Planificador Anual',    desc:'Vista de los 12 meses en una sola página',          tags:['12 meses','Compacto']         },
  { id:'habitos',  icon:'🔄', nombre:'Tracker de Hábitos',    desc:'Seguimiento mensual de hábitos con racha',          tags:['Hábitos','Racha']             },
  { id:'metas',    icon:'🎯', nombre:'Planificador de Metas', desc:'Define y sigue tus objetivos con hitos',            tags:['Objetivos','Progreso']        },
]

const SECCIONES_PLAN: Record<string,string[]> = {
  semanal: ['Espacio por día (Lun-Dom)','Prioridades de la semana','Notas semanales','Lista de tareas','Hábitos de la semana'],
  mensual: ['Grilla del mes','Metas del mes','Lista de tareas','Control de gastos','Notas'],
  diario:  ['Horario 6am-10pm','Prioridades del día','Lista de tareas','Notas','Gratitud del día'],
  anual:   ['12 meses compactos','Metas anuales','Días festivos','Semanas numeradas'],
  habitos: ['Tabla de hábitos x30 días','Racha de días','Porcentaje cumplimiento','Notas de reflexión'],
  metas:   ['Meta principal','Hitos y pasos','Fecha límite','Progreso visual','Notas de avance'],
}

function EditorPlanificador({ setVista }: { setVista: any }) {
  const [paso,      setPaso]      = useState(1)
  const [tipo,      setTipo]      = useState('')
  const [tam,       setTam]       = useState('')
  const [estilo,    setEstilo]    = useState(PALETAS[0])
  const [titulo,    setTitulo]    = useState('Mi Planificador')
  const [anio,      setAnio]      = useState(2026)
  const [secciones, setSecciones] = useState<string[]>([])

  const tamActual  = TAMANOS_AGENDA.flatMap(c => c.items).find(t => t.id === tam)
  const tipoActual = TIPOS_PLAN.find(t => t.id === tipo)
  const esHoriz    = tamActual?.horiz

  function toggleSeccion(s: string) {
    setSecciones(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>

      {/* Header */}
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px' }}>
        <button onClick={() => setVista('home')} style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px', color:'#64748b' }}>← Inicio</button>
        <div style={{ fontSize:'16px', fontWeight:700 }}>Nuevo Planificador</div>
        <div style={{ fontSize:'12px', color:'#94a3b8' }}>Paso {paso} de 4</div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
          {[1,2,3,4].map(p => (
            <div key={p} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, background: paso>p?'#8b5cf6':paso===p?'#1e293b':'#e2e8f0', color: paso>=p?'white':'#94a3b8' }}>
                {paso > p ? '✓' : p}
              </div>
              {p < 4 && <div style={{ width:'24px', height:'2px', background: paso>p?'#8b5cf6':'#e2e8f0' }}/>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <div style={{ flex:1, overflow:'auto', padding:'28px' }}>

          {/* PASO 1 — Tipo */}
          {paso === 1 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>¿Qué tipo de planificador necesitas?</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Elige el formato que mejor se adapte a tus objetivos</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                {TIPOS_PLAN.map(t => (
                  <button key={t.id} onClick={() => { setTipo(t.id); setSecciones(SECCIONES_PLAN[t.id] || []) }}
                    style={{ padding:'18px', borderRadius:'12px', textAlign:'left', cursor:'pointer', border:'none', background: tipo===t.id?'#faf5ff':'white', outline: tipo===t.id?'2px solid #8b5cf6':'1px solid #e2e8f0', boxShadow: tipo===t.id?'0 4px 12px #8b5cf633':'none' }}>
                    <div style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                      <span style={{ fontSize:'28px' }}>{t.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'14px', color:'#1e293b', marginBottom:'4px' }}>{t.nombre}</div>
                        <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'8px' }}>{t.desc}</div>
                        <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                          {t.tags.map(tag => <span key={tag} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'20px', background:'#f3e8ff', color:'#7c3aed', fontWeight:600 }}>{tag}</span>)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2 — Tamaño */}
          {paso === 2 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>¿Qué tamaño necesitas?</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Elige el tamaño del papel</div>
              {TAMANOS_AGENDA.map(cat => (
                <div key={cat.cat} style={{ marginBottom:'20px' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'10px' }}>{cat.cat}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
                    {cat.items.map(item => (
                      <button key={item.id} onClick={() => !item.pronto && setTam(item.id)}
                        style={{ padding:'14px', borderRadius:'10px', textAlign:'center', cursor:item.pronto?'not-allowed':'pointer', border:'none', opacity:item.pronto?0.5:1, background: tam===item.id?'#faf5ff':'white', outline: tam===item.id?'2px solid #8b5cf6':'1px solid #e2e8f0' }}>
                        <div style={{ fontSize:'20px', marginBottom:'6px' }}>{item.horiz ? '⬜' : '▭'}</div>
                        <div style={{ fontSize:'13px', fontWeight:700, color:'#1e293b' }}>{item.nombre}</div>
                        <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'2px' }}>{item.dim}</div>
                        {item.pronto && <div style={{ fontSize:'9px', color:'#f59e0b', fontWeight:700, marginTop:'4px' }}>PRÓXIMAMENTE</div>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PASO 3 — Secciones y estilo */}
          {paso === 3 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>Personaliza tu planificador</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Elige secciones y estilo visual</div>

              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>TÍTULO</label>
                <input value={titulo} onChange={(e:any) => setTitulo(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'14px', outline:'none', fontWeight:600 }}/>
              </div>

              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>AÑO</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  {[2025,2026,2027,2028].map(a => (
                    <button key={a} onClick={() => setAnio(a)} style={{ padding:'8px 16px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:700, background: anio===a?'#8b5cf6':'#f1f5f9', color: anio===a?'white':'#64748b' }}>{a}</button>
                  ))}
                </div>
              </div>

              {SECCIONES_PLAN[tipo] && (
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>SECCIONES A INCLUIR</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                    {SECCIONES_PLAN[tipo].map(s => (
                      <button key={s} onClick={() => toggleSeccion(s)}
                        style={{ padding:'10px 14px', borderRadius:'10px', textAlign:'left', cursor:'pointer', border:'none', display:'flex', alignItems:'center', gap:'10px', background: secciones.includes(s)?'#faf5ff':'white', outline: secciones.includes(s)?'2px solid #8b5cf6':'1px solid #e2e8f0' }}>
                        <div style={{ width:'20px', height:'20px', borderRadius:'6px', background: secciones.includes(s)?'#8b5cf6':'white', border:`2px solid ${secciones.includes(s)?'#8b5cf6':'#e2e8f0'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'white', fontWeight:700 }}>
                          {secciones.includes(s) ? '✓' : ''}
                        </div>
                        <span style={{ fontSize:'13px', color:'#1e293b' }}>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize:'12px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'8px' }}>ESTILO DE COLOR</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                  {PALETAS.map(p => (
                    <button key={p.nombre} onClick={() => setEstilo(p)}
                      style={{ padding:'12px', borderRadius:'10px', border:'none', cursor:'pointer', background:p.fondo, outline: estilo.nombre===p.nombre?`2px solid ${p.header}`:'1px solid #e2e8f0' }}>
                      <div style={{ width:'100%', height:'20px', borderRadius:'5px', background:p.header, marginBottom:'5px' }}/>
                      <div style={{ fontSize:'10px', fontWeight:600, color:p.texto }}>{p.nombre}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4 — Resumen */}
          {paso === 4 && (
            <div>
              <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'6px' }}>¡Listo para crear!</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Revisa los detalles de tu planificador</div>
              <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden', marginBottom:'16px' }}>
                {[
                  { label:'Tipo',      value: tipoActual?.nombre||''                           },
                  { label:'Tamaño',    value: `${tamActual?.nombre} — ${tamActual?.dim}`       },
                  { label:'Título',    value: titulo                                            },
                  { label:'Año',       value: String(anio)                                     },
                  { label:'Estilo',    value: estilo.nombre                                    },
                  { label:'Secciones', value: `${secciones.length} secciones seleccionadas`   },
                ].map((item,i) => (
                  <div key={i} style={{ padding:'12px 18px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'13px', color:'#94a3b8', fontWeight:600 }}>{item.label}</span>
                    <span style={{ fontSize:'13px', color:'#1e293b', fontWeight:700 }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {secciones.length > 0 && (
                <div style={{ background:'#faf5ff', borderRadius:'12px', padding:'14px', border:'1px solid #e9d5ff', marginBottom:'20px' }}>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'#7c3aed', marginBottom:'8px' }}>📋 Secciones incluidas:</div>
                  {secciones.map(s => (
                    <div key={s} style={{ fontSize:'12px', color:'#6b7280', padding:'2px 0', display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{ color:'#8b5cf6' }}>✓</span> {s}
                    </div>
                  ))}
                </div>
              )}

              <button style={{ width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg, #7c3aed, #8b5cf6)', color:'white', cursor:'pointer', fontSize:'15px', fontWeight:700, marginBottom:'8px', boxShadow:'0 4px 12px #8b5cf633' }}>
                📄 Exportar PDF
              </button>
              <button style={{ width:'100%', padding:'12px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'white', color:'#1e293b', cursor:'pointer', fontSize:'14px', fontWeight:600 }}>
                🖨️ Imprimir directamente
              </button>
            </div>
          )}

          {/* Navegación */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'28px' }}>
            <button onClick={() => paso>1 ? setPaso(paso-1) : setVista('home')}
              style={{ padding:'10px 24px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'13px', fontWeight:600, color:'#64748b' }}>
              {paso===1 ? 'Cancelar' : '← Atrás'}
            </button>
            {paso < 4 && (
              <button onClick={() => { if(paso===1&&!tipo) return; if(paso===2&&!tam) return; setPaso(paso+1) }}
                style={{ padding:'10px 28px', borderRadius:'10px', border:'none', background:(paso===1&&!tipo)||(paso===2&&!tam)?'#e2e8f0':'linear-gradient(135deg, #7c3aed, #8b5cf6)', color:(paso===1&&!tipo)||(paso===2&&!tam)?'#94a3b8':'white', cursor:(paso===1&&!tipo)||(paso===2&&!tam)?'not-allowed':'pointer', fontSize:'13px', fontWeight:700 }}>
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* VISTA PREVIA */}
        <div style={{ width:'260px', borderLeft:'1px solid #e2e8f0', background:'white', padding:'20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'16px' }}>VISTA PREVIA</div>
          <div style={{ background:estilo.fondo, borderRadius:'8px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', width: esHoriz?'200px':'130px', height: esHoriz?'130px':'180px', display:'flex', flexDirection:'column' }}>
            <div style={{ background:estilo.header, padding:'10px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.7)', marginBottom:'2px' }}>{tipoActual?.icon} {tipoActual?.nombre}</div>
              <div style={{ fontSize:'12px', fontWeight:800, color:'white', textAlign:'center' }}>{titulo}</div>
              <div style={{ fontSize:'8px', color:'rgba(255,255,255,0.6)' }}>{anio}</div>
            </div>
            <div style={{ flex:1, padding:'6px', display:'flex', flexDirection:'column', gap:'3px' }}>
              {secciones.slice(0,4).map((s,i) => (
                <div key={i} style={{ fontSize:'7px', color:estilo.texto, padding:'2px 4px', background:`${estilo.acento}11`, borderRadius:'3px', borderLeft:`2px solid ${estilo.acento}` }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          {tamActual && (
            <div style={{ marginTop:'12px', fontSize:'11px', color:'#94a3b8', textAlign:'center' }}>
              <div style={{ fontWeight:600, color:'#64748b' }}>{tamActual.nombre}</div>
              <div>{tamActual.dim}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
