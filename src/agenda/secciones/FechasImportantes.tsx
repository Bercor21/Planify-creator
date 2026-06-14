/* eslint-disable */
import { AgendaConfig } from '../types'

const MESES_LISTA = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const FERIADOS_CR: Record<string, string> = {
  '0-1':'Año Nuevo 🎆',
  '3-11':'Juan Santamaría 🥁',
  '4-1':'Día del Trabajo 👷',
  '6-25':'Anexión de Nicoya 🇨🇷',
  '7-2':'Virgen de los Ángeles ✨',
  '7-15':'Día de la Madre 💐',
  '8-15':'Independencia 🇨🇷',
  '9-12':'Día de las Culturas 🌎',
  '11-24':'Nochebuena 🎄',
  '11-25':'Navidad 🎁',
}

function FechasImportantes({ config }: { config: AgendaConfig }) {
  const { paleta, fuente, anio } = config

  return (
    <div data-section="fechas" style={{
      width: '100%',
      minHeight: '100vh',
      background: 'white',
      fontFamily: fuente,
      padding: '28px 32px',
      boxSizing: 'border-box',
      pageBreakAfter: 'always',
    }}>
      <div style={{ textAlign:'center', marginBottom:'20px', borderBottom:`2px solid ${paleta.acento}33`, paddingBottom:'12px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:paleta.acento, letterSpacing:'3px', marginBottom:'4px' }}>{anio}</div>
        <div style={{ fontSize:'24px', fontWeight:900, color:paleta.header, letterSpacing:'2px' }}>FECHAS IMPORTANTES</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
        {MESES_LISTA.map((mes, idx) => {
          const feriadosMes = Object.entries(FERIADOS_CR)
            .filter(([k]) => k.startsWith(idx + '-'))
            .map(([, v]) => v)

          return (
            <div key={idx} style={{ border:`1px solid ${paleta.acento}22`, borderRadius:'10px', padding:'10px', minHeight:'110px' }}>
              <div style={{ fontSize:'10px', fontWeight:800, color:paleta.header, letterSpacing:'1px', marginBottom:'8px', background:`${paleta.acento}12`, padding:'3px 8px', borderRadius:'4px' }}>
                {mes.toUpperCase()}
              </div>
              {feriadosMes.map((f, i) => (
                <div key={i} style={{ fontSize:'8px', color:paleta.acento, marginBottom:'3px' }}>• {f}</div>
              ))}
              {[0,1,2].map((i) => (
                <div key={i} style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'4px', marginTop: i===0 && feriadosMes.length>0 ? '6px' : '0' }}>
                  <div style={{ width:'10px', height:'10px', borderRadius:'2px', border:`1px solid ${paleta.acento}44`, flexShrink:0 }}/>
                  <div style={{ flex:1, height:'1px', background:`${paleta.texto}15` }}/>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div style={{ textAlign:'center', marginTop:'14px', fontSize:'9px', color:`${paleta.texto}44` }}>
        Feriados nacionales de Costa Rica marcados · Agregá tus fechas personales
      </div>
    </div>
  )
}

export default FechasImportantes