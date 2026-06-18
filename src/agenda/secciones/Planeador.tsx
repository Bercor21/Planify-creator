/* eslint-disable */
import { AgendaConfig } from '../types'
import { getDias } from '../../utils'
import { MESES, DIAS } from '../../constants'

type Modo = 'mensual' | 'semanal' | 'diario'

export default function Planeador({ config, modo, mesIndex = 0 }: {
  config:   AgendaConfig
  modo:     Modo
  mesIndex?: number
}) {
  const { paleta, fuente, anio } = config
  const nombreMes = MESES[mesIndex]
  const horas = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
  const semana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

  const headerLabel =
    modo === 'mensual' ? `${nombreMes.toUpperCase()} ${anio}` :
    modo === 'semanal' ? `SEMANA · ${nombreMes.toUpperCase()}` :
    `DÍA · ${nombreMes.toUpperCase()}`

  const headerIcon = modo === 'mensual' ? '📆' : modo === 'semanal' ? '🗓️' : '📋'

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:'3px', marginBottom:'3px' }}>
            {modo === 'mensual' ? 'PLANEADOR MENSUAL' : modo === 'semanal' ? 'PLANEADOR SEMANAL' : 'PLANEADOR DIARIO'}
          </div>
          <div style={{ fontSize:'18px', fontWeight:800, color:'white', letterSpacing:'2px' }}>{headerLabel}</div>
        </div>
        <div style={{ fontSize:'24px' }}>{headerIcon}</div>
      </div>

      <div style={{ flex:1, padding:'16px 24px', display:'flex', flexDirection:'column', gap:'12px' }}>

        {/* ── MENSUAL ── */}
        {modo === 'mensual' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', marginBottom:'4px' }}>
              {DIAS.map(d => (
                <div key={d} style={{ textAlign:'center', padding:'6px', fontSize:'10px', fontWeight:700, color:paleta.acento }}>{d}</div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', flex:1 }}>
              {getDias(anio, mesIndex).map((dia, i) => {
                const isHoy = dia === new Date().getDate() && mesIndex === new Date().getMonth() && anio === new Date().getFullYear()
                return (
                  <div key={i} style={{
                    minHeight:'60px', padding:'5px',
                    background: !dia ? 'transparent' : isHoy ? `${paleta.acento}18` : `${paleta.header}06`,
                    borderRadius:'8px',
                    border: isHoy ? `1.5px solid ${paleta.acento}88` : `1px solid ${paleta.acento}15`,
                    opacity: !dia ? 0 : 1,
                  }}>
                    {dia && (
                      <>
                        <div style={{ fontSize:'11px', fontWeight:700, color:isHoy?paleta.acento:paleta.texto, marginBottom:'3px' }}>{dia}</div>
                        {[...Array(2)].map((_,j) => <div key={j} style={{ height:'8px', borderRadius:'2px', background:`${paleta.texto}08`, marginBottom:'2px' }}/>)}
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Metas del mes */}
            <div style={{ padding:'12px 16px', background:`${paleta.header}08`, borderRadius:'10px', border:`1px solid ${paleta.acento}22` }}>
              <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, letterSpacing:'2px', marginBottom:'8px' }}>🎯 METAS DEL MES</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                {[...Array(4)].map((_,i) => (
                  <div key={i} style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                    <div style={{ width:'12px', height:'12px', borderRadius:'3px', border:`1.5px solid ${paleta.acento}66`, flexShrink:0 }}/>
                    <div style={{ flex:1, height:'14px', borderBottom:`1px solid ${paleta.texto}15` }}/>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── SEMANAL ── */}
        {modo === 'semanal' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'56px repeat(7,1fr)', gap:'4px', marginBottom:'4px' }}>
              <div/>
              {semana.map(d => (
                <div key={d} style={{ textAlign:'center', padding:'8px 4px', background:`${paleta.header}12`, borderRadius:'8px', fontSize:'10px', fontWeight:700, color:paleta.header }}>
                  {d.slice(0,3).toUpperCase()}
                </div>
              ))}
            </div>
            <div style={{ flex:1, overflow:'hidden' }}>
              {horas.slice(0,12).map(hora => (
                <div key={hora} style={{ display:'grid', gridTemplateColumns:'56px repeat(7,1fr)', gap:'4px', marginBottom:'2px' }}>
                  <div style={{ fontSize:'8px', color:paleta.acento, fontWeight:600, textAlign:'right', paddingRight:'8px', paddingTop:'5px' }}>{hora}</div>
                  {semana.map(d => <div key={d} style={{ height:'26px', border:`1px solid ${paleta.texto}10`, borderRadius:'5px' }}/>)}
                </div>
              ))}
            </div>

            {/* Panel inferior */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
              {['📌 Prioridades','📝 Tareas','💡 Ideas','✅ Logros'].map(s => (
                <div key={s} style={{ padding:'8px 10px', background:`${paleta.header}08`, borderRadius:'8px', border:`1px solid ${paleta.acento}15` }}>
                  <div style={{ fontSize:'8px', fontWeight:700, color:paleta.header, marginBottom:'6px', letterSpacing:'0.5px' }}>{s}</div>
                  {[...Array(3)].map((_,i) => <div key={i} style={{ height:'14px', borderBottom:`1px solid ${paleta.texto}10`, marginBottom:'4px' }}/>)}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── DIARIO ── */}
        {modo === 'diario' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 190px', gap:'16px', flex:1 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {/* Fecha + clima */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
                <div>
                  <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, letterSpacing:'2px' }}>{nombreMes.toUpperCase()} {anio}</div>
                  <div style={{ fontSize:'22px', fontWeight:800, color:paleta.header }}>____ de {nombreMes}</div>
                </div>
                <div style={{ display:'flex', gap:'4px' }}>
                  {['☀️','⛅','🌧️','❄️'].map(e => (
                    <div key={e} style={{ width:'26px', height:'26px', borderRadius:'50%', background:`${paleta.header}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px' }}>{e}</div>
                  ))}
                </div>
              </div>

              {/* Horario */}
              <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, letterSpacing:'2px', marginBottom:'4px' }}>HORARIO DEL DÍA</div>
              {horas.map(hora => (
                <div key={hora} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  <div style={{ fontSize:'8px', color:paleta.acento, fontWeight:600, minWidth:'36px' }}>{hora}</div>
                  <div style={{ flex:1, height:'22px', border:`1px solid ${paleta.texto}12`, borderRadius:'5px', background:`${paleta.header}03` }}/>
                </div>
              ))}
            </div>

            {/* Panel lateral */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {['🎯 Prioridades del día','📝 Lista de tareas','💡 Ideas / Notas','🙏 Gratitud'].map((s,i) => (
                <div key={i} style={{ padding:'10px 12px', background:`${paleta.header}08`, borderRadius:'10px', border:`1px solid ${paleta.acento}18` }}>
                  <div style={{ fontSize:'9px', fontWeight:700, color:paleta.header, marginBottom:'8px' }}>{s}</div>
                  {[...Array(i===0?3:4)].map((_,j) => (
                    <div key={j} style={{ display:'flex', gap:'5px', alignItems:'center', marginBottom:'5px' }}>
                      {i < 2 && <div style={{ width:'10px', height:'10px', borderRadius:'2px', border:`1.5px solid ${paleta.acento}66`, flexShrink:0 }}/>}
                      <div style={{ flex:1, height:'12px', borderBottom:`1px solid ${paleta.texto}12` }}/>
                    </div>
                  ))}
                </div>
              ))}

              {/* Reflexión */}
              <div style={{ padding:'10px 12px', background:`${paleta.acento}10`, borderRadius:'10px', border:`1px solid ${paleta.acento}33`, flex:1 }}>
                <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, marginBottom:'8px' }}>✨ REFLEXIÓN</div>
                {[...Array(4)].map((_,i) => <div key={i} style={{ height:'14px', borderBottom:`1px solid ${paleta.texto}12`, marginBottom:'6px' }}/>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}