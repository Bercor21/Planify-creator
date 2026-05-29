/* eslint-disable */
import { AgendaConfig } from '../types'

export default function BolsilloInterno({ config }: { config: AgendaConfig }) {
  const { paleta, fuente } = config

  return (
    <div style={{
      width:'100%', minHeight:'100vh', background:paleta.fondo,
      fontFamily:fuente, pageBreakAfter:'always',
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${paleta.header},${paleta.acento})`, padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:'3px', marginBottom:'3px' }}>ALMACENAMIENTO</div>
          <div style={{ fontSize:'20px', fontWeight:800, color:'white', letterSpacing:'2px' }}>BOLSILLO INTERNO</div>
        </div>
        <div style={{ fontSize:'24px' }}>🗃️</div>
      </div>

      <div style={{ flex:1, padding:'24px 32px', display:'flex', flexDirection:'column', gap:'16px' }}>

        {/* Instrucciones */}
        <div style={{ padding:'12px 16px', background:`${paleta.acento}10`, borderRadius:'10px', border:`1px dashed ${paleta.acento}50`, display:'flex', gap:'10px', alignItems:'flex-start' }}>
          <div style={{ fontSize:'18px' }}>✂️</div>
          <div>
            <div style={{ fontSize:'10px', fontWeight:700, color:paleta.acento, letterSpacing:'1px', marginBottom:'3px' }}>INSTRUCCIONES DE DOBLADO</div>
            <div style={{ fontSize:'10px', color:paleta.texto, opacity:0.7, lineHeight:1.6 }}>
              Dobla esta página por las líneas punteadas para crear un bolsillo. Pégala en la contraportada interior para guardar tarjetas, recibos o documentos pequeños.
            </div>
          </div>
        </div>

        {/* Bolsillo principal */}
        <div style={{ flex:1, display:'flex', gap:'16px' }}>

          {/* Bolsillo grande */}
          <div style={{ flex:2, border:`2px dashed ${paleta.acento}60`, borderRadius:'12px', padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`${paleta.header}04`, position:'relative', minHeight:'300px' }}>
            {/* Marcas de corte */}
            {[{ top:0, left:0 },{ top:0, right:0 },{ bottom:0, left:0 },{ bottom:0, right:0 }].map((pos, i) => (
              <div key={i} style={{
                position:'absolute', ...pos,
                width:'16px', height:'16px',
                borderTop: (pos as any).top === 0 ? `2px solid ${paleta.acento}` : undefined,
                borderBottom: (pos as any).bottom === 0 ? `2px solid ${paleta.acento}` : undefined,
                borderLeft: (pos as any).left === 0 ? `2px solid ${paleta.acento}` : undefined,
                borderRight: (pos as any).right === 0 ? `2px solid ${paleta.acento}` : undefined,
              }}/>
            ))}

            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px', opacity:0.3 }}>📁</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:paleta.acento, letterSpacing:'2px', marginBottom:'4px' }}>BOLSILLO PRINCIPAL</div>
              <div style={{ fontSize:'10px', color:paleta.texto, opacity:0.5 }}>Tarjetas · Fotos · Recibos</div>
            </div>

            {/* Línea de doblez */}
            <div style={{ position:'absolute', bottom:'40px', left:'10%', right:'10%', borderBottom:`2px dashed ${paleta.acento}40` }}/>
            <div style={{ position:'absolute', bottom:'44px', left:'50%', transform:'translateX(-50%)', fontSize:'8px', color:paleta.acento, fontWeight:700, letterSpacing:'1px', background:paleta.fondo, padding:'0 6px' }}>DOBLAR AQUÍ</div>
          </div>

          {/* Bolsillos pequeños */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'12px' }}>
            {['Tarjetas de presentación','Notas adhesivas','Tickets / Recibos'].map((label, i) => (
              <div key={i} style={{ flex:1, border:`2px dashed ${paleta.acento}40`, borderRadius:'10px', padding:'14px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`${paleta.header}04` }}>
                <div style={{ fontSize:'22px', marginBottom:'6px', opacity:0.3 }}>
                  {['🪪','📌','🧾'][i]}
                </div>
                <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, textAlign:'center', letterSpacing:'0.5px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas del bolsillo */}
        <div style={{ padding:'12px 16px', background:`${paleta.header}08`, borderRadius:'10px', border:`1px solid ${paleta.acento}20` }}>
          <div style={{ fontSize:'9px', fontWeight:700, color:paleta.acento, letterSpacing:'1px', marginBottom:'8px' }}>📌 CONTENIDO GUARDADO</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                <div style={{ width:'10px', height:'10px', borderRadius:'2px', border:`1.5px solid ${paleta.acento}50`, flexShrink:0 }}/>
                <div style={{ flex:1, height:'13px', borderBottom:`1px solid ${paleta.texto}15` }}/>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}