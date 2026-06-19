/* eslint-disable */
import { useState, useRef, useEffect } from 'react'
import { MESES, PALETAS, Paleta } from '../constants'
import { showToast } from '../utils'
import BtnVolver       from '../components/BtnVolver'
import SelectorFuente  from '../components/SelectorFuente'
import BarraPaletas    from '../components/BarraPaletas'
import BotonesExportar from '../components/BotonesExportar'
import Toast           from '../components/Toast'
import jsPDF           from 'jspdf'
import html2canvas     from 'html2canvas'

// ── Días tradicionales (Domingo primero) ──────────────────────────────────────
const DIAS_NOMBRES = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO']
const DIAS_CORTOS  = ['D','L','M','M','J','V','S']

function getDiasTrad(anio: number, mes: number) {
  const dim = new Date(anio, mes+1, 0).getDate()
  const fd  = new Date(anio, mes, 1).getDay()
  return Array.from({ length: Math.ceil((fd+dim)/7)*7 }, (_,i) => {
    const d = i-fd+1; return d>=1&&d<=dim ? d : null
  })
}
function getNumSemana(anio:number, mes:number, dia:number) {
  const d = new Date(anio,mes,dia)
  d.setDate(d.getDate()+4-(d.getDay()||7))
  const y = new Date(d.getFullYear(),0,1)
  return Math.ceil((((d.getTime()-y.getTime())/86400000)+1)/7)
}

// ── Fases lunares 2025–2028 ───────────────────────────────────────────────────
type FaseLunar = { dia:number; tipo:'nueva'|'creciente'|'llena'|'menguante' }
const FASES: Record<string,FaseLunar[]> = {
  '2025-0':[{dia:7,tipo:'llena'},{dia:13,tipo:'menguante'},{dia:22,tipo:'creciente'},{dia:29,tipo:'nueva'}],
  '2025-1':[{dia:5,tipo:'llena'},{dia:12,tipo:'menguante'},{dia:20,tipo:'creciente'},{dia:28,tipo:'nueva'}],
  '2025-2':[{dia:7,tipo:'llena'},{dia:14,tipo:'menguante'},{dia:22,tipo:'creciente'},{dia:29,tipo:'nueva'}],
  '2025-3':[{dia:5,tipo:'llena'},{dia:13,tipo:'menguante'},{dia:21,tipo:'creciente'},{dia:27,tipo:'nueva'}],
  '2025-4':[{dia:4,tipo:'llena'},{dia:12,tipo:'menguante'},{dia:20,tipo:'creciente'},{dia:27,tipo:'nueva'}],
  '2025-5':[{dia:3,tipo:'llena'},{dia:11,tipo:'menguante'},{dia:18,tipo:'creciente'},{dia:25,tipo:'nueva'}],
  '2025-6':[{dia:2,tipo:'llena'},{dia:10,tipo:'menguante'},{dia:18,tipo:'creciente'},{dia:25,tipo:'nueva'}],
  '2025-7':[{dia:1,tipo:'llena'},{dia:9,tipo:'menguante'},{dia:16,tipo:'creciente'},{dia:23,tipo:'nueva'}],
  '2025-8':[{dia:7,tipo:'llena'},{dia:14,tipo:'menguante'},{dia:21,tipo:'creciente'},{dia:29,tipo:'nueva'}],
  '2025-9':[{dia:7,tipo:'llena'},{dia:13,tipo:'menguante'},{dia:21,tipo:'creciente'},{dia:29,tipo:'nueva'}],
  '2025-10':[{dia:5,tipo:'llena'},{dia:12,tipo:'menguante'},{dia:20,tipo:'creciente'},{dia:28,tipo:'nueva'}],
  '2025-11':[{dia:5,tipo:'llena'},{dia:11,tipo:'menguante'},{dia:20,tipo:'creciente'},{dia:27,tipo:'nueva'}],
  '2026-0':[{dia:3,tipo:'nueva'},{dia:10,tipo:'creciente'},{dia:18,tipo:'llena'},{dia:25,tipo:'menguante'}],
  '2026-1':[{dia:2,tipo:'nueva'},{dia:9,tipo:'creciente'},{dia:17,tipo:'llena'},{dia:24,tipo:'menguante'}],
  '2026-2':[{dia:3,tipo:'nueva'},{dia:11,tipo:'creciente'},{dia:18,tipo:'llena'},{dia:25,tipo:'menguante'}],
  '2026-3':[{dia:2,tipo:'nueva'},{dia:10,tipo:'creciente'},{dia:17,tipo:'llena'},{dia:24,tipo:'menguante'}],
  '2026-4':[{dia:1,tipo:'nueva'},{dia:9,tipo:'creciente'},{dia:16,tipo:'llena'},{dia:24,tipo:'menguante'},{dia:31,tipo:'nueva'}],
  '2026-5':[{dia:7,tipo:'creciente'},{dia:15,tipo:'llena'},{dia:22,tipo:'menguante'},{dia:30,tipo:'nueva'}],
  '2026-6':[{dia:7,tipo:'creciente'},{dia:14,tipo:'llena'},{dia:22,tipo:'menguante'},{dia:29,tipo:'nueva'}],
  '2026-7':[{dia:5,tipo:'creciente'},{dia:13,tipo:'llena'},{dia:20,tipo:'menguante'},{dia:28,tipo:'nueva'}],
  '2026-8':[{dia:4,tipo:'creciente'},{dia:11,tipo:'llena'},{dia:19,tipo:'menguante'},{dia:26,tipo:'nueva'}],
  '2026-9':[{dia:3,tipo:'creciente'},{dia:11,tipo:'llena'},{dia:18,tipo:'menguante'},{dia:26,tipo:'nueva'}],
  '2026-10':[{dia:2,tipo:'creciente'},{dia:9,tipo:'llena'},{dia:17,tipo:'menguante'},{dia:25,tipo:'nueva'}],
  '2026-11':[{dia:1,tipo:'creciente'},{dia:9,tipo:'llena'},{dia:17,tipo:'menguante'},{dia:24,tipo:'nueva'}],
  '2027-0':[{dia:7,tipo:'creciente'},{dia:15,tipo:'llena'},{dia:23,tipo:'menguante'},{dia:31,tipo:'nueva'}],
  '2027-1':[{dia:6,tipo:'creciente'},{dia:14,tipo:'llena'},{dia:22,tipo:'menguante'},{dia:28,tipo:'nueva'}],
  '2027-2':[{dia:2,tipo:'nueva'},{dia:8,tipo:'creciente'},{dia:15,tipo:'llena'},{dia:22,tipo:'menguante'}],
  '2027-3':[{dia:6,tipo:'creciente'},{dia:13,tipo:'llena'},{dia:20,tipo:'menguante'},{dia:28,tipo:'nueva'}],
  '2027-4':[{dia:6,tipo:'creciente'},{dia:13,tipo:'llena'},{dia:20,tipo:'menguante'},{dia:28,tipo:'nueva'}],
  '2027-5':[{dia:4,tipo:'creciente'},{dia:11,tipo:'llena'},{dia:18,tipo:'menguante'},{dia:26,tipo:'nueva'}],
  '2027-6':[{dia:4,tipo:'creciente'},{dia:11,tipo:'llena'},{dia:18,tipo:'menguante'},{dia:26,tipo:'nueva'}],
  '2027-7':[{dia:2,tipo:'creciente'},{dia:9,tipo:'llena'},{dia:17,tipo:'menguante'},{dia:25,tipo:'nueva'}],
  '2027-8':[{dia:1,tipo:'creciente'},{dia:8,tipo:'llena'},{dia:15,tipo:'menguante'},{dia:23,tipo:'nueva'}],
  '2027-9':[{dia:8,tipo:'llena'},{dia:15,tipo:'menguante'},{dia:22,tipo:'nueva'},{dia:30,tipo:'creciente'}],
  '2027-10':[{dia:6,tipo:'llena'},{dia:14,tipo:'menguante'},{dia:21,tipo:'nueva'},{dia:29,tipo:'creciente'}],
  '2027-11':[{dia:6,tipo:'llena'},{dia:13,tipo:'menguante'},{dia:21,tipo:'nueva'},{dia:28,tipo:'creciente'}],
  '2028-0':[{dia:5,tipo:'llena'},{dia:12,tipo:'menguante'},{dia:19,tipo:'nueva'},{dia:27,tipo:'creciente'}],
  '2028-1':[{dia:4,tipo:'llena'},{dia:11,tipo:'menguante'},{dia:18,tipo:'nueva'},{dia:26,tipo:'creciente'}],
  '2028-2':[{dia:4,tipo:'llena'},{dia:11,tipo:'menguante'},{dia:19,tipo:'nueva'},{dia:27,tipo:'creciente'}],
  '2028-3':[{dia:3,tipo:'llena'},{dia:10,tipo:'menguante'},{dia:17,tipo:'nueva'},{dia:25,tipo:'creciente'}],
  '2028-4':[{dia:2,tipo:'llena'},{dia:10,tipo:'menguante'},{dia:16,tipo:'nueva'},{dia:24,tipo:'creciente'}],
  '2028-5':[{dia:1,tipo:'llena'},{dia:8,tipo:'menguante'},{dia:15,tipo:'nueva'},{dia:23,tipo:'creciente'}],
  '2028-6':[{dia:1,tipo:'llena'},{dia:7,tipo:'menguante'},{dia:14,tipo:'nueva'},{dia:22,tipo:'creciente'},{dia:30,tipo:'llena'}],
  '2028-7':[{dia:6,tipo:'menguante'},{dia:13,tipo:'nueva'},{dia:21,tipo:'creciente'},{dia:28,tipo:'llena'}],
  '2028-8':[{dia:4,tipo:'menguante'},{dia:11,tipo:'nueva'},{dia:19,tipo:'creciente'},{dia:27,tipo:'llena'}],
  '2028-9':[{dia:3,tipo:'menguante'},{dia:11,tipo:'nueva'},{dia:18,tipo:'creciente'},{dia:26,tipo:'llena'}],
  '2028-10':[{dia:2,tipo:'menguante'},{dia:10,tipo:'nueva'},{dia:17,tipo:'creciente'},{dia:25,tipo:'llena'}],
  '2028-11':[{dia:1,tipo:'menguante'},{dia:9,tipo:'nueva'},{dia:17,tipo:'creciente'},{dia:24,tipo:'llena'}],
}
const ICONO_FASE:Record<string,string> = {nueva:'🌑',creciente:'🌓',llena:'🌕',menguante:'🌗'}
const LABEL_FASE:Record<string,string> = {nueva:'Luna Nueva',creciente:'C. Creciente',llena:'Luna Llena',menguante:'C. Menguante'}

