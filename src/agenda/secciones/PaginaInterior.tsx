/* eslint-disable */
import { AgendaConfig } from '../types'

export default function PaginaInterior({ config, esContraportada = false }: {
  config: AgendaConfig
  esContraportada?: boolean
}) {
  const { paleta, fuente, imagenFondoInterno, opacidadFondo } = config

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      display:'flex', flexDirection:'column', position:'relative',
      fontFamily:fuente, pageBreakAfter:'always', overflow:'hidden',
    }}>
      {/* Marca de agua */}
      {imagenFondoInterno && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url('${imagenFondoInterno}')`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity: opacidadFondo, pointerEvents:'none',
        }}/>
      )}

      {/* Patrón sutil si no hay imagen */}
      {!imagenFondoInterno && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`radial-gradient(${paleta.acento}15 1px, transparent 1px)`,
          backgroundSize:'24px 24px',
        }}/>
      )}

      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', padding:'48px' }}>
        {!esContraportada ? (
          <>
            <div style={{ height:'5px', background:`linear-gradient(90deg,${paleta.header},${paleta.acento})`, borderRadius:'3px', marginBottom:'32px' }}/>
            <div style={{ fontSize:'11px', fontWeight:700, color:paleta.acento, letterSpacing:'3px', marginBottom:'32px' }}>
              {config.anio} · {config.titulo.toUpperCase()}
            </div>

            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:paleta.header, letterSpacing:'1px', marginBottom:'20px', textTransform:'uppercase' }}>
                Notas personales
              </div>
              {[...Array(16)].map((_,i) => (
                <div key={i} style={{ height:'30px', borderBottom:`1px solid ${paleta.texto}15`, marginBottom:'2px' }}/>
              ))}
            </div>

            {/* Cita inspiracional sin marca */}
            <div style={{ marginTop:'32px', padding:'18px 20px', borderLeft:`4px solid ${paleta.acento}`, background:`${paleta.acento}08`, borderRadius:'0 8px 8px 0' }}>
              <div style={{ fontSize:'12px', fontStyle:'italic', color:paleta.texto, lineHeight:1.7 }}>
                "La planificación no es sobre el futuro, es sobre las decisiones que tomamos hoy."
              </div>
            </div>
          </>
        ) : (
          // Interna contraportada — limpia, sin branding
          <>
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:paleta.header, letterSpacing:'1px', marginBottom:'20px', textTransform:'uppercase' }}>
                Notas finales
              </div>
              {[...Array(20)].map((_,i) => (
                <div key={i} style={{ height:'30px', borderBottom:`1px solid ${paleta.texto}15`, marginBottom:'2px' }}/>
              ))}
            </div>
            <div style={{ height:'5px', background:`linear-gradient(90deg,${paleta.acento},${paleta.header})`, borderRadius:'3px' }}/>
          </>
        )}
      </div>
    </div>
  )
}