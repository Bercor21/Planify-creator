/* eslint-disable */
import { useState } from 'react'
import { PALETAS, TIPOS_AGENDA, TAMANOS_AGENDA } from '../constants'
import { exportarPDF, exportarPDFPaginas, showToast } from '../utils'
import { AgendaConfig } from './types'
import BtnVolver       from '../components/BtnVolver'
import SelectorFuente  from '../components/SelectorFuente'
import IndicadorPasos  from '../components/IndicadorPasos'
import BotonesExportar from '../components/BotonesExportar'
import Toast           from '../components/Toast'

import Portada           from './secciones/Portada'
import PaginaInterior    from './secciones/PaginaInterior'
import HojaPresentacion  from './secciones/HojaPresentacion'
import Indice            from './secciones/Indice'
import CalendarioAnual   from './secciones/CalendarioAnual'
import SeparadorMensual  from './secciones/SeparadorMensual'
import Planeador         from './secciones/Planeador'
import HojaContenido     from './secciones/HojaContenido'
import BolsilloInterno   from './secciones/BolsilloInterno'
import HojasFinales      from './secciones/HojasFinales'
import MetasAnio         from './secciones/MetasAnio'
import FechasImportantes from './secciones/FechasImportantes'

const CONFIG_DEFAULT: AgendaConfig = {
  titulo:               'Mi Agenda',
  subtitulo:            '',
  anio:                 new Date().getFullYear(),
  fuente:               'Playfair Display',
  paleta:               PALETAS[0],
  tipo:                 'personal',
  tamano:               'a5',
  colorPortada:         '#1e293b',
  colorContraportada:   '#1e293b',
  textoPortada:         '',
  textoContraportada:   '',
  imagenLogo:           undefined,
  logoX:                10,
  logoY:                10,
  logoSize:             80,
  logoOpacity:          1,
  opacidadFondo:        0.08,
  cantidadHojasNotas:   4,
  cantidadHojasTareas:  2,
  cantidadHojasFinales: 4,
  incluirDiario:        false,
  incluirFinanciera:    true,
  incluirHabitos:       true,
  incluirContactos:     true,
  incluirBolsillo:      true,
}


// Proporciones de papel (ancho/alto) para la preview
const PAPER_ASPECT: Record<string, number> = {
  // Agenda nuevos tamaños
  bolsillo: 90/140, a6: 105/148, b6: 125/176,
  a5: 148/210, b5: 176/250, a4: 210/297,
  'escritorio-s': 210/150, 'escritorio-m': 300/210, 'escritorio-l': 420/297,
  // Legacy
  carta: 216/279, oficio: 216/330, ejecutivo: 184/267, a3: 297/420,
  tabloide: 279/432, cuaderno: 160/215,
  'cuaderno-s': 140/210, 'cuaderno-m': 170/240,
}

