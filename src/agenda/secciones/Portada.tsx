/* eslint-disable */
import { useState, useRef } from 'react'
import { AgendaConfig } from '../types'

export default function Portada({ config, esContraportada = false, onUpdateConfig, preview = false }: {
  config:           AgendaConfig
  esContraportada?: boolean
  onUpdateConfig?:  (updates: Partial<AgendaConfig>) => void
  preview?:         boolean   // true = llena el contenedor padre | false = 100vh (impresión)
}) {
  const color  = esContraportada ? config.colorContraportada : config.colorPortada
  const imagen = esContraportada ? config.imagenContraportada : config.imagenPortada
  const texto  = esContraportada ? config.textoContraportada  : config.textoPortada

  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const bgStyle: any = imagen
    ? { backgroundImage:`url('${imagen}')`, backgroundSize:'cover', backgroundPosition:'center' }
    : { background:`linear-gradient(145deg, ${color}ff, ${color}bb)` }

  const textColor   = imagen ? 'white' : config.paleta.header
  const accentColor = imagen ? 'rgba(255,255,255,0.9)' : config.paleta.acento
  const shadowText  = '0 2px 12px rgba(0,0,0,0.5)'

  function handleLogoMouseDown(e: React.MouseEvent) {
    if (!onUpdateConfig) return
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)

    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    function onMove(ev: MouseEvent) {
      const x = Math.min(90, Math.max(0, ((ev.clientX - rect.left)  / rect.width)  * 100))
      const y = Math.min(90, Math.max(0, ((ev.clientY - rect.top)   / rect.height) * 100))
      onUpdateConfig!({ logoX: x, logoY: y })
    }
    function onUp() {
      setDragging(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }

  return (
    <div
      ref={containerRef}
      style={{
        width:'100%',
        // preview mode: llena el contenedor padre (aspect-ratio box)
        // print mode:   mínimo una hoja completa
        ...(preview ? { height:'100%' } : { minHeight:'100vh', pageBreakAfter:'always' }),
        ...bgStyle,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        position:'relative', fontFamily:config.fuente,
        overflow:'hidden', userSelect:'none',
      }}
    >
      {/* Overlay oscuro */}
      {imagen && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.38)' }}/>}

      {/* Esquinas decorativas */}
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div key={pos} style={{
          position:'absolute',
          top:    pos.startsWith('t') ? '5%'  : undefined,
          bottom: pos.startsWith('b') ? '5%'  : undefined,
          left:   pos.endsWith('l')   ? '5%'  : undefined,
          right:  pos.endsWith('r')   ? '5%'  : undefined,
          width:'7%', height:'7%',
          borderTop:    pos.startsWith('t') ? `2px solid ${accentColor}` : undefined,
          borderBottom: pos.startsWith('b') ? `2px solid ${accentColor}` : undefined,
          borderLeft:   pos.endsWith('l')   ? `2px solid ${accentColor}` : undefined,
          borderRight:  pos.endsWith('r')   ? `2px solid ${accentColor}` : undefined,
          zIndex:2,
        }}/>
      ))}

      {/* Logo draggable — posición en % del contenedor */}
      {config.imagenLogo && (
        <div
          onMouseDown={handleLogoMouseDown}
          style={{
            position:'absolute',
            left:`${config.logoX}%`, top:`${config.logoY}%`,
            width:`${preview ? config.logoSize * 0.4 : config.logoSize}px`,
            height:`${preview ? config.logoSize * 0.4 : config.logoSize}px`,
            borderRadius:'50%', overflow:'hidden',
            backgroundImage:`url('${config.imagenLogo}')`,
            backgroundSize:'cover', backgroundPosition:'center',
            opacity: config.logoOpacity,
            cursor: dragging ? 'grabbing' : (onUpdateConfig ? 'grab' : 'default'),
            zIndex:10,
            boxShadow:'0 4px 16px rgba(0,0,0,0.3)',
            border:'2px solid rgba(255,255,255,0.7)',
            transform:'translate(-50%,-50%)',
            transition: dragging ? 'none' : 'width 0.1s, height 0.1s',
          }}
        />
      )}

      {/* Contenido central */}
      <div style={{
        position:'relative', zIndex:1,
        textAlign:'center', padding:'8%',
        maxWidth:'80%', width:'100%',
      }}>
        {!esContraportada ? (
          <>
            <div style={{ width:'15%', height:'2px', background:accentColor, margin:'0 auto 6% auto', borderRadius:'2px' }}/>
            <div style={{
              fontSize: preview ? 'clamp(14px,4cqw,28px)' : 'clamp(28px,5vw,48px)',
              fontWeight:900, color:textColor, letterSpacing:'0.1em',
              marginBottom:'4%', textShadow:shadowText, lineHeight:1.1, wordBreak:'break-word',
            }}>
              {config.titulo.toUpperCase()}
            </div>
            {config.subtitulo && (
              <div style={{
                fontSize: preview ? 'clamp(8px,2cqw,14px)' : '14px',
                color:accentColor, fontWeight:400, marginBottom:'4%',
                letterSpacing:'0.2em', textShadow:shadowText,
              }}>
                {config.subtitulo.toUpperCase()}
              </div>
            )}
            <div style={{ width:'15%', height:'2px', background:accentColor, margin:'0 auto 6% auto', borderRadius:'2px' }}/>
            <div style={{
              fontSize: preview ? 'clamp(10px,3cqw,22px)' : '22px',
              fontWeight:700, color:textColor, letterSpacing:'0.2em', textShadow:shadowText,
              marginBottom: texto ? '4%' : '0',
            }}>
              {config.anio}
            </div>
            {texto && (
              <div style={{
                fontSize: preview ? 'clamp(7px,1.5cqw,13px)' : '13px',
                color:accentColor, marginTop:'4%', letterSpacing:'0.05em',
                lineHeight:1.6, textShadow:shadowText, whiteSpace:'pre-wrap', wordBreak:'break-word',
              }}>
                {texto}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: preview ? 'clamp(6px,1.2cqw,11px)' : '11px', fontWeight:700, color:accentColor, letterSpacing:'0.3em', marginBottom:'5%', textShadow:shadowText }}>
              {config.tipo?.toUpperCase()}
            </div>
            <div style={{
              fontSize: preview ? 'clamp(12px,3.5cqw,32px)' : '32px',
              fontWeight:800, color:textColor, letterSpacing:'0.15em',
              marginBottom:'4%', textShadow:shadowText, wordBreak:'break-word',
            }}>
              {config.titulo.toUpperCase()}
            </div>
            {config.subtitulo && (
              <div style={{ fontSize: preview ? 'clamp(7px,1.5cqw,13px)' : '13px', color:accentColor, marginBottom:'3%', letterSpacing:'0.15em', textShadow:shadowText }}>
                {config.subtitulo}
              </div>
            )}
            <div style={{ width:'10%', height:'2px', background:accentColor, margin:'0 auto 4% auto', borderRadius:'2px' }}/>
            <div style={{ fontSize: preview ? 'clamp(8px,2cqw,16px)' : '16px', color:accentColor, letterSpacing:'0.15em', textShadow:shadowText, marginBottom: texto ? '4%' : '0' }}>
              {config.anio}
            </div>
            {texto && (
              <div style={{ fontSize: preview ? 'clamp(6px,1.2cqw,12px)' : '12px', color:accentColor, marginTop:'4%', letterSpacing:'0.05em', lineHeight:1.6, textShadow:shadowText, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                {texto}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}