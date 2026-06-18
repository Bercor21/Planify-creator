/* eslint-disable */
import { AgendaConfig } from '../types'

export default function HojaPresentacion({ config }: { config: AgendaConfig }) {
  const { paleta, fuente } = config

  const campos = [
    { label:'NOMBRE COMPLETO',     span:2 },
    { label:'TELÉFONO',            span:1 },
    { label:'CORREO ELECTRÓNICO',  span:1 },
    { label:'DIRECCIÓN',           span:2 },
    { label:'CIUDAD / PAÍS',       span:1 },
    { label:'FECHA DE INICIO',     span:1 },
    { label:'OCUPACIÓN',           span:1 },
    { label:'EMPRESA / INSTITUCIÓN', span:1 },
  ]

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'32px 40px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'3px', marginBottom:'6px' }}>DATOS PERSONALES</div>
          <div style={{ fontSize:'22px', fontWeight:800, color:'white', letterSpacing:'2px' }}>{config.titulo.toUpperCase()}</div>
        </div>
        <div style={{ fontSize:'32px' }}>👤</div>
      </div>

      <div style={{ flex:1, padding:'32px 40px', display:'flex', flexDirection:'column', gap:'24px' }}>

        {/* Aviso si encuentras */}
        <div style={{ padding:'16px 20px', background:`${paleta.acento}10`, borderRadius:'10px', border:`1px dashed ${paleta.acento}55`, textAlign:'center' }}>
          <div style={{ fontSize:'11px', fontWeight:800, color:paleta.acento, letterSpacing:'2px', marginBottom:'4px' }}>🔍 SI ENCUENTRAS ESTA AGENDA</div>
          <div style={{ fontSize:'10px', color:paleta.texto, opacity:0.7 }}>Por favor devuélvela — ¡te lo agradeceré mucho!</div>
        </div>

        {/* Foto + campos */}
        <div style={{ display:'flex', gap:'24px', alignItems:'flex-start' }}>

          {/* Espacio foto */}
          <div style={{ flexShrink:0, width:'100px', height:'120px', border:`2px dashed ${paleta.acento}55`, borderRadius:'10px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`${paleta.acento}08` }}>
            <div style={{ fontSize:'28px', marginBottom:'4px' }}>📷</div>
            <div style={{ fontSize:'8px', color:paleta.acento, fontWeight:700, letterSpacing:'1px' }}>FOTO</div>
          </div>

          {/* Campos personales */}
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {campos.map((campo, i) => (
              <div key={i} style={{ gridColumn:`span ${campo.span}` }}>
                <div style={{ fontSize:'8px', fontWeight:800, color:paleta.acento, letterSpacing:'1.5px', marginBottom:'5px' }}>{campo.label}</div>
                <div style={{ height:'30px', borderBottom:`1.5px solid ${paleta.texto}25`, background:`${paleta.header}04`, borderRadius:'4px 4px 0 0' }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Redes sociales */}
        <div>
          <div style={{ fontSize:'9px', fontWeight:800, color:paleta.acento, letterSpacing:'2px', marginBottom:'10px' }}>REDES SOCIALES</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
            {['📱 Instagram','💼 LinkedIn','🐦 Twitter / X'].map((red, i) => (
              <div key={i}>
                <div style={{ fontSize:'9px', color:paleta.texto, opacity:0.7, marginBottom:'5px' }}>{red}</div>
                <div style={{ height:'26px', borderBottom:`1px solid ${paleta.texto}20` }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Recompensa */}
        <div>
          <div style={{ fontSize:'9px', fontWeight:800, color:paleta.acento, letterSpacing:'2px', marginBottom:'10px' }}>💰 RECOMPENSA / NOTA ADICIONAL</div>
          {[...Array(3)].map((_,i) => (
            <div key={i} style={{ height:'26px', borderBottom:`1px solid ${paleta.texto}15`, marginBottom:'4px' }}/>
          ))}
        </div>

        {/* Firma */}
        <div style={{ marginTop:'auto', display:'flex', justifyContent:'flex-end' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:'160px', height:'40px', borderBottom:`1.5px solid ${paleta.texto}30`, marginBottom:'6px' }}/>
            <div style={{ fontSize:'8px', color:paleta.texto, opacity:0.5, letterSpacing:'1px' }}>FIRMA</div>
          </div>
        </div>

      </div>
    </div>
  )
}