// ── Feriados CR ───────────────────────────────────────────────────────────────
const FERIADOS_FIJOS:Record<string,string> = {
  '0-1':'Año Nuevo','3-11':'Juan Santamaría','4-1':'Día del Trabajo',
  '6-25':'Anexión de Nicoya','7-2':'Virgen de los Ángeles',
  '7-15':'Día de la Madre','7-31':'Día de la Persona Negra y la Cultura Afrocostarricense',
  '8-15':'Independencia','11-1':'Abolición del Ejército',
  '11-24':'Nochebuena','11-25':'Navidad',
}
const FERIADOS_VAR:Record<string,string> = {
  '2025-3-17':'Jueves Santo','2025-3-18':'Viernes Santo',
  '2026-3-2':'Jueves Santo','2026-3-3':'Viernes Santo',
  '2027-3-25':'Jueves Santo','2027-3-26':'Viernes Santo',
  '2028-4-13':'Jueves Santo','2028-4-14':'Viernes Santo',
  '2029-3-29':'Jueves Santo','2029-3-30':'Viernes Santo',
  '2030-4-18':'Jueves Santo','2030-4-19':'Viernes Santo',
}
function getFeriado(a:number,m:number,d:number) {
  return FERIADOS_VAR[`${a}-${m}-${d}`] ?? FERIADOS_FIJOS[`${m}-${d}`] ?? null
}

// ── Tamaños de calendario ─────────────────────────────────────────────────────
const TAMANOS_CAL = [
  { cat:'🖥️ Escritorio (caballete)', items:[
    { id:'esc-s', nombre:'Escritorio S', dim:'21 × 15 cm', w:210, h:150, css:'21cm 15cm'  },
    { id:'esc-m', nombre:'Escritorio M', dim:'23 × 15 cm', w:230, h:150, css:'23cm 15cm'  },
  ]},
  { cat:'🪟 Pared Estándar (2 hojas A4 horizontal)', items:[
    { id:'pared-a4',    nombre:'A4 horizontal',    dim:'29.7 × 21 cm',   w:297,   h:210,   css:'297mm 210mm'      },
    { id:'pared-carta', nombre:'Carta horizontal',  dim:'27.9 × 21.6 cm', w:279.4, h:215.9, css:'279.4mm 215.9mm'  },
  ]},
  { cat:'🗓️ Pared Grande (horizontal)', items:[
    { id:'pared-a3',      nombre:'A3 horizontal',       dim:'42 × 29.7 cm',  w:420,   h:297,   css:'420mm 297mm'      },
    { id:'pared-tabloide',nombre:'Tabloide horizontal',  dim:'43.2 × 27.9 cm',w:431.8, h:279.4, css:'431.8mm 279.4mm'  },
  ]},
  { cat:'🪧 Póster / Anual', items:[
    { id:'poster-30', nombre:'Cuadrado 30×30', dim:'30 × 30 cm', w:300, h:300, css:'300mm 300mm' },
    { id:'poster-50', nombre:'Póster 70×50',   dim:'70 × 50 cm', w:700, h:500, css:'700mm 500mm' },
  ]},
]
function getTam(id:string) {
  return TAMANOS_CAL.flatMap(c=>c.items).find(t=>t.id===id) ?? TAMANOS_CAL[1].items[0]
}

// ── Mini calendario ───────────────────────────────────────────────────────────
// ── Control numérico con flechas (reemplaza los sliders/barras) ───────────────
// Muestra el valor exacto en un campo editable, con dos flechas para subir/bajar
// de a un paso fijo. El valor también se puede escribir directamente.
function NumStepper({ value,onChange,min,max,step=1,unit='',accent }:{
  value:number; onChange:(v:number)=>void; min:number; max:number; step?:number; unit?:string; accent:string
}) {
  const clamp = (v:number) => Math.min(max, Math.max(min, v))
  return (
    <div style={{ display:'inline-flex',alignItems:'stretch',border:'1px solid #e2e8f0',borderRadius:'7px',overflow:'hidden',background:'white',height:'26px' }}>
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={(e:any)=>{ const v=parseFloat(e.target.value); if(!isNaN(v)) onChange(clamp(v)) }}
        onBlur={(e:any)=>{ const v=parseFloat(e.target.value); onChange(clamp(isNaN(v)?min:v)) }}
        className="num-stepper-input"
        style={{ width:'40px',padding:'0 0 0 7px',border:'none',outline:'none',fontSize:'11px',fontWeight:700,color:'#1e293b',textAlign:'right',background:'transparent' }}
      />
      {unit && <span style={{ fontSize:'10px',color:'#94a3b8',display:'flex',alignItems:'center',paddingRight:'3px' }}>{unit}</span>}
      <div style={{ display:'flex',flexDirection:'column',borderLeft:'1px solid #e2e8f0',width:'16px' }}>
        <button type="button" onClick={()=>onChange(clamp(value+step))} style={{ flex:1,border:'none',background:'#f8fafc',cursor:'pointer',fontSize:'7px',lineHeight:1,color:accent,padding:0 }}>▲</button>
        <button type="button" onClick={()=>onChange(clamp(value-step))} style={{ flex:1,border:'none',borderTop:'1px solid #e2e8f0',background:'#f8fafc',cursor:'pointer',fontSize:'7px',lineHeight:1,color:accent,padding:0 }}>▼</button>
      </div>
    </div>
  )
}

function MiniCal({ anio,mes,paleta,colorDom }:{ anio:number;mes:number;paleta:Paleta;colorDom:string }) {
  const dias = getDiasTrad(anio,mes)
  return (
    <div style={{ width:'245px' }}>
      <div style={{ fontSize:'18px',fontWeight:900,color:paleta.header,textAlign:'center',marginBottom:'6px',letterSpacing:'-0.3px',whiteSpace:'nowrap' }}>
        {MESES[mes].toUpperCase()}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'2px' }}>
        {DIAS_CORTOS.map((d,i)=><div key={i} style={{ textAlign:'center',fontSize:'16px',fontWeight:800,color:i===0?colorDom:paleta.acento,padding:'2px 0' }}>{d}</div>)}
        {dias.map((d,i)=><div key={i} style={{ textAlign:'center',fontSize:'17px',fontWeight:700,color:!d?'transparent':i%7===0?colorDom:paleta.texto,padding:'1px 0' }}>{d||'·'}</div>)}
      </div>
    </div>
  )
}

