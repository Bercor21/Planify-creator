/* eslint-disable */
import { AgendaConfig } from '../types'

export default function Indice({ config }: { config: AgendaConfig }) {
  const { paleta, fuente } = config

  const secciones = [
    { num:'01', nombre:'Portada',                  icono:'📕' },
    { num:'02', nombre:'Datos Personales',         icono:'👤' },
    { num:'03', nombre:'Índice',                   icono:'📋' },
    { num:'04', nombre:'Calendario Anual',         icono:'📅' },
    { num:'05', nombre:'Separadores Mensuales',    icono:'🗂️' },
    { num:'06', nombre:'Planeadores Mensuales',    icono:'📆' },
    { num:'07', nombre:'Planeadores Semanales',    icono:'🗓️' },
    ...(config.incluirDiario    ? [{ num:'08', nombre:'Planeadores Diarios',    icono:'📋' }] : []),
    { num:'09', nombre:'Sección de Notas',         icono:'📝' },
    { num:'10', nombre:'Sección de Tareas',        icono:'✅' },
    ...(config.incluirContactos ? [{ num:'11', nombre:'Directorio de Contactos', icono:'📞' }] : []),
    ...(config.incluirFinanciera? [{ num:'12', nombre:'Sección Financiera',      icono:'💰' }] : []),
    ...(config.incluirHabitos   ? [{ num:'13', nombre:'Seguimiento de Hábitos',  icono:'🔥' }] : []),
    { num:'14', nombre:'Hojas Finales',            icono:'📄' },
    ...(config.incluirBolsillo  ? [{ num:'15', nombre:'Bolsillo Interno',        icono:'🗃️' }] : []),
    { num:'16', nombre:'Contraportada',            icono:'📗' },
  ]

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'28px 40px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'3px', marginBottom:'4px' }}>CONTENIDO</div>
          <div style={{ fontSize:'24px', fontWeight:800, color:'white', letterSpacing:'2px' }}>ÍNDICE</div>
        </div>
        <div style={{ fontSize:'28px' }}>📋</div>
      </div>

      <div style={{ flex:1, padding:'32px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          {secciones.map((sec, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:'12px',
              padding:'10px 14px', borderRadius:'8px',
              background: i % 2 === 0 ? `${paleta.header}06` : 'transparent',
              border:`1px solid ${paleta.acento}15`,
              transition:'all 0.15s',
            }}>
              <div style={{
                width:'32px', height:'32px', borderRadius:'8px',
                background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'14px', flexShrink:0,
              }}>
                {sec.icono}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'10px', fontWeight:800, color:paleta.acento, letterSpacing:'1px', marginBottom:'2px' }}>{sec.num}</div>
                <div style={{ fontSize:'12px', fontWeight:600, color:paleta.texto }}>{sec.nombre}</div>
              </div>
              <div style={{ display:'flex', gap:'2px' }}>
                {[...Array(8)].map((_,j) => (
                  <div key={j} style={{ width:'4px', height:'1px', background:`${paleta.texto}25` }}/>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer del índice */}
        <div style={{ marginTop:'24px', padding:'14px 20px', background:`${paleta.acento}10`, borderRadius:'10px', border:`1px solid ${paleta.acento}33`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:'10px', fontWeight:700, color:paleta.acento, letterSpacing:'1px' }}>{config.titulo.toUpperCase()}</div>
            <div style={{ fontSize:'9px', color:paleta.texto, opacity:0.6 }}>{config.anio} · {secciones.length} secciones</div>
          </div>
          <div style={{ fontSize:'20px' }}>📚</div>
        </div>
      </div>
    </div>
  )
}