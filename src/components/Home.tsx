/* eslint-disable */
import { useState } from 'react'
import { Vista, Diseno } from '../constants'

export default function Home({ setVista, disenos, onEliminar, onAbrir }: {
  setVista:   (v: Vista) => void
  disenos:    Diseno[]
  onEliminar: (id: string) => void
  onAbrir:    (d: Diseno) => void
}) {
  const [tab, setTab] = useState<'todos'|'calendario'|'agenda'|'planificador'>('todos')

  const productos = [
    { id:'calendario',   icon:'🗓️', nombre:'Nuevo Calendario',  desc:'Pared, mesa o escritorio',      color:'#3b82f6', bg:'#eff6ff', vista:'calendario'   as Vista },
    { id:'agenda',       icon:'📓', nombre:'Nueva Agenda',       desc:'Personal, ejecutiva, cuaderno', color:'#10b981', bg:'#f0fdf4', vista:'agenda'       as Vista },
    { id:'planificador', icon:'📋', nombre:'Nuevo Planificador', desc:'Semanal, mensual o diario',     color:'#8b5cf6', bg:'#faf5ff', vista:'planificador'  as Vista },
  ]
  const stats = [
    { label:'Total guardados', value:disenos.length,                                    icon:'📁', color:'#3b82f6', bg:'#eff6ff' },
    { label:'Calendarios',     value:disenos.filter(d=>d.tipo==='calendario').length,   icon:'🗓️', color:'#10b981', bg:'#f0fdf4' },
    { label:'Agendas',         value:disenos.filter(d=>d.tipo==='agenda').length,       icon:'📓', color:'#8b5cf6', bg:'#faf5ff' },
    { label:'Planificadores',  value:disenos.filter(d=>d.tipo==='planificador').length, icon:'📋', color:'#f59e0b', bg:'#fffbeb' },
  ]
  const disenosFiltrados = tab === 'todos' ? disenos : disenos.filter(d => d.tipo === tab)

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>🖨️</div>
          <div>
            <div style={{ fontSize:'20px', fontWeight:800, color:'white' }}>Planify Creator</div>
            <div style={{ fontSize:'11px', color:'#94a3b8' }}>Crea · Personaliza · Imprime</div>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'12px', color:'#94a3b8' }}>{new Date().toLocaleDateString('es-CR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
          <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>v2.0.0</div>
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'28px 32px' }}>
        <div style={{ marginBottom:'24px' }}>
          <h2 style={{ fontSize:'22px', fontWeight:800, color:'#1e293b', marginBottom:'4px' }}>¿Qué quieres crear hoy? 👋</h2>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>Diseña, personaliza e imprime calendarios, agendas y planificadores profesionales</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'28px' }}>
          {productos.map(p => (
            <button key={p.id} onClick={() => setVista(p.vista)} style={{
              padding:'24px', borderRadius:'16px', border:`1px solid ${p.color}33`, background:'white',
              cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:'12px',
              boxShadow:`0 1px 3px ${p.color}11`, transition:'all 0.2s', position:'relative', overflow:'hidden'
            }}
            onMouseEnter={(e:any)=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 12px 30px ${p.color}33`; e.currentTarget.style.borderColor=p.color }}
            onMouseLeave={(e:any)=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 1px 3px ${p.color}11`; e.currentTarget.style.borderColor=`${p.color}33` }}
            >
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
          {stats.map((s,i) => (
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
            <h3 style={{ fontSize:'15px', fontWeight:700, color:'#1e293b', margin:0 }}>Mis Diseños</h3>
            <div style={{ display:'flex', background:'#f1f5f9', borderRadius:'10px', padding:'3px' }}>
              {(['todos','calendario','agenda','planificador'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer',
                  fontSize:'11px', fontWeight:600, transition:'all 0.15s',
                  background: tab===t ? 'white' : 'transparent',
                  color:      tab===t ? '#1e293b' : '#94a3b8',
                  boxShadow:  tab===t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}>
                  {t==='todos'?'Todos':t==='calendario'?'🗓️ Calendarios':t==='agenda'?'📓 Agendas':'📋 Planificadores'}
                </button>
              ))}
            </div>
          </div>

          {disenosFiltrados.length === 0 ? (
            <div style={{ background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', padding:'48px', textAlign:'center' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', margin:'0 auto 14px' }}>📂</div>
              <div style={{ fontSize:'16px', fontWeight:700, color:'#334155', marginBottom:'6px' }}>No tienes diseños guardados aún</div>
              <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'20px' }}>Tus diseños se guardan automáticamente y estarán aquí al volver</div>
              <button onClick={() => setVista('calendario')} style={{ padding:'10px 28px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg, #3b82f6, #6366f1)', color:'white', cursor:'pointer', fontSize:'13px', fontWeight:700 }}>
                + Crear mi primer diseño
              </button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'12px' }}>
              {disenosFiltrados.map(d => (
                <div key={d.id} onClick={()=>onAbrir(d)} style={{ background:'white', borderRadius:'12px', overflow:'hidden', border:'1px solid #e2e8f0', position:'relative', cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={(e:any)=>{ e.currentTarget.style.boxShadow='0 6px 18px rgba(0,0,0,0.10)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={(e:any)=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <div style={{ height:'70px', background:`linear-gradient(135deg, ${d.paleta.header}dd, ${d.paleta.acento}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:d.fuente, fontSize:'13px', fontWeight:700, color:'white' }}>
                    {d.titulo}
                  </div>
                  <div style={{ padding:'12px' }}>
                    <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'4px' }}>
                      {d.tipo==='calendario'?'🗓️':d.tipo==='agenda'?'📓':'📋'} {d.tipo.charAt(0).toUpperCase()+d.tipo.slice(1)} · {d.anio}
                    </div>
                    <div style={{ fontSize:'10px', color:'#94a3b8' }}>{d.fechaCreacion}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'8px' }}>
                      <div style={{ fontSize:'10px', fontWeight:600, color:d.paleta.acento, padding:'2px 8px', borderRadius:'20px', background:`${d.paleta.acento}15` }}>
                        ✏️ {d.paleta.nombre}
                      </div>
                      <button
                        onClick={(e:any) => {
                          e.stopPropagation()
                          if (window.confirm(`¿Seguro que querés eliminar "${d.titulo}"? Esta acción no se puede deshacer.`)) {
                            onEliminar(d.id)
                          }
                        }}
                        style={{ width:'24px', height:'24px', borderRadius:'6px', border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:'11px', color:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center' }}
                        title="Eliminar diseño"
                      >🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}