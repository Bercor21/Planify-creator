/* eslint-disable */
import { AgendaConfig } from '../types'

export default function HojasFinales({ config, numero = 1, mostrarMarca = false }: {
  config:       AgendaConfig
  numero?:      number
  mostrarMarca?: boolean   // solo true en la última hoja final
}) {
  const { paleta, fuente, imagenFondoInterno, opacidadFondo } = config

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column', position:'relative',
    }}>
      {imagenFondoInterno && (
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url('${imagenFondoInterno}')`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity: opacidadFondo, pointerEvents:'none',
        }}/>
      )}
      {!imagenFondoInterno && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`radial-gradient(${paleta.acento}10 1px, transparent 1px)`,
          backgroundSize:'20px 20px',
        }}/>
      )}

      {/* Header minimalista */}
      <div style={{ position:'relative', zIndex:1, padding:'16px 32px', borderBottom:`2px solid ${paleta.acento}18`, display:'flex', justifyContent:'flex-end' }}>
        <div style={{ fontSize:'10px', color:paleta.texto, opacity:0.35 }}>{numero}</div>
      </div>

      {/* Líneas */}
      <div style={{ position:'relative', zIndex:1, flex:1, padding:'16px 32px 20px' }}>
        {[...Array(30)].map((_,i) => (
          <div key={i} style={{
            height:'28px',
            borderBottom:`1px solid ${paleta.texto}${i % 5 === 4 ? '22' : '10'}`,
          }}/>
        ))}
      </div>

      {/* Footer — solo muestra marca en la última hoja */}
      <div style={{ position:'relative', zIndex:1, padding:'12px 32px', borderTop:`1px solid ${paleta.acento}12`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {mostrarMarca ? (
          <div style={{ fontSize:'9px', color:paleta.texto, opacity:0.25, letterSpacing:'2px', fontWeight:600 }}>
            PLANIFY CREATOR
          </div>
        ) : <div/>}
        <div style={{ width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${paleta.acento}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:paleta.acento, opacity:0.5 }}>
          {numero}
        </div>
      </div>
    </div>
  )
}