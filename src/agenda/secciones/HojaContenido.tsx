/* eslint-disable */
import { AgendaConfig } from '../types'
import { MESES } from '../../constants'

type Modo = 'notas' | 'tareas' | 'contactos' | 'financiera' | 'habitos'

export default function HojaContenido({ config, modo, numero = 1 }: {
  config:  AgendaConfig
  modo:    Modo
  numero?: number
}) {
  const { paleta, fuente } = config

  const headers: Record<Modo, { titulo: string; icono: string; sub: string }> = {
    notas:     { titulo:'NOTAS',              icono:'📝', sub:'Espacio libre para tus ideas' },
    tareas:    { titulo:'TAREAS',             icono:'✅', sub:'Organiza y completa tus pendientes' },
    contactos: { titulo:'DIRECTORIO',         icono:'📞', sub:'Contactos importantes' },
    financiera:{ titulo:'FINANZAS',           icono:'💰', sub:'Control de ingresos y gastos' },
    habitos:   { titulo:'HÁBITOS',            icono:'🔥', sub:`Seguimiento · ${config.anio}` },
  }

  const h = headers[modo]

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:'3px', marginBottom:'3px' }}>{h.sub.toUpperCase()}</div>
          <div style={{ fontSize:'20px', fontWeight:800, color:'white', letterSpacing:'2px' }}>{h.titulo}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {modo !== 'habitos' && modo !== 'contactos' && (
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', fontWeight:600 }}>#{numero}</div>
          )}
          <div style={{ fontSize:'24px' }}>{h.icono}</div>
        </div>
      </div>

      <div style={{ flex:1, padding:'20px 32px' }}>

        {/* ── NOTAS ── */}
        {modo === 'notas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
            {[...Array(28)].map((_,i) => (
              <div key={i} style={{ height:'28px', borderBottom:`1px solid ${paleta.texto}15`, position:'relative' }}>
                {i % 7 === 0 && i > 0 && (
                  <div style={{ position:'absolute', left:0, top:0, width:'100%', height:'1px', background:`${paleta.acento}25` }}/>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TAREAS ── */}
        {modo === 'tareas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
              {['Pendiente','En proceso','Completado','Cancelado'].map((estado, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'20px', background:`${paleta.acento}12`, border:`1px solid ${paleta.acento}30` }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:[paleta.acento,'#f59e0b','#16a34a','#dc2626'][i] }}/>
                  <div style={{ fontSize:'9px', fontWeight:600, color:paleta.texto }}>{estado}</div>
                </div>
              ))}
            </div>
            {[...Array(20)].map((_,i) => (
              <div key={i} style={{ display:'flex', gap:'10px', alignItems:'center', padding:'5px 0', borderBottom:`1px solid ${paleta.texto}10` }}>
                <div style={{ width:'16px', height:'16px', borderRadius:'4px', border:`1.5px solid ${paleta.acento}55`, flexShrink:0 }}/>
                <div style={{ flex:1, height:'16px' }}/>
                <div style={{ width:'60px', height:'14px', borderRadius:'4px', border:`1px solid ${paleta.texto}15` }}/>
              </div>
            ))}
          </div>
        )}

        {/* ── CONTACTOS ── */}
        {modo === 'contactos' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ padding:'12px', background:`${paleta.header}06`, borderRadius:'10px', border:`1px solid ${paleta.acento}20` }}>
                <div style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`${paleta.acento}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>👤</div>
                  <div style={{ flex:1 }}>
                    <div style={{ height:'14px', borderBottom:`1.5px solid ${paleta.texto}25`, marginBottom:'6px' }}/>
                    <div style={{ height:'12px', borderBottom:`1px solid ${paleta.texto}15`, width:'70%' }}/>
                  </div>
                </div>
                {[{ icon:'📱', label:'Tel' },{ icon:'📧', label:'Email' },{ icon:'🏢', label:'Empresa' }].map((c, j) => (
                  <div key={j} style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'5px' }}>
                    <div style={{ fontSize:'10px', width:'16px' }}>{c.icon}</div>
                    <div style={{ flex:1, height:'13px', borderBottom:`1px solid ${paleta.texto}15` }}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── FINANCIERA ── */}
        {modo === 'financiera' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {/* Resumen */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
              {[{ label:'INGRESOS', color:'#16a34a', icon:'📈' },{ label:'GASTOS', color:'#dc2626', icon:'📉' },{ label:'BALANCE', color:paleta.acento, icon:'⚖️' }].map((item, i) => (
                <div key={i} style={{ padding:'12px', background:`${item.color}10`, borderRadius:'10px', border:`1px solid ${item.color}30`, textAlign:'center' }}>
                  <div style={{ fontSize:'18px', marginBottom:'4px' }}>{item.icon}</div>
                  <div style={{ fontSize:'9px', fontWeight:700, color:item.color, letterSpacing:'1px', marginBottom:'4px' }}>{item.label}</div>
                  <div style={{ height:'20px', borderBottom:`1.5px solid ${item.color}50` }}/>
                </div>
              ))}
            </div>

            {/* Tabla */}
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'80px 1fr 90px 90px 100px', gap:'6px', padding:'6px 8px', background:`${paleta.header}12`, borderRadius:'6px', marginBottom:'4px' }}>
                {['FECHA','DESCRIPCIÓN','CATEGORÍA','MONTO','TIPO'].map(col => (
                  <div key={col} style={{ fontSize:'8px', fontWeight:700, color:paleta.acento, letterSpacing:'0.5px' }}>{col}</div>
                ))}
              </div>
              {[...Array(16)].map((_,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr 90px 90px 100px', gap:'6px', padding:'5px 8px', borderBottom:`1px solid ${paleta.texto}10` }}>
                  {[...Array(5)].map((_,j) => (
                    <div key={j} style={{ height:'14px', background:`${paleta.texto}06`, borderRadius:'2px' }}/>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HÁBITOS ── */}
        {modo === 'habitos' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'140px repeat(31,1fr)', gap:'3px', alignItems:'center' }}>
              {/* Header días */}
              <div style={{ fontSize:'8px', fontWeight:700, color:paleta.acento }}>HÁBITO</div>
              {[...Array(31)].map((_,i) => (
                <div key={i} style={{ textAlign:'center', fontSize:'7px', fontWeight:700, color:paleta.acento }}>{i+1}</div>
              ))}

              {/* Filas hábitos */}
              {['🏃 Ejercicio','💧 Agua (2L)','📚 Lectura','🧘 Meditación','🥗 Dieta sana','😴 Dormir 8h','📵 Sin pantallas','💪 Fuerza','✍️ Escritura','🎯 Meta diaria'].map((hab, i) => (
                <>
                  <div key={`hab-${i}`} style={{ fontSize:'9px', fontWeight:600, color:paleta.texto, paddingRight:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{hab}</div>
                  {[...Array(31)].map((_,j) => (
                    <div key={`cell-${i}-${j}`} style={{ width:'14px', height:'14px', borderRadius:'3px', border:`1.5px solid ${paleta.acento}40`, margin:'1px auto' }}/>
                  ))}
                </>
              ))}
            </div>

            {/* Leyenda */}
            <div style={{ display:'flex', gap:'16px', padding:'10px 14px', background:`${paleta.header}08`, borderRadius:'8px' }}>
              <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento }}>LEYENDA:</div>
              {[{ color:paleta.acento, label:'Completado' },{ color:'#f59e0b', label:'Parcial' },{ color:'transparent', label:'No realizado' }].map((l, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                  <div style={{ width:'12px', height:'12px', borderRadius:'2px', background:l.color, border:`1.5px solid ${paleta.acento}60` }}/>
                  <div style={{ fontSize:'9px', color:paleta.texto }}>{l.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}