export default function WizardAgenda({ setVista, guardarDiseno }: {
  setVista:       (v: any) => void
  guardarDiseno:  (d: any) => void
  disenoInicial?: any
}) { 
  
  const [paso,       setPaso]     = useState(1)
  const [config,     setConfig]   = useState<AgendaConfig>(CONFIG_DEFAULT)
  const [exportando, setExp]      = useState(false)
  const [toast,      setToast]    = useState<string | null>(null)
  const [guardado,   setGuardado] = useState(false)

  // Estado local para inputs de texto — evita re-renders al escribir
  const [tituloLocal,      setTituloLocal]      = useState(CONFIG_DEFAULT.titulo)
  const [subtituloLocal,   setSubtituloLocal]   = useState(CONFIG_DEFAULT.subtitulo)
  const [textoPortLocal,   setTextoPortLocal]   = useState(CONFIG_DEFAULT.textoPortada)
  const [textoContraLocal, setTextoContraLocal] = useState(CONFIG_DEFAULT.textoContraportada)

  function upd<K extends keyof AgendaConfig>(key: K, val: AgendaConfig[K]) {
    setConfig(prev => ({ ...prev, [key]: val }))
  }
  function updMulti(updates: Partial<AgendaConfig>) {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  function subirImagen(key: 'imagenPortada' | 'imagenContraportada' | 'imagenFondoInterno' | 'imagenLogo') {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = (ev: any) => upd(key, ev.target.result)
      reader.readAsDataURL(file)
    }
    input.click()
  }

  function imprimirAgenda() {
    const el = document.getElementById('agenda-preview-full')
    if (!el) return
    const prev = document.getElementById('print-agenda-root')
    if (prev) prev.remove()
    const prevSt = document.getElementById('print-agenda-style')
    if (prevSt) prevSt.remove()

    const container = document.createElement('div')
    container.id = 'print-agenda-root'
    container.innerHTML = el.innerHTML
    document.body.appendChild(container)

    const style = document.createElement('style')
    style.id = 'print-agenda-style'
    // Obtener CSS del tamaño correcto
    const PAGE_SIZES_CSS: Record<string,string> = {
      bolsillo:'90mm 140mm', a6:'105mm 148mm', b6:'125mm 176mm',
      a5:'148mm 210mm', b5:'176mm 250mm', a4:'210mm 297mm',
      'escritorio-s':'210mm 150mm','escritorio-m':'300mm 210mm','escritorio-l':'420mm 297mm',
      carta:'215.9mm 279.4mm', oficio:'215.9mm 330.2mm',
    }
    const pageSize = PAGE_SIZES_CSS[config.tamano] ?? '148mm 210mm'

    style.innerHTML = `
      @page {
        size: ${pageSize} !important;
        margin: 0 !important;
        padding: 0 !important;
        bleed: 0 !important;
      }
      html { margin:0 !important; padding:0 !important; width:100% !important; height:100% !important; }
      body { margin:0 !important; padding:0 !important; width:100vw !important; }
      * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }
      @media screen { #print-agenda-root { display:none; } }
      @media print {
        body > *:not(#print-agenda-root) { display:none !important; }
        #print-agenda-root { display:block !important; width:100vw !important; margin:0 !important; padding:0 !important; }
        #print-agenda-root > * {
          display:block !important; width:100vw !important; min-height:100vh !important;
          margin:0 !important; padding:0 !important; box-sizing:border-box !important;
          page-break-after:always !important; page-break-inside:avoid !important; overflow:hidden !important;
        }
        #print-agenda-root > *:last-child { page-break-after:auto !important; }
      }
    `
    document.head.appendChild(style)
    setTimeout(() => {
      window.print()
      setTimeout(() => { container.remove(); style.remove() }, 1000)
    }, 400)
  }

  // Componente de sección portada/contraportada
  function SeccionPortada({ esContra }: { esContra: boolean }) {
    const keyImagen = esContra ? 'imagenContraportada' : 'imagenPortada'
    const keyColor  = esContra ? 'colorContraportada'  : 'colorPortada'
    const keyTexto  = esContra ? 'textoContraportada'  : 'textoPortada'
    const imagen    = esContra ? config.imagenContraportada : config.imagenPortada
    const color     = esContra ? config.colorContraportada  : config.colorPortada

    return (
      <div style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #e2e8f0' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'16px' }}>
          {esContra ? 'CONTRAPORTADA' : 'PORTADA'}
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          {/* Mini preview */}
          <div style={{
            width:'80px', height:'112px', borderRadius:'8px', flexShrink:0, overflow:'hidden',
            background: imagen ? `url('${imagen}') center/cover` : `linear-gradient(145deg,${color},${color}bb)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 12px rgba(0,0,0,0.15)', position:'relative',
          }}>
            {imagen && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)' }}/>}
            <div style={{ position:'relative', zIndex:1, fontSize:'8px', fontWeight:800, color:'white', textAlign:'center', padding:'4px', wordBreak:'break-all' }}>
              {config.titulo.slice(0,10).toUpperCase()}
            </div>
          </div>

          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'10px' }}>
            {/* Colores */}
            <div>
              <label style={{ fontSize:'10px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'5px' }}>COLOR SÓLIDO</label>
              <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', alignItems:'center' }}>
                {['#1e293b','#1d4ed8','#166534','#9f1239','#6b21a8','#9a3412','#374151','#0f172a','#dc2626','#0891b2'].map(c => (
                  <button key={c} onClick={() => { upd(keyColor as any, c); upd(keyImagen as any, undefined) }}
                    style={{ width:'22px', height:'22px', borderRadius:'5px', background:c, border: color===c && !imagen ? '2px solid #3b82f6' : '2px solid transparent', cursor:'pointer', flexShrink:0 }}/>
                ))}
                <input type="color" value={color}
                  onChange={(e:any) => { upd(keyColor as any, e.target.value); upd(keyImagen as any, undefined) }}
                  style={{ width:'22px', height:'22px', borderRadius:'5px', border:'none', cursor:'pointer', padding:0 }}/>
              </div>
            </div>

            {/* Imagen */}
            <div style={{ display:'flex', gap:'6px' }}>
              <button onClick={() => subirImagen(keyImagen as any)}
                style={{ padding:'5px 10px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'11px', fontWeight:600, color:'#64748b' }}>
                📷 Imagen
              </button>
              {imagen && (
                <button onClick={() => upd(keyImagen as any, undefined)}
                  style={{ padding:'5px 8px', borderRadius:'6px', border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:'11px', color:'#dc2626' }}>
                  ✕
                </button>
              )}
            </div>

            {/* Texto adicional */}
            <div>
              <label style={{ fontSize:'10px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'4px' }}>TEXTO ADICIONAL</label>
              <textarea
                value={esContra ? textoContraLocal : textoPortLocal}
                onChange={(e:any) => esContra ? setTextoContraLocal(e.target.value) : setTextoPortLocal(e.target.value)}
                onBlur={(e:any) => upd(keyTexto as any, e.target.value)}
                placeholder="Ej: Nombre, empresa, año..."
                rows={2}
                style={{ width:'100%', padding:'6px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'11px', resize:'none', outline:'none', fontFamily:'inherit' }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── PASO 1 ────────────────────────────────────────────────────────────────
  if (paso === 1) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px' }}>
        <BtnVolver setVista={setVista} />
        <div style={{ fontSize:'16px', fontWeight:700 }}>Nueva Agenda</div>
        <IndicadorPasos paso={paso} total={4} />
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'32px', maxWidth:'820px', margin:'0 auto', width:'100%' }}>
        <h2 style={{ fontSize:'20px', fontWeight:800, color:'#1e293b', marginBottom:'6px' }}>¿Qué tipo de agenda necesitas?</h2>
        <p style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Selecciona el formato que mejor se adapte a tu estilo</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'14px' }}>
          {TIPOS_AGENDA.map(t => (
            <button key={t.id} onClick={() => { upd('tipo', t.id); setPaso(2) }} style={{
              padding:'20px', borderRadius:'14px', cursor:'pointer', textAlign:'left',
              display:'flex', flexDirection:'column', gap:'10px', transition:'all 0.15s',
              border: config.tipo === t.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              background: config.tipo === t.id ? '#eff6ff' : 'white',
            }}
            onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor='#3b82f6';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor=config.tipo===t.id?'#3b82f6':'#e2e8f0';e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{ fontSize:'32px' }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'14px', color:'#1e293b', marginBottom:'4px' }}>{t.nombre}</div>
                <div style={{ fontSize:'11px', color:'#94a3b8', lineHeight:'1.5' }}>{t.desc}</div>
              </div>
              <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                {t.tags.map(tag => <span key={tag} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'20px', background:'#f1f5f9', color:'#64748b' }}>{tag}</span>)}
              </div>
            </button>
          ))}
        </div>
      </div>
      <Toast msg={toast} />
    </div>
  )

  // ── PASO 2 ────────────────────────────────────────────────────────────────
  if (paso === 2) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px' }}>
        <button onClick={() => setPaso(1)} style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px', color:'#64748b', fontWeight:600 }}>← Atrás</button>
        <div style={{ fontSize:'16px', fontWeight:700 }}>Nueva Agenda</div>
        <IndicadorPasos paso={paso} total={4} />
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'32px', maxWidth:'820px', margin:'0 auto', width:'100%' }}>
        <h2 style={{ fontSize:'20px', fontWeight:800, color:'#1e293b', marginBottom:'6px' }}>Tamaño y formato</h2>
        <p style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'24px' }}>Elige el tamaño de tu agenda</p>
        {TAMANOS_AGENDA.map(cat => (
          <div key={cat.cat} style={{ marginBottom:'20px' }}>
            <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'10px' }}>{cat.cat}</div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {(cat.items as any[]).map(item => (
                <button key={item.id} onClick={() => { upd('tamano', item.id); setPaso(3) }} style={{
                  padding:'16px', borderRadius:'12px', cursor:'pointer', textAlign:'left', transition:'all 0.15s',
                  border: config.tamano === item.id ? `2px solid ${config.paleta.acento}` : '1px solid #e2e8f0',
                  background: config.tamano === item.id ? config.paleta.acento + '12' : 'white',
                }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'#1e293b', marginBottom:'2px' }}>{item.nombre}</div>
                  <div style={{ fontSize:'11px', color:config.paleta.acento, fontWeight:600, marginBottom:'4px' }}>{item.dim}</div>
                  {item.desc && <div style={{ fontSize:'10px', color:'#94a3b8', lineHeight:1.4 }}>{item.desc}</div>}
                  {item.horiz && <div style={{ fontSize:'10px', color:config.paleta.acento, fontWeight:600, marginTop:'4px' }}>↔ Horizontal</div>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Toast msg={toast} />
    </div>
  )

  // ── PASO 3 ────────────────────────────────────────────────────────────────
  if (paso === 3) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px' }}>
        <button onClick={() => setPaso(2)} style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px', color:'#64748b', fontWeight:600 }}>← Atrás</button>
        <div style={{ fontSize:'16px', fontWeight:700 }}>Personalizar Agenda</div>
        <IndicadorPasos paso={paso} total={4} />
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'24px 32px' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

          {/* ── COLUMNA IZQUIERDA ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* General */}
            <div style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'14px' }}>GENERAL</div>

              <label style={{ fontSize:'11px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'5px' }}>TÍTULO</label>
              <input
                value={tituloLocal}
                onChange={(e:any) => setTituloLocal(e.target.value)}
                onBlur={(e:any) => upd('titulo', e.target.value)}
                style={{ width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'14px', fontWeight:600, outline:'none', marginBottom:'10px' }}
                placeholder="Mi Agenda 2026"
              />

              <label style={{ fontSize:'11px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'5px' }}>SUBTÍTULO <span style={{ fontWeight:400, opacity:0.5 }}>(opcional)</span></label>
              <input
                value={subtituloLocal}
                onChange={(e:any) => setSubtituloLocal(e.target.value)}
                onBlur={(e:any) => upd('subtitulo', e.target.value)}
                style={{ width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none', marginBottom:'10px' }}
                placeholder="Personal · Trabajo · Estudios"
              />

              <label style={{ fontSize:'11px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'5px' }}>AÑO</label>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <button onClick={() => upd('anio', config.anio-1)} style={{ width:'30px', height:'30px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>‹</button>
                <span style={{ fontSize:'15px', fontWeight:700, minWidth:'48px', textAlign:'center' }}>{config.anio}</span>
                <button onClick={() => upd('anio', config.anio+1)} style={{ width:'30px', height:'30px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer' }}>›</button>
              </div>
            </div>

            {/* Estilo */}
            <div style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'14px' }}>ESTILO</div>
              <label style={{ fontSize:'11px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'7px' }}>TIPOGRAFÍA</label>
              <SelectorFuente fuente={config.fuente} setFuente={v => upd('fuente', v)} />
              <label style={{ fontSize:'11px', fontWeight:700, color:'#64748b', display:'block', marginBottom:'7px', marginTop:'12px' }}>PALETA</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px' }}>
                {PALETAS.map(p => (
                  <button key={p.nombre} onClick={() => upd('paleta', p)} style={{
                    padding:'7px 9px', borderRadius:'7px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px',
                    border: config.paleta.nombre === p.nombre ? `2px solid ${p.acento}` : '1px solid #e2e8f0',
                    background: p.fondo,
                  }}>
                    <div style={{ width:'14px', height:'14px', borderRadius:'50%', background:p.header, flexShrink:0 }}/>
                    <div style={{ fontSize:'10px', fontWeight:700, color:p.texto }}>{p.nombre}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'14px' }}>LOGO / MARCA</div>
              <div style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'14px' }}>
                <div style={{
                  width:'70px', height:'70px', borderRadius:'50%', flexShrink:0,
                  border:'2px dashed #e2e8f0', overflow:'hidden',
                  background: config.imagenLogo ? `url('${config.imagenLogo}') center/cover` : '#f8fafc',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity: config.logoOpacity,
                }}>
                  {!config.imagenLogo && <span style={{ fontSize:'22px' }}>🏷️</span>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:'6px', marginBottom:'8px' }}>
                    <button onClick={() => subirImagen('imagenLogo')} style={{ padding:'6px 12px', borderRadius:'7px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'11px', fontWeight:600, color:'#64748b' }}>📷 Subir logo</button>
                    {config.imagenLogo && <button onClick={() => upd('imagenLogo', undefined)} style={{ padding:'6px 8px', borderRadius:'7px', border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:'11px', color:'#dc2626' }}>✕</button>}
                  </div>
                  <div style={{ fontSize:'10px', color:'#94a3b8', lineHeight:1.5 }}>
                    En el paso 4 podés arrastrar el logo a cualquier posición
                  </div>
                </div>
              </div>

              {config.imagenLogo && (
                <>
                  {[
                    { label:'Tamaño',   value:config.logoSize,                    set:(v:number)=>upd('logoSize',v),       min:40, max:180, unit:'px' },
                    { label:'Opacidad', value:Math.round(config.logoOpacity*100), set:(v:number)=>upd('logoOpacity',v/100), min:10, max:100, unit:'%'  },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom:'8px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', fontWeight:700, color:'#64748b', marginBottom:'3px' }}>
                        <span>{item.label}</span><span>{item.value}{item.unit}</span>
                      </div>
                      <input type="range" min={item.min} max={item.max} value={item.value}
                        onChange={(e:any) => item.set(parseInt(e.target.value))}
                        style={{ width:'100%', accentColor:config.paleta.acento }}/>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Secciones */}
            <div style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'14px' }}>SECCIONES</div>
              {[
                { key:'incluirDiario',     label:'📋 Planeador Diario'        },
                { key:'incluirFinanciera', label:'💰 Sección Financiera'       },
                { key:'incluirHabitos',    label:'🔥 Seguimiento de Hábitos'   },
                { key:'incluirContactos',  label:'📞 Directorio de Contactos'  },
                { key:'incluirBolsillo',   label:'🗃️ Bolsillo Interno'         },
              ].map(item => (
                <div key={item.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #f1f5f9' }}>
                  <div style={{ fontSize:'12px', color:'#1e293b' }}>{item.label}</div>
                  <button onClick={() => upd(item.key as any, !(config as any)[item.key])}
                    style={{ width:'40px', height:'22px', borderRadius:'11px', border:'none', cursor:'pointer', transition:'all 0.2s', background:(config as any)[item.key] ? config.paleta.acento : '#e2e8f0', position:'relative' }}>
                    <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:'white', position:'absolute', top:'3px', left:(config as any)[item.key] ? '21px' : '3px', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                  </button>
                </div>
              ))}

              <div style={{ marginTop:'12px' }}>
                <div style={{ fontSize:'10px', fontWeight:700, color:'#94a3b8', letterSpacing:'1px', marginBottom:'8px' }}>CANTIDAD DE HOJAS</div>
                {[
                  { key:'cantidadHojasNotas',   label:'📝 Notas',        min:1, max:20 },
                  { key:'cantidadHojasTareas',  label:'✅ Tareas',       min:1, max:10 },
                  { key:'cantidadHojasFinales', label:'📄 Hojas finales', min:2, max:20 },
                ].map(item => (
                  <div key={item.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'7px' }}>
                    <div style={{ fontSize:'11px', color:'#1e293b' }}>{item.label}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                      <button onClick={() => upd(item.key as any, Math.max(item.min, (config as any)[item.key]-1))} style={{ width:'22px', height:'22px', borderRadius:'5px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'13px' }}>−</button>
                      <span style={{ fontSize:'13px', fontWeight:700, minWidth:'24px', textAlign:'center' }}>{(config as any)[item.key]}</span>
                      <button onClick={() => upd(item.key as any, Math.min(item.max, (config as any)[item.key]+1))} style={{ width:'22px', height:'22px', borderRadius:'5px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'13px' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

            <SeccionPortada esContra={false} />
            <SeccionPortada esContra={true} />

            {/* Fondo interno */}
            <div style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'14px' }}>FONDO INTERNO (MARCA DE AGUA)</div>
              <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                <button onClick={() => subirImagen('imagenFondoInterno')} style={{ padding:'7px 12px', borderRadius:'7px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'11px', fontWeight:600, color:'#64748b' }}>🖼️ Subir imagen</button>
                {config.imagenFondoInterno && <button onClick={() => upd('imagenFondoInterno', undefined)} style={{ padding:'7px 9px', borderRadius:'7px', border:'1px solid #fecaca', background:'#fef2f2', cursor:'pointer', fontSize:'11px', color:'#dc2626' }}>✕ Quitar</button>}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', fontWeight:700, color:'#64748b', marginBottom:'5px' }}>
                <span>OPACIDAD</span><span>{Math.round(config.opacidadFondo*100)}%</span>
              </div>
              <input type="range" min={3} max={20} value={Math.round(config.opacidadFondo*100)}
                onChange={(e:any) => upd('opacidadFondo', parseInt(e.target.value)/100)}
                style={{ width:'100%', accentColor:config.paleta.acento }}/>
            </div>

            {/* Preview portada — hoja completa con proporciones correctas */}
            <div style={{ background:'white', borderRadius:'14px', padding:'16px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#94a3b8', letterSpacing:'2px', marginBottom:'12px' }}>PREVIEW PORTADA — HOJA COMPLETA</div>
              {/* Aspect-ratio box: muestra la hoja entera escalada */}
              <div style={{
                position:'relative',
                width:'100%',
                paddingBottom: `${100 / (PAPER_ASPECT[config.tamano] ?? 0.705)}%`,
                borderRadius:'10px',
                overflow:'hidden',
                boxShadow:'0 4px 16px rgba(0,0,0,0.12)',
              }}>
                <div style={{ position:'absolute', inset:0 }}>
                  <Portada config={config} onUpdateConfig={updMulti} preview={true} />
                </div>
              </div>
              <div style={{ marginTop:'8px', fontSize:'10px', color:'#94a3b8', textAlign:'center' }}>
                💡 {config.imagenLogo ? 'Arrastrá el logo a cualquier parte de la hoja' : 'Subí un logo para arrastrarlo en la portada'}
              </div>
            </div>

          </div>
        </div>

        <div style={{ maxWidth:'960px', margin:'16px auto 0', display:'flex', justifyContent:'flex-end' }}>
          <button onClick={() => setPaso(4)} style={{ padding:'12px 32px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#3b82f6,#6366f1)', color:'white', cursor:'pointer', fontSize:'14px', fontWeight:700 }}>
            Ver diseño completo →
          </button>
        </div>
      </div>
      <Toast msg={toast} />
    </div>
  )

  // ── PASO 4 ────────────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'10px 16px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
        <button onClick={() => setPaso(3)} style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', cursor:'pointer', fontSize:'12px', color:'#64748b', fontWeight:600 }}>← Editar</button>
        <div style={{ fontSize:'14px', fontWeight:700 }}>{config.titulo}</div>
        <div style={{ fontSize:'11px', color:'#94a3b8', background:'#f1f5f9', padding:'3px 10px', borderRadius:'20px' }}>
          {TIPOS_AGENDA.find(t => t.id === config.tipo)?.nombre}
        </div>
        <IndicadorPasos paso={paso} total={4} />
        <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
          <button
            onClick={() => { guardarDiseno({ tipo:'agenda', titulo:config.titulo, paleta:config.paleta, fuente:config.fuente, tamano:config.tamano, anio:config.anio }); setGuardado(true); showToast(setToast,'💾 Agenda guardada') }}
            style={{ padding:'6px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background:guardado?'#f0fdf4':'#f1f5f9', color:guardado?'#16a34a':'#64748b' }}
          >
            {guardado ? '✅ Guardado' : '💾 Guardar'}
          </button>
          <BotonesExportar
            onPDF={() => exportarPDFPaginas('agenda-preview-full', `${config.titulo}-${config.anio}.pdf`, config.tamano, setExp, setToast)}
            onPDFCompleto={() => exportarPDF('agenda-preview-full', `${config.titulo}-${config.anio}.pdf`, config.tamano, setExp, setToast)}
            onImprimir={imprimirAgenda}
            exportando={exportando}
          />
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'20px', background:'#e2e8f0' }}>
        <div id="agenda-preview-full" style={{ maxWidth:'700px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'0' }}>
          {[
            <Portada key="portada" config={config} onUpdateConfig={updMulti} />,
            <PaginaInterior key="int-portada" config={config} />,
            <HojaPresentacion key="presentacion" config={config} />,
            <Indice key="indice" config={config} />,
            <CalendarioAnual key="cal-anual" config={config} />,
            <MetasAnio key="metas" config={config} />,
            <FechasImportantes key="fechas" config={config} />,
            ...[...Array(12)].flatMap((_, mesIdx) => [
              <SeparadorMensual key={`sep-${mesIdx}`} config={config} mesIndex={mesIdx} />,
              <Planeador key={`pln-m-${mesIdx}`} config={config} modo="mensual" mesIndex={mesIdx} />,
              <Planeador key={`pln-s-${mesIdx}`} config={config} modo="semanal" mesIndex={mesIdx} />,
              ...(config.incluirDiario ? [<Planeador key={`pln-d-${mesIdx}`} config={config} modo="diario" mesIndex={mesIdx} />] : []),
            ]),
            ...[...Array(config.cantidadHojasNotas)].map((_,i)   => <HojaContenido key={`nota-${i}`}   config={config} modo="notas"   numero={i+1} />),
            ...[...Array(config.cantidadHojasTareas)].map((_,i)  => <HojaContenido key={`tarea-${i}`}  config={config} modo="tareas"  numero={i+1} />),
            ...(config.incluirContactos  ? [<HojaContenido key="contactos"  config={config} modo="contactos"  />] : []),
            ...(config.incluirFinanciera ? [<HojaContenido key="financiera" config={config} modo="financiera" />] : []),
            ...(config.incluirHabitos    ? [<HojaContenido key="habitos"    config={config} modo="habitos"    />] : []),
            ...[...Array(config.cantidadHojasFinales)].map((_,i) => (
              <HojasFinales key={`final-${i}`} config={config} numero={i+1} mostrarMarca={i === config.cantidadHojasFinales - 1} />
            )),
            ...(config.incluirBolsillo ? [<BolsilloInterno key="bolsillo" config={config} />] : []),
            <PaginaInterior key="int-contra" config={config} esContraportada />,
            <Portada key="contraportada" config={config} esContraportada onUpdateConfig={updMulti} />,
          ].map((seccion, i) => (
            <div key={i} data-page="true" style={{ position:'relative' }}>
              {seccion}
            </div>
          ))}
        </div>
      </div>

      <Toast msg={toast} />
    </div>
  )
}