// ── Página de grilla del mes (sin foto, hoja completa) ────────────────────────
function PaginaCalendario({ mesIdx,anio,paleta,fuente,titulo,subtitulo,isPreview,tamFuente,fondoMes,fondoGridOpacity,fondoZoom,fondoPosX,fondoPosY,onFondoDragStart }:{
  mesIdx:number;anio:number;paleta:Paleta;fuente:string;titulo:string;subtitulo:string;isPreview:boolean;tamFuente:number;fondoMes?:string;fondoGridOpacity:number;fondoZoom?:number;fondoPosX?:number;fondoPosY?:number;onFondoDragStart?:(e:React.MouseEvent)=>void
}) {
  const dias      = getDiasTrad(anio,mesIdx)
  const fases     = FASES[`${anio}-${mesIdx}`] ?? []
  const faseMap:Record<number,FaseLunar> = {}
  fases.forEach(f=>{ faseMap[f.dia]=f })
  const rows:(number|null)[][] = []
  for (let i=0;i<dias.length;i+=7) rows.push(dias.slice(i,i+7))
  const prevMes = mesIdx===0?{a:anio-1,m:11}:{a:anio,m:mesIdx-1}
  const nextMes = mesIdx===11?{a:anio+1,m:0}:{a:anio,m:mesIdx+1}
  const colorDom = paleta.acento
  const colorHdr = paleta.header
  const colorTxt = paleta.texto
  const fondo    = paleta.fondo==='#0f172a'?'#1e293b':'#ffffff'

  return (
    <div style={{
      width:'100%', height: isPreview ? '100%' : undefined,
      minHeight: isPreview ? undefined : '100vh',
      background:fondo, fontFamily:fuente,
      display:'flex', flexDirection:'column',
      padding:'16px 32px 12px', boxSizing:'border-box',
      pageBreakAfter:'always', pageBreakInside:'avoid',
      overflow:'hidden', position:'relative',
    }}>
      {/* Fondo de mes: elemento posicionado y agarrable como el logo */}
      {fondoMes && (
        <div
          onMouseDown={onFondoDragStart}
          style={{
            position:'absolute',
            left:`${fondoPosX??50}%`, top:`${fondoPosY??50}%`,
            width:`${fondoZoom??100}%`, height:`${fondoZoom??100}%`,
            transform:'translate(-50%,-50%)',
            backgroundImage:`url('${fondoMes}')`,
            backgroundSize:'cover', backgroundPosition:'center',
            opacity:fondoGridOpacity, zIndex:0,
            cursor:onFondoDragStart?'grab':'default',
          }}
        />
      )}
      {/* Header: mini prev | AÑO GRANDE + MES | mini next */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px',position:'relative',zIndex:1 }}>
        <MiniCal anio={prevMes.a} mes={prevMes.m} paleta={paleta} colorDom={colorDom}/>
        <div style={{ textAlign:'center',flex:1 }}>
          <div style={{ fontSize:'clamp(56px,10.5vw,100px)',fontWeight:900,color:colorDom,letterSpacing:'10px',lineHeight:1 }}>{anio}</div>
          <div style={{ fontSize:'clamp(38px,7.5vw,72px)',fontWeight:900,color:colorHdr,letterSpacing:'12px',lineHeight:1.1 }}>{MESES[mesIdx].toUpperCase()}</div>
          {subtitulo && <div style={{ fontSize:'clamp(11px,1.6vw,15px)',color:`${colorHdr}88`,marginTop:'6px',letterSpacing:'2px',fontWeight:600 }}>{subtitulo.toUpperCase()}</div>}
        </div>
        <MiniCal anio={nextMes.a} mes={nextMes.m} paleta={paleta} colorDom={colorDom}/>
      </div>

      {/* Header días */}
      <div style={{ display:'grid',gridTemplateColumns:'34px repeat(7,1fr)',background:`${colorHdr}10`,borderRadius:'6px',padding:'4px 0',marginBottom:'4px',position:'relative',zIndex:1 }}>
        <div style={{ textAlign:'center',fontSize:'8px',fontWeight:700,color:`${colorHdr}88` }}>SEM</div>
        {DIAS_NOMBRES.map((d,i)=>(
          <div key={i} style={{ textAlign:'center',fontSize:'clamp(7px,1.2vw,11px)',fontWeight:800,color:i===0?colorDom:colorHdr,letterSpacing:'0.5px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Filas del calendario */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'2px',position:'relative',zIndex:1 }}>
        {rows.map((row,ri)=>{
          const primer = row.find(d=>d!==null)
          const nSem   = primer ? getNumSemana(anio,mesIdx,primer) : ''
          return (
            <div key={ri} style={{ display:'grid',gridTemplateColumns:'34px repeat(7,1fr)',flex:1 }}>
              <div style={{ textAlign:'center',fontSize:'8px',color:`${colorHdr}aa`,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',border:`4px solid ${colorHdr}e6` }}>
                {nSem}
              </div>
              {row.map((dia,ci)=>{
                const esDom   = ci===0
                const feriado = dia ? getFeriado(anio,mesIdx,dia) : null
                const fase    = dia ? faseMap[dia] : null
                const isHoy   = dia===new Date().getDate()&&mesIdx===new Date().getMonth()&&anio===new Date().getFullYear()
                return (
                  <div key={ci} style={{
                    border:`4px solid ${colorHdr}e6`,
                    padding:'4px 6px',display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'space-between',
                    background:isHoy?`${colorDom}20`:feriado?`${colorDom}08`:'transparent',
                    position:'relative', overflow:'hidden',
                  }}>
                    {dia && <>
                      <div style={{ width:'100%',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'2px' }}>
                        {fase && <div style={{ fontSize:`${Math.round(tamFuente*0.8)}px`,lineHeight:1 }}>{ICONO_FASE[fase.tipo]}</div>}
                        {feriado&&!fase && <div style={{ fontSize:`${Math.round(tamFuente*0.4)}px`,color:colorDom,lineHeight:1.05,maxWidth:'100%',fontWeight:700 }}>{feriado}</div>}
                      </div>
                      <div style={{ fontSize:`${tamFuente}px`,fontWeight:900,color:isHoy?colorDom:esDom||feriado?colorDom:colorTxt,lineHeight:1.1,alignSelf:'flex-end',WebkitTextStroke:'0.4px currentColor' as any }}>{dia}</div>
                    </>}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Footer fases */}
      {fases.length>0 && (
        <div style={{ display:'flex',gap:'18px',justifyContent:'center',marginTop:'8px',flexWrap:'wrap',borderTop:`1.5px solid ${colorHdr}33`,paddingTop:'8px',position:'relative',zIndex:1 }}>
          {fases.map((f,i)=>(
            <span key={i} style={{ fontSize:'clamp(11px,1.6vw,15px)',color:colorHdr,fontWeight:700,display:'flex',alignItems:'center',gap:'5px' }}>
              <span style={{ fontSize:'clamp(14px,2.2vw,20px)' }}>{ICONO_FASE[f.tipo]}</span>
              <span>{f.dia} {LABEL_FASE[f.tipo]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EditorCalendario({ setVista,guardarDiseno,disenoInicial }:{
  setVista:(v:any)=>void; guardarDiseno:(d:any)=>string|undefined; disenoInicial?:any
}) {
  const d0 = disenoInicial?.data
  const [anio,       setAnio]      = useState(disenoInicial?.anio ?? new Date().getFullYear())
  const [fuente,     setFuente]    = useState(disenoInicial?.fuente ?? 'Arial')
  const [paleta,     setPaleta]    = useState<Paleta>(disenoInicial?.paleta ?? PALETAS[0])
  const [titulo,     setTitulo]    = useState(disenoInicial?.titulo ?? 'Mi Calendario')
  const [tamano,     setTamano]    = useState(disenoInicial?.tamano ?? 'pared-a4')
  const [showTamPanel,setShowTamPanel] = useState(false)
  const [foto,       setFoto]      = useState<string|undefined>(d0?.foto)
  const [exportando, setExp]       = useState(false)
  const [toast,      setToast]     = useState<string|null>(null)
  const [guardado,   setGuardado]  = useState(!!disenoInicial) // si ya existe, ya está "guardado"
  const [mesActivo,  setMesActivo] = useState(0)
  const [vistaPreview, setVistaPreview] = useState<'foto'|'calendario'>('foto')
  const [tamFuente, setTamFuente] = useState(d0?.tamFuente ?? 18) // tamaño base del número del día en px (a escala A4)
  const [subtitulo, setSubtitulo] = useState(d0?.subtitulo ?? 'Mi Calendario')
  const [fondosMes, setFondosMes] = useState<(string|undefined)[]>(d0?.fondosMes ?? Array(12).fill(undefined))
  const [fondoGridOpacity, setFondoGridOpacity] = useState(d0?.fondoGridOpacity ?? 0.15)
  const [showFondoPanel, setShowFondoPanel] = useState(false)
  const [mesFondoActivo, setMesFondoActivo] = useState(0)
  // Foto principal: zoom y posición
  const [fotoZoom, setFotoZoom] = useState<number>(d0?.fotoZoom ?? 100)
  const [fotoPosX, setFotoPosX] = useState<number>(d0?.fotoPosX ?? 50)
  const [fotoPosY, setFotoPosY] = useState<number>(d0?.fotoPosY ?? 50)
  // Fondo de mes: zoom y posición por mes
  const [fondosMesZoom, setFondosMesZoom] = useState<number[]>(d0?.fondosMesZoom ?? Array(12).fill(100))
  const [fondosMesPosX, setFondosMesPosX] = useState<number[]>(d0?.fondosMesPosX ?? Array(12).fill(50))
  const [fondosMesPosY, setFondosMesPosY] = useState<number[]>(d0?.fondosMesPosY ?? Array(12).fill(50))
  // Logo
  const [logo,        setLogo]        = useState<string|undefined>(d0?.logo)
  const [logoX,       setLogoX]       = useState(d0?.logoX ?? 85)
  const [logoY,       setLogoY]       = useState(d0?.logoY ?? 10)
  const [logoSize,    setLogoSize]    = useState(d0?.logoSize ?? 8)
  const [logoOpacity, setLogoOpacity] = useState(d0?.logoOpacity ?? 1)
  const [showLogo,    setShowLogo]    = useState(false)
  const [idDiseno,    setIdDiseno]    = useState<string|undefined>(disenoInicial?.id)
  const previewRef      = useRef<HTMLDivElement>(null)   // ref del contenedor de la foto (para drag del logo)
  const containerFotoRef = useRef<HTMLDivElement>(null)  // ref explícita del div foto (fix drag)
  const calPreviewRef    = useRef<HTMLDivElement>(null)  // ref del contenedor del calendario (fondo drag)
  const logoData = logo ? { src:logo,x:logoX,y:logoY,size:logoSize,opacity:logoOpacity } : undefined
  const tam = getTam(tamano)

  // Si el usuario hace cambios después de guardar, vuelve a mostrar "Guardar"
  const yaMontado = useRef(false)
  useEffect(() => {
    if (!yaMontado.current) { yaMontado.current = true; return }
    setGuardado(false)
  }, [titulo, paleta, fuente, tamano, anio, foto, subtitulo, tamFuente, fondosMes, fondoGridOpacity, logo, logoX, logoY, logoSize, logoOpacity, fotoZoom, fotoPosX, fotoPosY, fondosMesZoom, fondosMesPosX, fondosMesPosY])

  function subirFoto() {
    const i=document.createElement('input'); i.type='file'; i.accept='image/*'
    i.onchange=(e:any)=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=(ev:any)=>setFoto(ev.target.result); r.readAsDataURL(f) }
    i.click()
  }
  function subirLogo() {
    const i=document.createElement('input'); i.type='file'; i.accept='image/*'
    i.onchange=(e:any)=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=(ev:any)=>{ setLogo(ev.target.result); setShowLogo(true) }; r.readAsDataURL(f) }
    i.click()
  }
  function subirFondoGrid(mes:number) {
    const i=document.createElement('input'); i.type='file'; i.accept='image/*'
    i.onchange=(e:any)=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=(ev:any)=>{
      setFondosMes(prev=>{ const copia=[...prev]; copia[mes]=ev.target.result; return copia })
    }; r.readAsDataURL(f) }
    i.click()
  }
  function quitarFondoMes(mes:number) {
    setFondosMes(prev=>{ const copia=[...prev]; copia[mes]=undefined; return copia })
  }
  function aplicarFondoATodos(mes:number) {
    const img = fondosMes[mes]
    if (!img) return
    setFondosMes(Array(12).fill(img))
  }

  // ── Drag: FOTO PRINCIPAL (igual que el logo: agarrás y movés) ────────────
  function handleFotoPanStart(e:React.MouseEvent) {
    if(!containerFotoRef.current) return
    e.preventDefault(); e.stopPropagation()
    const r   = containerFotoRef.current.getBoundingClientRect()
    const sx  = e.clientX, sy = e.clientY
    const spx = fotoPosX,  spy = fotoPosY
    let moved = false
    function onMove(ev:MouseEvent) {
      const dx=ev.clientX-sx, dy=ev.clientY-sy
      if(!moved && Math.abs(dx)+Math.abs(dy)<4) return
      moved=true
      // El elemento sigue al mouse directamente (como el logo)
      setFotoPosX(spx + (dx/r.width)*100)
      setFotoPosY(spy + (dy/r.height)*100)
    }
    function onUp() {
      document.removeEventListener('mousemove',onMove)
      document.removeEventListener('mouseup',onUp)
      if(!moved) subirFoto()   // click sin movimiento → abrir selector
    }
    document.addEventListener('mousemove',onMove)
    document.addEventListener('mouseup',onUp)
  }

  // ── Drag: FONDO DE MES en mini preview del panel ──────────────────────────
  function handleFondoPanStart(e:React.MouseEvent, mes:number) {
    e.preventDefault(); e.stopPropagation()
    // El rect se toma del CONTENEDOR (parentElement), no del elemento imagen
    const r   = (e.currentTarget as HTMLDivElement).parentElement!.getBoundingClientRect()
    const sx  = e.clientX, sy = e.clientY
    const spx = fondosMesPosX[mes], spy = fondosMesPosY[mes]
    function onMove(ev:MouseEvent) {
      const dx=ev.clientX-sx, dy=ev.clientY-sy
      setFondosMesPosX(prev=>{const c=[...prev];c[mes]=spx+(dx/r.width)*100;return c})
      setFondosMesPosY(prev=>{const c=[...prev];c[mes]=spy+(dy/r.height)*100;return c})
    }
    function onUp() { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp) }
    document.addEventListener('mousemove',onMove)
    document.addEventListener('mouseup',onUp)
  }

  // ── Drag: FONDO DE MES en la Vista Calendario ─────────────────────────────
  function handleFondoCalDragStart(e:React.MouseEvent) {
    if(!calPreviewRef.current) return
    e.preventDefault(); e.stopPropagation()
    const r   = calPreviewRef.current.getBoundingClientRect()
    const sx  = e.clientX, sy = e.clientY
    const mes = mesActivo
    const spx = fondosMesPosX[mes], spy = fondosMesPosY[mes]
    function onMove(ev:MouseEvent) {
      const dx=ev.clientX-sx, dy=ev.clientY-sy
      setFondosMesPosX(prev=>{const c=[...prev];c[mes]=spx+(dx/r.width)*100;return c})
      setFondosMesPosY(prev=>{const c=[...prev];c[mes]=spy+(dy/r.height)*100;return c})
    }
    function onUp() { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp) }
    document.addEventListener('mousemove',onMove)
    document.addEventListener('mouseup',onUp)
  }

  function handleLogoDrag(e:React.MouseEvent) {
    // Usamos containerFotoRef que apunta al div CONTENEDOR de la foto,
    // no al logo mismo — así las coordenadas son relativas al contenedor correcto.
    const ref = containerFotoRef.current ?? previewRef.current
    if(!ref) return; e.preventDefault(); e.stopPropagation()
    const rect = ref.getBoundingClientRect()
    function onMove(ev:MouseEvent) {
      ev.preventDefault()
      setLogoX(Math.min(95,Math.max(2,((ev.clientX-rect.left)/rect.width)*100)))
      setLogoY(Math.min(95,Math.max(2,((ev.clientY-rect.top)/rect.height)*100)))
    }
    function onUp() { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp) }
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp)
  }

  // ── Generar HTML de una grilla de mes para PDF/print ─────────────────────
  // Todos los tamaños se calculan en proporción al tamaño REAL de la hoja (pxW × pxH)
  // y a la cantidad de filas que tiene ESE mes en particular (algunos meses tienen
  // 5 semanas, otros 6). Así la página siempre queda completa, sin cortes ni
  // márgenes de sobra, sin importar el tamaño de papel que se elija (A4, A3, etc).
  // ── Convierte posición(%) + zoom(%) en píxeles EXACTOS ────────────────────
  // En vez de dejar que el navegador calcule porcentajes + transform (lo cual
  // Chrome a veces resuelve mal al imprimir páginas con salto de página),
  // calculamos nosotros mismos la posición final en píxeles. Así no le dejamos
  // nada a Chrome para "interpretar" — el resultado es idéntico en pantalla,
  // en el PDF y al imprimir.
  function calcPosicionPx(contW:number, contH:number, posX:number, posY:number, zoom:number) {
    const w = contW * zoom / 100
    const h = contH * zoom / 100
    const left = (contW * posX / 100) - w / 2
    const top  = (contH * posY / 100) - h / 2
    return { left: Math.round(left), top: Math.round(top), w: Math.round(w), h: Math.round(h) }
  }

  // ── Igual que arriba, pero para el LOGO: ancho y alto se calculan con la
  // MISMA referencia (el ancho de la página) para garantizar que el logo
  // sea SIEMPRE un círculo perfecto, sin importar si el papel es horizontal,
  // vertical o cuadrado. Si se calculara el alto en base a pxH (como hace
  // calcPosicionPx para fotos/fondos), en papel no cuadrado el resultado es
  // un óvalo en vez de un círculo.
  function calcLogoPx(pxW:number, pxH:number, posX:number, posY:number, sizePct:number) {
    const w = pxW * sizePct / 100
    const h = w
    const left = (pxW * posX / 100) - w / 2
    const top  = (pxH * posY / 100) - h / 2
    return { left: Math.round(left), top: Math.round(top), w: Math.round(w), h: Math.round(h) }
  }

  function generarGrillaHTML(idx:number, pxW:number, pxH:number, tamFuente:number): string {
    const dias=getDiasTrad(anio,idx)
    const fases=FASES[`${anio}-${idx}`]??[]
    const faseMap:Record<number,FaseLunar>={}
    fases.forEach(f=>{ faseMap[f.dia]=f })
    const rows:(number|null)[][]=[]
    for(let i=0;i<dias.length;i+=7) rows.push(dias.slice(i,i+7))
    const numFilas = rows.length
    const prevMes=idx===0?{a:anio-1,m:11}:{a:anio,m:idx-1}
    const nextMes=idx===11?{a:anio+1,m:0}:{a:anio,m:idx+1}
    const cd=paleta.acento, ch=paleta.header, ct=paleta.texto
    const fondo=paleta.fondo==='#0f172a'?'#1e293b':'#ffffff'

    // ── Escalas: todo proporcional a pxW/pxH (el tamaño real de la hoja elegida) ──
    const padTop    = Math.round(pxH*0.020)
    const padBottom = Math.round(pxH*0.015)
    const padLR     = Math.round(pxW*0.0285)
    const colSemana = Math.round(pxW*0.0303)

    const fontAnio = Math.round(pxW*0.082)
    const fontMes  = Math.round(pxW*0.060)
    const fontSub  = Math.round(pxW*0.0125)
    const altoHeaderTxt = Math.round(fontAnio*1.0 + fontMes*1.12 + (subtitulo ? fontSub*1.3+pxH*0.008 : 0))
    const margenHeader  = Math.round(pxH*0.018)

    const fontDiaSemana    = Math.round(pxH*0.0145)
    const fontSem           = Math.round(pxH*0.0113)
    const altoFilaNombres   = Math.round(pxH*0.028)
    const margenFilaNombres = Math.round(pxH*0.005)

    const altoFooter    = fases.length>0 ? Math.round(pxH*0.047) : 0
    const escalaFooter  = fases.length>=5 ? 0.8 : 1
    const fontFooterTxt = Math.round(pxW*0.012*escalaFooter)
    const fontFooterIco = Math.round(pxW*0.016*escalaFooter)
    const gapFooter      = Math.max(5, Math.round(pxW*0.011*escalaFooter))

    const gapFila  = 2
    const gapTotal = gapFila*(numFilas-1)

    // Alto disponible para la grilla de días, repartido entre las filas REALES de este mes (5 o 6).
    // Esto es lo que garantiza que nunca se corte: la fila se calcula del espacio que sobra,
    // no al revés.
    const alturaUsada = padTop+padBottom+altoHeaderTxt+margenHeader+altoFilaNombres+margenFilaNombres+altoFooter+gapTotal
    const altoFila = Math.max((pxH-alturaUsada)/numFilas, pxH*0.07)

    // El tamaño del número del día respeta el control manual del usuario (tamFuente),
    // pero nunca se permite que sea más grande de lo que realmente cabe en la fila calculada.
    const fontDiaCabe = Math.round(altoFila*0.40)
    const fsPx = Math.min(Math.round(tamFuente*1.6), fontDiaCabe)
    const padCeldaV = Math.max(2, Math.round(altoFila*0.07))
    const padCeldaH = Math.max(2, Math.round(pxW*0.00713))

    const anchoMini = Math.round(pxW*0.218)

    function miniStr(a:number,m:number) {
      const d=getDiasTrad(a,m)
      const fT=Math.round(anchoMini*0.0735), fD=Math.round(anchoMini*0.0653), fN=Math.round(anchoMini*0.0694)
      return `<div style="width:${anchoMini}px;font-family:${fuente}">
        <div style="font-size:${fT}px;font-weight:900;color:${ch};text-align:center;margin-bottom:6px;letter-spacing:-0.3px;white-space:nowrap">${MESES[m].toUpperCase()}</div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">
          ${DIAS_CORTOS.map((dc,i)=>`<div style="text-align:center;font-size:${fD}px;font-weight:800;color:${i===0?cd:ch};padding:2px 0">${dc}</div>`).join('')}
          ${d.map((dia,i)=>`<div style="text-align:center;font-size:${fN}px;font-weight:700;color:${!dia?'transparent':i%7===0?cd:ct};padding:1px 0">${dia||'·'}</div>`).join('')}
        </div>
      </div>`
    }

    const rowsStr=rows.map(row=>{
      const primer=row.find(d=>d!==null)
      const nSem=primer?getNumSemana(anio,idx,primer):''
      return `<div style="display:grid;grid-template-columns:${colSemana}px repeat(7,1fr);height:${Math.round(altoFila)}px">
        <div style="text-align:center;font-size:${fontSem}px;color:${ch};font-weight:900;display:flex;align-items:center;justify-content:center;border:5px solid ${ch}e6">${nSem}</div>
        ${row.map((dia,ci)=>{
          const esDom=ci===0, feriado=dia?getFeriado(anio,idx,dia):null, fase=dia?faseMap[dia]:null
          const isHoy=dia===new Date().getDate()&&idx===new Date().getMonth()&&anio===new Date().getFullYear()
          return `<div style="border:5px solid ${ch}e6;padding:${padCeldaV}px ${padCeldaH}px;display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;overflow:hidden;${feriado?`background:${cd}08;`:''}${isHoy?`background:${cd}20;`:''}">
            ${dia?`<div style="width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:3px">
              ${fase?`<div style="font-size:${Math.round(fsPx*0.8)}px">${ICONO_FASE[fase.tipo]}</div>`:''}
              ${feriado&&!fase?`<div style="font-size:${Math.round(fsPx*0.4)}px;color:${cd};line-height:1.05;max-width:100%;font-weight:700">${feriado}</div>`:''}
            </div>
            <div style="font-size:${fsPx}px;font-weight:900;color:${isHoy?cd:esDom||feriado?cd:ct};line-height:1.1;align-self:flex-end;-webkit-text-stroke:0.4px currentColor;text-stroke:0.4px currentColor">${dia}</div>`:''}
          </div>`
        }).join('')}
      </div>`
    }).join('')

    return `<div style="width:${pxW}px;height:${pxH}px;background:${fondo};font-family:${fuente};display:flex;flex-direction:column;padding:${padTop}px ${padLR}px ${padBottom}px;box-sizing:border-box;overflow:hidden;position:relative">
      ${fondosMes[idx]?(()=>{ const p=calcPosicionPx(pxW,pxH,fondosMesPosX[idx],fondosMesPosY[idx],fondosMesZoom[idx]); return `<div style="position:absolute;left:${p.left}px;top:${p.top}px;width:${p.w}px;height:${p.h}px;background:url('${fondosMes[idx]}') center/cover;opacity:${fondoGridOpacity};z-index:0;"></div>` })():''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${margenHeader}px;position:relative;z-index:1">
        ${miniStr(prevMes.a,prevMes.m)}
        <div style="text-align:center;flex:1">
          <div style="font-size:${fontAnio}px;font-weight:900;color:${cd};letter-spacing:10px;line-height:1">${anio}</div>
          <div style="font-size:${fontMes}px;font-weight:900;color:${ch};letter-spacing:12px;line-height:1.1">${MESES[idx].toUpperCase()}</div>
          ${subtitulo?`<div style="font-size:${fontSub}px;color:${ch}88;margin-top:6px;letter-spacing:2px;font-weight:600">${subtitulo.toUpperCase()}</div>`:''}
        </div>
        ${miniStr(nextMes.a,nextMes.m)}
      </div>
      <div style="display:grid;grid-template-columns:${colSemana}px repeat(7,1fr);background:${ch}10;border-radius:6px;height:${altoFilaNombres}px;align-items:center;margin-bottom:${margenFilaNombres}px;position:relative;z-index:1">
        <div style="text-align:center;font-size:${fontSem}px;font-weight:900;color:${ch}">SEM</div>
        ${DIAS_NOMBRES.map((d,i)=>`<div style="text-align:center;font-size:${fontDiaSemana}px;font-weight:900;color:${i===0?cd:ch};-webkit-text-stroke:0.3px currentColor">${d}</div>`).join('')}
      </div>
      <div style="display:flex;flex-direction:column;gap:${gapFila}px;position:relative;z-index:1">${rowsStr}</div>
      ${fases.length>0?`<div style="display:flex;gap:${gapFooter}px;justify-content:center;height:${altoFooter}px;align-items:center;flex-wrap:nowrap;overflow:hidden;border-top:1.5px solid ${ch}33;position:relative;z-index:1">${fases.map(f=>`<span style="font-size:${fontFooterTxt}px;color:${ch};font-weight:700;display:flex;align-items:center;gap:5px;white-space:nowrap;flex-shrink:0"><span style="font-size:${fontFooterIco}px">${ICONO_FASE[f.tipo]}</span><span>${f.dia} ${LABEL_FASE[f.tipo]}</span></span>`).join('')}</div>`:''}
    </div>`
  }

  // ── Exportar PDF: 1 foto + 12 grillas ────────────────────────────────────
  async function exportarPDFCalendario() {
    setExp(true); showToast(setToast,'⏳ Generando PDF de 13 páginas...')
    try {
      const pxW = Math.round(tam.w*3.7795)
      const pxH = Math.round(tam.h*3.7795)
      const pdf  = new jsPDF({ orientation:tam.w>tam.h?'landscape':'portrait', unit:'mm', format:[tam.w,tam.h] })
      const wrap = document.createElement('div')
      wrap.style.cssText=`position:fixed;left:-9999px;top:0;width:${pxW}px;height:${pxH}px;overflow:hidden;`
      document.body.appendChild(wrap)

      // ── Página 1: FOTO ──
      const fotoStrPdf = foto ? (()=>{ const p=calcPosicionPx(pxW,pxH,fotoPosX,fotoPosY,fotoZoom); return `<div style="position:absolute;left:${p.left}px;top:${p.top}px;width:${p.w}px;height:${p.h}px;background:url('${foto}') center/cover;z-index:1"></div>` })() : ''
      const logoStrPdf = logoData ? (()=>{ const p=calcLogoPx(pxW,pxH,logoData.x,logoData.y,logoData.size); return `<div style="position:absolute;left:${p.left}px;top:${p.top}px;width:${p.w}px;height:${p.h}px;border-radius:50%;background:url('${logoData.src}') center/cover;opacity:${logoData.opacity};z-index:8;box-shadow:0 4px 16px rgba(0,0,0,0.3);border:3px solid rgba(255,255,255,0.8)"></div>` })() : ''
      wrap.innerHTML=`<div style="width:${pxW}px;height:${pxH}px;overflow:hidden;position:relative;background:${paleta.fondo==='#0f172a'?'#1e293b':'#e8ecf0'}">
        ${fotoStrPdf}
        ${logoStrPdf}
      </div>`
      await new Promise(r=>setTimeout(r,200))
      let canvas=await html2canvas(wrap,{scale:3,useCORS:true,allowTaint:true,backgroundColor:paleta.fondo,logging:false,width:pxW,height:pxH})
      pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,tam.w,tam.h)
      showToast(setToast,'⏳ Foto lista — generando meses...')

      // ── Páginas 2-13: GRILLAS ──
      for(let idx=0;idx<12;idx++) {
        wrap.innerHTML=generarGrillaHTML(idx,pxW,pxH,tamFuente)
        await new Promise(r=>setTimeout(r,150))
        canvas=await html2canvas(wrap,{scale:3,useCORS:true,allowTaint:true,backgroundColor:paleta.fondo==='#0f172a'?'#1e293b':'#ffffff',logging:false,width:pxW,height:pxH})
        pdf.addPage([tam.w,tam.h])
        pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,tam.w,tam.h)
        showToast(setToast,`⏳ Mes ${idx+1} de 12...`)
      }

      document.body.removeChild(wrap)
      const blob=pdf.output('blob'), url=URL.createObjectURL(blob)
      const a=document.createElement('a'); a.href=url; a.download=`${titulo}-${anio}.pdf`; a.style.display='none'
      document.body.appendChild(a); a.click()
      setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url) },2000)
      showToast(setToast,'✅ PDF de 13 páginas descargado (1 foto + 12 meses)')
    } catch(e:any) { showToast(setToast,`❌ Error: ${e?.message}`) }
    setExp(false)
  }

  // ── Imprimir: 1 foto + 12 grillas ────────────────────────────────────────
  function imprimirCalendario() {
    const previo=document.getElementById('print-cal-root'); if(previo) previo.remove()
    const prevSt=document.getElementById('print-cal-style'); if(prevSt) prevSt.remove()
    const pxW = Math.round(tam.w*3.7795)
    const pxH = Math.round(tam.h*3.7795)

    const logoStr=logoData?(()=>{ const p=calcLogoPx(pxW,pxH,logoData.x,logoData.y,logoData.size); return `<div style="position:absolute;left:${p.left}px;top:${p.top}px;width:${p.w}px;height:${p.h}px;border-radius:50%;background:url('${logoData.src}') center/cover;opacity:${logoData.opacity};z-index:8;box-shadow:0 4px 16px rgba(0,0,0,0.3);border:3px solid rgba(255,255,255,0.8)"></div>` })():''

    // Página 1: foto — todo en píxeles exactos (ver calcPosicionPx), sin porcentajes
    // ni transform, para que Chrome no tenga margen de error al paginar la impresión
    const fotoStr = foto ? (()=>{ const p=calcPosicionPx(pxW,pxH,fotoPosX,fotoPosY,fotoZoom); return `<div style="position:absolute;left:${p.left}px;top:${p.top}px;width:${p.w}px;height:${p.h}px;background:url('${foto}') center/cover;z-index:1"></div>` })() : ''
    const paginaFoto=`<div style="width:${pxW}px;height:${pxH}px;overflow:hidden;position:relative;background:${paleta.fondo==='#0f172a'?'#1e293b':'#e8ecf0'}">${fotoStr} ${logoStr}</div>`

    // Páginas 2-13: grillas — se reutiliza exactamente la misma función que genera el PDF,
    // así la impresión y el PDF nunca pueden desincronizarse, y ambos quedan con el
    // mismo ajuste automático de tamaño según el papel y la cantidad de filas del mes.
    const paginasGrillas = MESES.map((_,idx) => generarGrillaHTML(idx, pxW, pxH, tamFuente)).join('')

    const container=document.createElement('div'); container.id='print-cal-root'
    container.innerHTML=paginaFoto+paginasGrillas
    document.body.appendChild(container)

    const style=document.createElement('style'); style.id='print-cal-style'
    style.innerHTML=`
      @page { size: ${tam.css} !important; margin: 0 !important; }
      html,body { margin:0 !important; padding:0 !important; width:100% !important; }
      * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }
      @media screen { #print-cal-root { display:none; } }
      @media print {
        body > *:not(#print-cal-root) { display:none !important; }
        #print-cal-root { display:block !important; }
        #print-cal-root > div { page-break-after:always !important; page-break-inside:avoid !important; overflow:hidden !important; }
        #print-cal-root > div:last-child { page-break-after:auto !important; }
      }
    `
    document.head.appendChild(style)
    setTimeout(()=>{ window.print(); setTimeout(()=>{ container.remove(); style.remove() },1500) },400)
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100vh',display:'flex',flexDirection:'column',background:'#f8fafc' }}>
      <style>{`
        .num-stepper-input::-webkit-outer-spin-button,
        .num-stepper-input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
        .num-stepper-input { -moz-appearance:textfield; appearance:textfield; }
      `}</style>

      {/* TOOLBAR */}
      <div style={{ background:'white',borderBottom:'1px solid #e2e8f0',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap' }}>
        <BtnVolver setVista={setVista}/>
        <input value={titulo} onChange={(e:any)=>setTitulo(e.target.value)}
          style={{ padding:'6px 12px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'13px',fontWeight:600,width:'170px',outline:'none' }}/>
        <div style={{ width:'1px',height:'24px',background:'#e2e8f0' }}/>
        <SelectorFuente fuente={fuente} setFuente={setFuente}/>

        {/* Selector tamaño */}
        <div style={{ position:'relative' }}>
          <button onClick={()=>setShowTamPanel(v=>!v)} style={{ padding:'6px 12px',borderRadius:'8px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#64748b',whiteSpace:'nowrap' }}>
            📐 {tam.nombre} ▾
          </button>
          {showTamPanel && (
            <div onClick={e=>e.stopPropagation()} style={{ position:'absolute',top:'calc(100% + 4px)',left:0,background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',boxShadow:'0 10px 30px rgba(0,0,0,0.12)',padding:'14px',zIndex:300,width:'260px',maxHeight:'380px',overflowY:'auto' }}>
              <div style={{ fontSize:'11px',fontWeight:700,color:'#94a3b8',marginBottom:'10px' }}>TAMAÑO DE PAPEL</div>
              {TAMANOS_CAL.map(cat=>(
                <div key={cat.cat} style={{ marginBottom:'12px' }}>
                  <div style={{ fontSize:'10px',fontWeight:700,color:'#94a3b8',marginBottom:'6px' }}>{cat.cat}</div>
                  {cat.items.map(item=>(
                    <button key={item.id} onClick={()=>{ setTamano(item.id); setShowTamPanel(false) }} style={{ width:'100%',padding:'8px',borderRadius:'8px',textAlign:'left',cursor:'pointer',border:'none',background:tamano===item.id?'#eff6ff':'#f8fafc',outline:tamano===item.id?'2px solid #3b82f6':'none',marginBottom:'4px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                      <span style={{ fontSize:'12px',fontWeight:700,color:'#1e293b' }}>{item.nombre}</span>
                      <span style={{ fontSize:'10px',color:'#94a3b8' }}>{item.dim}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Año */}
        <div style={{ display:'flex',alignItems:'center',gap:'4px' }}>
          <button onClick={()=>setAnio(anio-1)} style={{ width:'28px',height:'28px',borderRadius:'6px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer' }}>‹</button>
          <span style={{ fontSize:'13px',fontWeight:700,minWidth:'40px',textAlign:'center' }}>{anio}</span>
          <button onClick={()=>setAnio(anio+1)} style={{ width:'28px',height:'28px',borderRadius:'6px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer' }}>›</button>
        </div>

        {/* Tamaño de letra de los números */}
        <div style={{ display:'flex',alignItems:'center',gap:'6px',padding:'4px 8px',borderRadius:'8px',border:'1px solid #e2e8f0',background:'white' }}>
          <span style={{ fontSize:'12px',color:'#64748b' }}>🔤</span>
          <NumStepper value={tamFuente} onChange={setTamFuente} min={8} max={50} step={1} unit="px" accent={paleta.acento}/>
        </div>

        {/* Subtítulo editable */}
        <input value={subtitulo} onChange={(e:any)=>setSubtitulo(e.target.value)}
          placeholder="Subtítulo (opcional)"
          style={{ padding:'6px 12px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'12px',width:'140px',outline:'none' }}/>

        {/* Fondo de página del calendario (por mes) */}
        <div style={{ position:'relative' }}>
          <button onClick={()=>setShowFondoPanel(v=>!v)} style={{ padding:'6px 10px',borderRadius:'8px',border:'1px solid #e2e8f0',background:fondosMes.some(Boolean)?'#eff6ff':'white',cursor:'pointer',fontSize:'12px',fontWeight:600,color:fondosMes.some(Boolean)?'#3b82f6':'#64748b' }}>
            🎨 Fondo{fondosMes.some(Boolean)?` (${fondosMes.filter(Boolean).length}/12)`:''}
          </button>
          {showFondoPanel && (
            <div onClick={e=>e.stopPropagation()} style={{ position:'absolute',top:'calc(100% + 4px)',left:0,background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',padding:'16px',zIndex:300,width:'380px' }}>
              <div style={{ fontSize:'11px',fontWeight:700,color:'#94a3b8',marginBottom:'10px' }}>FONDO POR MES</div>

              {/* Selector de mes */}
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'4px',marginBottom:'10px' }}>
                {MESES.map((m,i)=>(
                  <button key={i} onClick={()=>setMesFondoActivo(i)} style={{
                    padding:'5px 2px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'10px',fontWeight:700,position:'relative',
                    background:mesFondoActivo===i?paleta.header:'#f1f5f9',
                    color:mesFondoActivo===i?'white':'#64748b',
                  }}>
                    {m.slice(0,3)}
                    {fondosMes[i] && <span style={{ position:'absolute',top:'-3px',right:'-3px',width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',border:'1.5px solid white' }}/>}
                  </button>
                ))}
              </div>

              <div style={{ fontSize:'11px',fontWeight:700,color:paleta.header,marginBottom:'8px' }}>{MESES[mesFondoActivo]}</div>

              <div style={{ display:'flex',gap:'8px',marginBottom:'10px' }}>
                <button onClick={()=>subirFondoGrid(mesFondoActivo)} style={{ flex:1,padding:'7px',borderRadius:'7px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#64748b' }}>📷 Subir</button>
                {fondosMes[mesFondoActivo] && <button onClick={()=>quitarFondoMes(mesFondoActivo)} style={{ padding:'7px 10px',borderRadius:'7px',border:'1px solid #fecaca',background:'#fef2f2',cursor:'pointer',fontSize:'11px',color:'#dc2626' }}>✕</button>}
              </div>

              {fondosMes[mesFondoActivo] && (
                <>
                  {/* Mini preview draggable del fondo del mes */}
                  <div
                    onMouseDown={(e:any)=>handleFondoPanStart(e, mesFondoActivo)}
                    style={{ width:'100%',height:'190px',borderRadius:'10px',backgroundImage:`url('${fondosMes[mesFondoActivo]}')`,backgroundSize:`${fondosMesZoom[mesFondoActivo]}%`,backgroundPosition:`${fondosMesPosX[mesFondoActivo]}% ${fondosMesPosY[mesFondoActivo]}%`,backgroundRepeat:'no-repeat',marginBottom:'8px',border:`2px solid ${paleta.acento}44`,cursor:'grab',userSelect:'none' }}
                  />
                  <div style={{ fontSize:'9px',color:'#94a3b8',marginBottom:'8px',textAlign:'center' }}>✋ Arrastrá la imagen para moverla</div>
                  {/* Zoom del fondo de este mes */}
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px' }}>
                    <span style={{ fontSize:'10px',fontWeight:700,color:'#64748b' }}>🔍 Zoom</span>
                    <NumStepper value={fondosMesZoom[mesFondoActivo]} onChange={(v)=>setFondosMesZoom(prev=>{const c=[...prev];c[mesFondoActivo]=v;return c})} min={20} max={400} step={5} unit="%" accent={paleta.acento}/>
                  </div>
                  <div style={{ display:'flex',gap:'6px',marginBottom:'10px' }}>
                    <button onClick={()=>aplicarFondoATodos(mesFondoActivo)} style={{ flex:1,padding:'6px',borderRadius:'7px',border:'1px solid #e2e8f0',background:'#f8fafc',cursor:'pointer',fontSize:'10px',fontWeight:600,color:paleta.acento }}>
                      📋 Aplicar a los 12 meses
                    </button>
                    <button onClick={()=>{
                      setFondosMesZoom(prev=>{const c=[...prev];c[mesFondoActivo]=100;return c})
                      setFondosMesPosX(prev=>{const c=[...prev];c[mesFondoActivo]=50;return c})
                      setFondosMesPosY(prev=>{const c=[...prev];c[mesFondoActivo]=50;return c})
                    }} style={{ padding:'6px 8px',borderRadius:'7px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'10px',color:'#94a3b8' }}>↺</button>
                  </div>
                </>
              )}

              <div style={{ marginBottom:'4px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <span style={{ fontSize:'10px',fontWeight:700,color:'#64748b' }}>Opacidad (todos los meses)</span>
                <NumStepper value={Math.round(fondoGridOpacity*100)} onChange={(v)=>setFondoGridOpacity(v/100)} min={5} max={100} step={5} unit="%" accent={paleta.acento}/>
              </div>

              <div style={{ fontSize:'10px',color:'#94a3b8',marginTop:'6px' }}>💡 Cada mes puede tener su propia imagen de fondo, o usar el botón para aplicar una a los 12</div>
            </div>
          )}
        </div>

        {/* Foto */}
        <div style={{ display:'flex',gap:'6px',alignItems:'center' }}>
          <button onClick={subirFoto} style={{ padding:'6px 12px',borderRadius:'8px',border:'1px solid #e2e8f0',background:foto?'#eff6ff':'white',cursor:'pointer',fontSize:'12px',fontWeight:600,color:foto?'#3b82f6':'#64748b' }}>
            🖼️ Foto{foto?' ✓':''}
          </button>
          {foto && <button onClick={()=>setFoto(undefined)} style={{ padding:'6px 8px',borderRadius:'8px',border:'1px solid #fecaca',background:'#fef2f2',cursor:'pointer',fontSize:'11px',color:'#dc2626' }}>✕</button>}
        </div>

        {/* Logo */}
        <div style={{ position:'relative' }}>
          <button onClick={()=>setShowLogo(v=>!v)} style={{ padding:'6px 10px',borderRadius:'8px',border:'1px solid #e2e8f0',background:logo?'#eff6ff':'white',cursor:'pointer',fontSize:'12px',fontWeight:600,color:logo?'#3b82f6':'#64748b' }}>
            🏷️ Logo{logo?' ✓':''}
          </button>
          {showLogo && (
            <div onClick={e=>e.stopPropagation()} style={{ position:'absolute',top:'calc(100% + 4px)',left:0,background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.12)',padding:'14px',zIndex:300,width:'220px' }}>
              <div style={{ fontSize:'11px',fontWeight:700,color:'#94a3b8',marginBottom:'10px' }}>LOGO (sobre la foto)</div>
              <div style={{ display:'flex',gap:'8px',marginBottom:'10px' }}>
                <button onClick={subirLogo} style={{ flex:1,padding:'7px',borderRadius:'7px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#64748b' }}>📷 Subir</button>
                {logo && <button onClick={()=>setLogo(undefined)} style={{ padding:'7px 10px',borderRadius:'7px',border:'1px solid #fecaca',background:'#fef2f2',cursor:'pointer',fontSize:'11px',color:'#dc2626' }}>✕</button>}
              </div>
              {logo && <>
                <div style={{ textAlign:'center',marginBottom:'8px' }}>
                  <div style={{ width:'56px',height:'56px',borderRadius:'50%',background:`url('${logo}') center/cover`,margin:'0 auto',border:'2px solid #e2e8f0',opacity:logoOpacity }}/>
                  <div style={{ fontSize:'10px',color:'#94a3b8',marginTop:'4px' }}>{logoSize}% del ancho</div>
                </div>
                {[
                  { label:'Tamaño',value:logoSize,set:setLogoSize,min:3,max:25,step:1,unit:'%' },
                  { label:'Opacidad',value:Math.round(logoOpacity*100),set:(v:number)=>setLogoOpacity(v/100),min:10,max:100,step:5,unit:'%' },
                ].map(item=>(
                  <div key={item.label} style={{ marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <span style={{ fontSize:'10px',fontWeight:700,color:'#64748b' }}>{item.label}</span>
                    <NumStepper value={item.value} onChange={item.set} min={item.min} max={item.max} step={item.step} unit={item.unit} accent={paleta.acento}/>
                  </div>
                ))}
                <div style={{ fontSize:'10px',color:'#94a3b8',textAlign:'center' }}>💡 Arrastrá el logo en la foto</div>
              </>}
            </div>
          )}
        </div>

        <div style={{ marginLeft:'auto',display:'flex',gap:'8px',alignItems:'center' }}>
          <button onClick={()=>{
            const nuevoId = guardarDiseno({
              id: idDiseno,
              tipo:'calendario', titulo, paleta, fuente, tamano, anio,
              data: {
                foto, subtitulo, tamFuente, fondosMes, fondoGridOpacity,
                logo, logoX, logoY, logoSize, logoOpacity,
                fotoZoom, fotoPosX, fotoPosY,
                fondosMesZoom, fondosMesPosX, fondosMesPosY,
              }
            })
            if (nuevoId) setIdDiseno(nuevoId)
            setGuardado(true)
            showToast(setToast,'💾 Guardado — podés volver a abrirlo desde Inicio')
          }}
            style={{ padding:'6px 14px',borderRadius:'8px',border:'none',background:guardado?'#f0fdf4':'#f1f5f9',color:guardado?'#16a34a':'#64748b',cursor:'pointer',fontSize:'12px',fontWeight:600 }}>
            {guardado?'✅ Guardado':'💾 Guardar'}
          </button>
          <BotonesExportar onPDF={exportarPDFCalendario} onImprimir={imprimirCalendario} exportando={exportando}/>
        </div>
      </div>

      <BarraPaletas paleta={paleta} setPaleta={setPaleta}/>

      {/* PREVIEW */}
      <div style={{ flex:1,overflow:'auto',padding:'20px',background:paleta.fondo }} onClick={()=>{ setShowTamPanel(false); setShowLogo(false); setShowFondoPanel(false) }}>

        {/* Indicador de páginas */}
        <div style={{ textAlign:'center',marginBottom:'12px' }}>
          <div style={{ fontSize:'13px',fontWeight:700,color:paleta.header }}>{titulo.toUpperCase()} — {anio}</div>
          <div style={{ fontSize:'11px',color:paleta.acento,marginTop:'2px' }}>
            📄 13 páginas: 1 foto + 12 meses · Tamaño: {tam.nombre} ({tam.dim})
          </div>
        </div>

        {/* Toggle vista preview */}
        <div style={{ display:'flex',gap:'6px',justifyContent:'center',marginBottom:'12px' }}>
          <button onClick={()=>setVistaPreview('foto')} style={{ padding:'6px 16px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,background:vistaPreview==='foto'?paleta.header:'transparent',color:vistaPreview==='foto'?'white':paleta.texto }}>
            🖼️ Vista foto
          </button>
          <button onClick={()=>setVistaPreview('calendario')} style={{ padding:'6px 16px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,background:vistaPreview==='calendario'?paleta.header:'transparent',color:vistaPreview==='calendario'?'white':paleta.texto }}>
            📅 Vista calendario
          </button>
        </div>

        {/* Vista FOTO */}
        {vistaPreview==='foto' && (
          <div style={{ maxWidth:'700px',margin:'0 auto' }}>
            <div style={{ position:'relative',width:'100%',paddingBottom:`${(tam.h/tam.w)*100}%`,borderRadius:'12px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
              {/* Contenedor con fondo neutro — foto y logo flotan adentro como elementos libres */}
              <div
                ref={containerFotoRef}
                onClick={!foto ? subirFoto : undefined}
                style={{ position:'absolute',inset:0,overflow:'hidden', background:paleta.fondo==='#0f172a'?'#1e293b':'#e8ecf0', cursor:foto?'default':'pointer' }}
              >
                {/* FOTO: elemento posicionado y agarrable, igual que el logo */}
                {foto && (
                  <div
                    onMouseDown={handleFotoPanStart}
                    style={{
                      position:'absolute',
                      left:`${fotoPosX}%`, top:`${fotoPosY}%`,
                      width:`${fotoZoom}%`, height:`${fotoZoom}%`,
                      transform:'translate(-50%,-50%)',
                      backgroundImage:`url('${foto}')`,
                      backgroundSize:'cover', backgroundPosition:'center',
                      cursor:'grab', userSelect:'none', zIndex:1,
                    }}
                  />
                )}
                {/* Logo (encima de la foto) */}
                {logo && (
                  <div
                    onMouseDown={(e:any)=>{ e.stopPropagation(); handleLogoDrag(e) }}
                    onClick={(e:any)=>e.stopPropagation()}
                    style={{ position:'absolute',left:`${logoX}%`,top:`${logoY}%`,width:`${logoSize}%`,aspectRatio:'1 / 1',borderRadius:'50%',backgroundImage:`url('${logo}')`,backgroundSize:'cover',backgroundPosition:'center',opacity:logoOpacity,transform:'translate(-50%,-50%)',zIndex:8,cursor:'grab',boxShadow:'0 4px 16px rgba(0,0,0,0.3)',border:'3px solid rgba(255,255,255,0.8)' }}
                  />
                )}
                {!foto && (
                  <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px',pointerEvents:'none' }}>
                    <span style={{ fontSize:'40px',opacity:0.4 }}>🖼️</span>
                    <span style={{ fontSize:'13px',color:paleta.texto,background:`${paleta.header}18`,padding:'6px 16px',borderRadius:'20px',fontWeight:600 }}>Clic para agregar la foto del calendario</span>
                  </div>
                )}
              </div>
            </div>
            {foto ? (
              <div style={{ marginTop:'10px',background:'white',borderRadius:'10px',padding:'12px 14px',border:'1px solid #e2e8f0',boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px' }}>
                  <div style={{ fontSize:'10px',fontWeight:700,color:'#94a3b8',letterSpacing:'1px' }}>FOTO</div>
                  <div style={{ display:'flex',gap:'6px' }}>
                    <button onClick={subirFoto} style={{ fontSize:'10px',padding:'3px 8px',borderRadius:'6px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',color:'#64748b',fontWeight:600 }}>🔄 Cambiar</button>
                    <button onClick={()=>{setFotoZoom(100);setFotoPosX(50);setFotoPosY(50)}} style={{ fontSize:'10px',padding:'3px 8px',borderRadius:'6px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',color:'#94a3b8' }}>↺ Reset</button>
                  </div>
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px' }}>
                  <span style={{ fontSize:'10px',fontWeight:700,color:'#64748b' }}>📐 Tamaño</span>
                  <NumStepper value={fotoZoom} onChange={setFotoZoom} min={5} max={400} step={5} unit="%" accent={paleta.acento}/>
                </div>
                <div style={{ fontSize:'10px',color:'#94a3b8' }}>✋ Arrastrá la foto · 📐 Flechas para tamaño · 🏷️ Arrastrá el logo</div>
              </div>
            ) : (
              <div style={{ marginTop:'8px',textAlign:'center',fontSize:'11px',color:paleta.acento }}>Subí una foto, arrastrala y ajustá su tamaño con las flechas</div>
            )}
          </div>
        )}

        {/* Vista CALENDARIO */}
        {vistaPreview==='calendario' && (
          <div style={{ maxWidth:'900px',margin:'0 auto' }}>
            <div style={{ display:'flex',gap:'6px',justifyContent:'center',marginBottom:'12px',flexWrap:'wrap' }}>
              {MESES.map((m,i)=>(
                <button key={i} onClick={()=>setMesActivo(i)} style={{ padding:'4px 10px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:600,background:mesActivo===i?paleta.header:'transparent',color:mesActivo===i?'white':paleta.texto }}>
                  {m.slice(0,3)}
                </button>
              ))}
            </div>
            {/* Preview — fondo arrastrable directamente en el calendario */}
            <div style={{ position:'relative',width:'100%',paddingBottom:`${(tam.h/tam.w)*100}%`,borderRadius:'12px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
              <div ref={calPreviewRef} style={{ position:'absolute',inset:0 }}>
                <PaginaCalendario
                  mesIdx={mesActivo} anio={anio} paleta={paleta} fuente={fuente}
                  titulo={titulo} subtitulo={subtitulo} isPreview={true} tamFuente={tamFuente}
                  fondoMes={fondosMes[mesActivo]} fondoGridOpacity={fondoGridOpacity}
                  fondoZoom={fondosMesZoom[mesActivo]} fondoPosX={fondosMesPosX[mesActivo]} fondoPosY={fondosMesPosY[mesActivo]}
                  onFondoDragStart={fondosMes[mesActivo] ? handleFondoCalDragStart : undefined}
                />
              </div>
            </div>
            {/* Tamaño del fondo de mes */}
            {fondosMes[mesActivo] && (
              <div style={{ marginTop:'8px',background:'white',borderRadius:'8px',padding:'10px 12px',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:'10px' }}>
                <div style={{ fontSize:'10px',fontWeight:700,color:'#94a3b8',whiteSpace:'nowrap' }}>📐 Fondo {MESES[mesActivo].slice(0,3)}</div>
                <div style={{ flex:1 }}/>
                <NumStepper value={fondosMesZoom[mesActivo]} onChange={(v)=>setFondosMesZoom(prev=>{const c=[...prev];c[mesActivo]=v;return c})} min={5} max={400} step={5} unit="%" accent={paleta.acento}/>
                <button onClick={()=>{
                  setFondosMesZoom(prev=>{const c=[...prev];c[mesActivo]=100;return c})
                  setFondosMesPosX(prev=>{const c=[...prev];c[mesActivo]=50;return c})
                  setFondosMesPosY(prev=>{const c=[...prev];c[mesActivo]=50;return c})
                }} style={{ fontSize:'10px',padding:'3px 7px',borderRadius:'6px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',color:'#94a3b8' }}>↺</button>
              </div>
            )}
            <div style={{ display:'flex',justifyContent:'space-between',marginTop:'8px',alignItems:'center' }}>
              <button onClick={()=>setMesActivo(m=>Math.max(0,m-1))} disabled={mesActivo===0} style={{ padding:'6px 16px',borderRadius:'8px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'12px',color:'#64748b',opacity:mesActivo===0?0.3:1 }}>‹ Anterior</button>
              <span style={{ fontSize:'12px',fontWeight:600,color:paleta.header }}>{MESES[mesActivo]} {anio} — página {mesActivo+2} de 13</span>
              <button onClick={()=>setMesActivo(m=>Math.min(11,m+1))} disabled={mesActivo===11} style={{ padding:'6px 16px',borderRadius:'8px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'12px',color:'#64748b',opacity:mesActivo===11?0.3:1 }}>Siguiente ›</button>
            </div>
          </div>
        )}
      </div>

      <Toast msg={toast}/>
    </div>
  )
}