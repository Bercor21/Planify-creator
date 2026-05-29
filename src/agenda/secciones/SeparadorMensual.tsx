/* eslint-disable */
import { AgendaConfig } from '../types'
import { MESES } from '../../constants'

export default function SeparadorMensual({ config, mesIndex }: {
  config:   AgendaConfig
  mesIndex: number           // 0 = Enero … 11 = Diciembre
}) {
  const { paleta, fuente, anio, imagenFondoInterno, opacidadFondo } = config
  const nombreMes = MESES[mesIndex]

  return (
    <div style={{
      width:'100%', minHeight:'100vh',
      background:`linear-gradient(145deg, ${paleta.header}, ${paleta.acento})`,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      position:'relative', fontFamily:fuente,
      pageBreakAfter:'always', overflow:'hidden',
    }}>
      {/* Marca de agua si existe */}
      {imagenFondoInterno && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url('${imagenFondoInterno}')`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity: opacidadFondo * 0.5,
        }}/>
      )}

      {/* Círculo decorativo grande */}
      <div style={{
        position:'absolute', width:'400px', height:'400px', borderRadius:'50%',
        border:'1px solid rgba(255,255,255,0.12)', top:'-100px', right:'-100px',
      }}/>
      <div style={{
        position:'absolute', width:'250px', height:'250px', borderRadius:'50%',
        border:'1px solid rgba(255,255,255,0.08)', bottom:'-50px', left:'-50px',
      }}/>

      {/* Número del mes */}
      <div style={{
        position:'absolute', fontSize:'200px', fontWeight:900,
        color:'rgba(255,255,255,0.06)', letterSpacing:'-10px',
        userSelect:'none', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)', whiteSpace:'nowrap',
      }}>
        {String(mesIndex + 1).padStart(2, '0')}
      </div>

      {/* Contenido central */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', padding:'40px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.6)', letterSpacing:'5px', marginBottom:'16px' }}>
          {anio}
        </div>
        <div style={{ fontSize:'72px', fontWeight:900, color:'white', letterSpacing:'4px', textShadow:'0 4px 20px rgba(0,0,0,0.3)', marginBottom:'16px' }}>
          {nombreMes.toUpperCase()}
        </div>
        <div style={{ width:'60px', height:'3px', background:'rgba(255,255,255,0.6)', margin:'0 auto', borderRadius:'2px' }}/>
      </div>

      {/* Líneas decorativas laterales */}
      <div style={{ position:'absolute', left:'40px', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:'6px' }}>
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{ width:`${20 - i*3}px`, height:'2px', background:`rgba(255,255,255,${0.4 - i*0.06})`, borderRadius:'1px' }}/>
        ))}
      </div>
      <div style={{ position:'absolute', right:'40px', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:'6px', alignItems:'flex-end' }}>
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{ width:`${20 - i*3}px`, height:'2px', background:`rgba(255,255,255,${0.4 - i*0.06})`, borderRadius:'1px' }}/>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position:'absolute', bottom:'32px', fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:'3px' }}>
        {config.titulo.toUpperCase()}
      </div>
    </div>
  )
}