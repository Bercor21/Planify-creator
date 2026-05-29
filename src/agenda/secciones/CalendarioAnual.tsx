/* eslint-disable */
import { AgendaConfig } from '../types'
import { getDias } from '../../utils'
import { MESES, DIAS } from '../../constants'

export default function CalendarioAnual({ config }: { config: AgendaConfig }) {
  const { paleta, fuente, anio } = config

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'24px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'3px', marginBottom:'4px' }}>VISTA COMPLETA</div>
          <div style={{ fontSize:'22px', fontWeight:800, color:'white', letterSpacing:'2px' }}>CALENDARIO {anio}</div>
        </div>
        <div style={{ fontSize:'28px' }}>📅</div>
      </div>

      {/* Grid 4x3 */}
      <div style={{ flex:1, padding:'20px 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
        {MESES.map((nombreMes, idx) => {
          const dias = getDias(anio, idx)
          const hoy  = new Date()

          return (
            <div key={idx} style={{
              background: paleta.fondo === '#0f172a' ? '#1e293b' : 'white',
              borderRadius:'10px', overflow:'hidden',
              border:`1px solid ${paleta.acento}22`,
              boxShadow:`0 2px 8px rgba(0,0,0,0.06)`,
            }}>
              {/* Cabecera mes */}
              <div style={{ background:`linear-gradient(135deg,${paleta.header}dd,${paleta.acento}99)`, padding:'8px 10px' }}>
                <div style={{ fontSize:'10px', fontWeight:800, color:'white', letterSpacing:'1px' }}>{nombreMes.toUpperCase()}</div>
              </div>

              <div style={{ padding:'6px 8px' }}>
                {/* Días semana */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'3px' }}>
                  {DIAS.map(d => (
                    <div key={d} style={{ textAlign:'center', fontSize:'6px', fontWeight:700, color:paleta.acento }}>{d}</div>
                  ))}
                </div>

                {/* Celdas */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px' }}>
                  {dias.map((dia, i) => {
                    const isHoy = dia === hoy.getDate() && idx === hoy.getMonth() && anio === hoy.getFullYear()
                    const esDom = i % 7 === 6
                    return (
                      <div key={i} style={{
                        textAlign:'center', fontSize:'7px',
                        color: !dia ? 'transparent' : isHoy ? 'white' : esDom ? paleta.acento : paleta.texto,
                        background: isHoy ? paleta.acento : 'transparent',
                        borderRadius:'50%', width:'12px', height:'12px',
                        margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight: isHoy ? 700 : 400,
                      }}>
                        {dia}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Notas anuales */}
      <div style={{ padding:'0 24px 20px' }}>
        <div style={{ padding:'14px 20px', background:`${paleta.header}08`, borderRadius:'10px', border:`1px solid ${paleta.acento}22` }}>
          <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, letterSpacing:'2px', marginBottom:'8px' }}>📌 FECHAS IMPORTANTES DEL AÑO</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                <div style={{ width:'36px', height:'16px', borderRadius:'4px', background:`${paleta.acento}22`, fontSize:'7px', color:paleta.acento, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, flexShrink:0 }}>MES</div>
                <div style={{ flex:1, height:'16px', borderBottom:`1px solid ${paleta.texto}18` }}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}