/* eslint-disable */
import { useState, useRef } from 'react'
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
  '7-15':'Día de la Madre','8-15':'Independencia',
  '9-12':'Día de las Culturas','11-24':'Nochebuena','11-25':'Navidad',
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
function MiniCal({ anio,mes,paleta,colorDom }:{ anio:number;mes:number;paleta:Paleta;colorDom:string }) {
  const dias = getDiasTrad(anio,mes)
  return (
    <div style={{ width:'80px' }}>
      <div style={{ fontSize:'7px',fontWeight:800,color:paleta.header,textAlign:'center',marginBottom:'2px' }}>
        {MESES[mes].toUpperCase()}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)' }}>
        {DIAS_CORTOS.map((d,i)=><div key={i} style={{ textAlign:'center',fontSize:'5.5px',fontWeight:700,color:i===0?colorDom:paleta.acento }}>{d}</div>)}
        {dias.map((d,i)=><div key={i} style={{ textAlign:'center',fontSize:'6px',color:!d?'transparent':i%7===0?colorDom:paleta.texto }}>{d||'·'}</div>)}
      </div>
    </div>
  )
}

// ── Página de grilla del mes (sin foto, hoja completa) ────────────────────────
function PaginaCalendario({ mesIdx,anio,paleta,fuente,titulo,isPreview }:{
  mesIdx:number;anio:number;paleta:Paleta;fuente:string;titulo:string;isPreview:boolean
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
      padding:'16px 20px 12px', boxSizing:'border-box',
      pageBreakAfter:'always', pageBreakInside:'avoid',
      overflow:'hidden', position:'relative',
    }}>
      {/* Header: mini prev | AÑO GRANDE + MES | mini next */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px' }}>
        <MiniCal anio={prevMes.a} mes={prevMes.m} paleta={paleta} colorDom={colorDom}/>
        <div style={{ textAlign:'center',flex:1 }}>
          <div style={{ fontSize:'clamp(20px,4vw,42px)',fontWeight:900,color:colorDom,letterSpacing:'4px',lineHeight:1 }}>{anio}</div>
          <div style={{ fontSize:'clamp(14px,3vw,30px)',fontWeight:900,color:colorHdr,letterSpacing:'5px',lineHeight:1.1 }}>{MESES[mesIdx].toUpperCase()}</div>
          <div style={{ fontSize:'clamp(8px,1.2vw,11px)',color:`${colorHdr}66`,marginTop:'2px',letterSpacing:'1px' }}>{titulo.toUpperCase()}</div>
        </div>
        <MiniCal anio={nextMes.a} mes={nextMes.m} paleta={paleta} colorDom={colorDom}/>
      </div>

      {/* Header días */}
      <div style={{ display:'grid',gridTemplateColumns:'34px repeat(7,1fr)',background:`${colorHdr}10`,borderRadius:'6px',padding:'4px 0',marginBottom:'4px' }}>
        <div style={{ textAlign:'center',fontSize:'8px',fontWeight:700,color:`${colorHdr}88` }}>SEM</div>
        {DIAS_NOMBRES.map((d,i)=>(
          <div key={i} style={{ textAlign:'center',fontSize:'clamp(7px,1.2vw,11px)',fontWeight:800,color:i===0?colorDom:colorHdr,letterSpacing:'0.5px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Filas del calendario */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'2px' }}>
        {rows.map((row,ri)=>{
          const primer = row.find(d=>d!==null)
          const nSem   = primer ? getNumSemana(anio,mesIdx,primer) : ''
          return (
            <div key={ri} style={{ display:'grid',gridTemplateColumns:'34px repeat(7,1fr)',flex:1 }}>
              <div style={{ textAlign:'center',fontSize:'8px',color:`${colorHdr}66`,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',borderRight:`1px solid ${colorHdr}15` }}>
                {nSem}
              </div>
              {row.map((dia,ci)=>{
                const esDom   = ci===0
                const feriado = dia ? getFeriado(anio,mesIdx,dia) : null
                const fase    = dia ? faseMap[dia] : null
                const isHoy   = dia===new Date().getDate()&&mesIdx===new Date().getMonth()&&anio===new Date().getFullYear()
                return (
                  <div key={ci} style={{
                    borderLeft:`1px solid ${colorHdr}12`,borderBottom:`1px solid ${colorHdr}12`,
                    padding:'3px 4px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',
                    background:isHoy?`${colorDom}20`:feriado?`${colorDom}08`:'transparent',
                  }}>
                    {dia && <>
                      <div style={{ fontSize:'clamp(11px,1.8vw,18px)',fontWeight:esDom||feriado?800:600,color:isHoy?colorDom:esDom||feriado?colorDom:colorTxt,lineHeight:1.1 }}>{dia}</div>
                      {fase && <div style={{ fontSize:'clamp(8px,1.2vw,12px)',lineHeight:1 }}>{ICONO_FASE[fase.tipo]}</div>}
                      {feriado&&!fase && <div style={{ fontSize:'clamp(5px,0.8vw,7px)',color:colorDom,lineHeight:1.2,textAlign:'center',overflow:'hidden',maxWidth:'100%' }}>{feriado.split(' ').slice(0,2).join(' ')}</div>}
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
        <div style={{ display:'flex',gap:'12px',justifyContent:'center',marginTop:'6px',flexWrap:'wrap' }}>
          {fases.map((f,i)=>(
            <span key={i} style={{ fontSize:'clamp(7px,1vw,9px)',color:`${colorHdr}88`,display:'flex',alignItems:'center',gap:'3px' }}>
              {ICONO_FASE[f.tipo]} {f.dia} {LABEL_FASE[f.tipo]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EditorCalendario({ setVista,guardarDiseno }:{
  setVista:(v:any)=>void; guardarDiseno:(d:any)=>void
}) {
  const [anio,       setAnio]      = useState(new Date().getFullYear())
  const [fuente,     setFuente]    = useState('Arial')
  const [paleta,     setPaleta]    = useState<Paleta>(PALETAS[0])
  const [titulo,     setTitulo]    = useState('Mi Calendario')
  const [tamano,     setTamano]    = useState('pared-a4')
  const [showTamPanel,setShowTamPanel] = useState(false)
  const [foto,       setFoto]      = useState<string|undefined>()
  const [exportando, setExp]       = useState(false)
  const [toast,      setToast]     = useState<string|null>(null)
  const [guardado,   setGuardado]  = useState(false)
  const [mesActivo,  setMesActivo] = useState(0)
  const [vistaPreview, setVistaPreview] = useState<'foto'|'calendario'>('foto')
  // Logo
  const [logo,        setLogo]        = useState<string|undefined>()
  const [logoX,       setLogoX]       = useState(85)
  const [logoY,       setLogoY]       = useState(10)
  const [logoSize,    setLogoSize]    = useState(8)
  const [logoOpacity, setLogoOpacity] = useState(1)
  const [showLogo,    setShowLogo]    = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const logoData = logo ? { src:logo,x:logoX,y:logoY,size:logoSize,opacity:logoOpacity } : undefined
  const tam = getTam(tamano)

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
  function handleLogoDrag(e:React.MouseEvent) {
    if(!previewRef.current) return; e.preventDefault()
    const rect=previewRef.current.getBoundingClientRect()
    function onMove(ev:MouseEvent) {
      setLogoX(Math.min(92,Math.max(0,((ev.clientX-rect.left)/rect.width)*100)))
      setLogoY(Math.min(92,Math.max(0,((ev.clientY-rect.top)/rect.height)*100)))
    }
    function onUp() { document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp) }
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp)
  }

  // ── Generar HTML de una grilla de mes para PDF/print ─────────────────────
  function generarGrillaHTML(idx:number, pxW:number, pxH:number): string {
    const dias=getDiasTrad(anio,idx)
    const fases=FASES[`${anio}-${idx}`]??[]
    const faseMap:Record<number,FaseLunar>={}
    fases.forEach(f=>{ faseMap[f.dia]=f })
    const rows:(number|null)[][]=[]
    for(let i=0;i<dias.length;i+=7) rows.push(dias.slice(i,i+7))
    const prevMes=idx===0?{a:anio-1,m:11}:{a:anio,m:idx-1}
    const nextMes=idx===11?{a:anio+1,m:0}:{a:anio,m:idx+1}
    const cd=paleta.acento, ch=paleta.header, ct=paleta.texto
    const fondo=paleta.fondo==='#0f172a'?'#1e293b':'#ffffff'

    function miniStr(a:number,m:number) {
      const d=getDiasTrad(a,m)
      return `<div style="width:75px;font-family:${fuente}">
        <div style="font-size:7px;font-weight:800;color:${ch};text-align:center;margin-bottom:2px">${MESES[m].toUpperCase()}</div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr)">
          ${DIAS_CORTOS.map((dc,i)=>`<div style="text-align:center;font-size:5.5px;color:${i===0?cd:ch}">${dc}</div>`).join('')}
          ${d.map((dia,i)=>`<div style="text-align:center;font-size:6px;color:${!dia?'transparent':i%7===0?cd:ct}">${dia||'·'}</div>`).join('')}
        </div>
      </div>`
    }

    const rowsStr=rows.map(row=>{
      const primer=row.find(d=>d!==null)
      const nSem=primer?getNumSemana(anio,idx,primer):''
      return `<div style="display:grid;grid-template-columns:34px repeat(7,1fr);flex:1;min-height:0">
        <div style="text-align:center;font-size:8px;color:${ch}66;display:flex;align-items:center;justify-content:center;border-right:1px solid ${ch}15">${nSem}</div>
        ${row.map((dia,ci)=>{
          const esDom=ci===0, feriado=dia?getFeriado(anio,idx,dia):null, fase=dia?faseMap[dia]:null
          const isHoy=dia===new Date().getDate()&&idx===new Date().getMonth()&&anio===new Date().getFullYear()
          return `<div style="border-left:1px solid ${ch}12;border-bottom:1px solid ${ch}12;padding:3px 4px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;${feriado?`background:${cd}08;`:''}${isHoy?`background:${cd}20;`:''}">
            ${dia?`<div style="font-size:18px;font-weight:${esDom||feriado?800:600};color:${isHoy?cd:esDom||feriado?cd:ct};line-height:1.1">${dia}</div>
            ${fase?`<div style="font-size:12px">${ICONO_FASE[fase.tipo]}</div>`:''}
            ${feriado&&!fase?`<div style="font-size:7px;color:${cd};line-height:1.2;text-align:center;overflow:hidden;max-width:100%">${feriado.split(' ').slice(0,2).join(' ')}</div>`:''}`:''}
          </div>`
        }).join('')}
      </div>`
    }).join('')

    return `<div style="width:${pxW}px;height:${pxH}px;background:${fondo};font-family:${fuente};display:flex;flex-direction:column;padding:16px 20px 12px;box-sizing:border-box;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        ${miniStr(prevMes.a,prevMes.m)}
        <div style="text-align:center;flex:1">
          <div style="font-size:40px;font-weight:900;color:${cd};letter-spacing:4px;line-height:1">${anio}</div>
          <div style="font-size:28px;font-weight:900;color:${ch};letter-spacing:5px;line-height:1.1">${MESES[idx].toUpperCase()}</div>
          <div style="font-size:10px;color:${ch}66;margin-top:2px">${titulo.toUpperCase()}</div>
        </div>
        ${miniStr(nextMes.a,nextMes.m)}
      </div>
      <div style="display:grid;grid-template-columns:34px repeat(7,1fr);background:${ch}10;border-radius:6px;padding:4px 0;margin-bottom:4px">
        <div style="text-align:center;font-size:8px;color:${ch}88">SEM</div>
        ${DIAS_NOMBRES.map((d,i)=>`<div style="text-align:center;font-size:11px;font-weight:800;color:${i===0?cd:ch}">${d}</div>`).join('')}
      </div>
      <div style="display:flex;flex-direction:column;flex:1;gap:2px">${rowsStr}</div>
      ${fases.length>0?`<div style="display:flex;gap:12px;justify-content:center;margin-top:6px;flex-wrap:wrap">${fases.map(f=>`<span style="font-size:9px;color:${ch}88">${ICONO_FASE[f.tipo]} ${f.dia} ${LABEL_FASE[f.tipo]}</span>`).join('')}</div>`:''}
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
      wrap.innerHTML=`<div style="width:${pxW}px;height:${pxH}px;overflow:hidden;position:relative;${foto?`background:url('${foto}') center/cover no-repeat`:`background:linear-gradient(135deg,${paleta.header}cc,${paleta.acento}99)`}">
        ${logoData?`<div style="position:absolute;left:${logoData.x}%;top:${logoData.y}%;width:${logoData.size}%;aspect-ratio:1;border-radius:50%;background:url('${logoData.src}') center/cover;opacity:${logoData.opacity};transform:translate(-50%,-50%);z-index:8;box-shadow:0 4px 16px rgba(0,0,0,0.3);border:3px solid rgba(255,255,255,0.8)"></div>`:''}
      </div>`
      await new Promise(r=>setTimeout(r,200))
      let canvas=await html2canvas(wrap,{scale:3,useCORS:true,allowTaint:true,backgroundColor:paleta.fondo,logging:false,width:pxW,height:pxH})
      pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,tam.w,tam.h)
      showToast(setToast,'⏳ Foto lista — generando meses...')

      // ── Páginas 2-13: GRILLAS ──
      for(let idx=0;idx<12;idx++) {
        wrap.innerHTML=generarGrillaHTML(idx,pxW,pxH)
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
    const fondo=paleta.fondo==='#0f172a'?'#1e293b':'#ffffff'
    const logoStr=logoData?`<div style="position:absolute;left:${logoData.x}%;top:${logoData.y}%;width:${logoData.size}%;aspect-ratio:1;border-radius:50%;background:url('${logoData.src}') center/cover;opacity:${logoData.opacity};transform:translate(-50%,-50%);z-index:8;box-shadow:0 4px 16px rgba(0,0,0,0.3);border:3px solid rgba(255,255,255,0.8)"></div>`:''

    // Página 1: foto
    const paginaFoto=`<div style="width:100vw;height:100vh;overflow:hidden;position:relative;page-break-after:always;${foto?`background:url('${foto}') center/cover no-repeat`:`background:linear-gradient(135deg,${paleta.header}cc,${paleta.acento}99)`}">${logoStr}</div>`

    // Páginas 2-13: grillas
    // Para print usamos vw/vh — el @page CSS establece las dimensiones correctas
    const paginasGrillas=MESES.map((_,idx)=>{
      const dias=getDiasTrad(anio,idx), fases=FASES[`${anio}-${idx}`]??[]
      const faseMap:Record<number,FaseLunar>={}; fases.forEach(f=>{ faseMap[f.dia]=f })
      const rows:(number|null)[][]=[]
      for(let i=0;i<dias.length;i+=7) rows.push(dias.slice(i,i+7))
      const prevMes=idx===0?{a:anio-1,m:11}:{a:anio,m:idx-1}
      const nextMes=idx===11?{a:anio+1,m:0}:{a:anio,m:idx+1}
      const cd=paleta.acento,ch=paleta.header,ct=paleta.texto
      const isLast=idx===11

      function miniStr(a:number,m:number) {
        const d=getDiasTrad(a,m)
        return `<div style="width:75px"><div style="font-size:7px;font-weight:800;color:${ch};text-align:center">${MESES[m].toUpperCase()}</div><div style="display:grid;grid-template-columns:repeat(7,1fr)">${DIAS_CORTOS.map((dc,i)=>`<div style="text-align:center;font-size:5px;color:${i===0?cd:ch}">${dc}</div>`).join('')}${d.map((dia,i)=>`<div style="text-align:center;font-size:6px;color:${!dia?'transparent':i%7===0?cd:ct}">${dia||'·'}</div>`).join('')}</div></div>`
      }
      const rowsStr=rows.map(row=>{
        const primer=row.find(d=>d!==null), nSem=primer?getNumSemana(anio,idx,primer):''
        return `<div style="display:grid;grid-template-columns:34px repeat(7,1fr);flex:1;min-height:0"><div style="text-align:center;font-size:8px;color:${ch}66;display:flex;align-items:center;justify-content:center;border-right:1px solid ${ch}15">${nSem}</div>${row.map((dia,ci)=>{const esDom=ci===0,feriado=dia?getFeriado(anio,idx,dia):null,fase=dia?faseMap[dia]:null;return `<div style="border-left:1px solid ${ch}12;border-bottom:1px solid ${ch}12;padding:3px 4px;display:flex;flex-direction:column;align-items:center;${feriado?`background:${cd}08`:''}">${dia?`<div style="font-size:18px;font-weight:${esDom||feriado?800:600};color:${esDom||feriado?cd:ct}">${dia}</div>${fase?`<div style="font-size:12px">${ICONO_FASE[fase.tipo]}</div>`:''}${feriado&&!fase?`<div style="font-size:7px;color:${cd};text-align:center">${feriado.split(' ').slice(0,2).join(' ')}</div>`:''}`:''}
        </div>`}).join('')}</div>`
      }).join('')
      return `<div style="width:100vw;height:100vh;background:${fondo};font-family:${fuente};display:flex;flex-direction:column;padding:16px 20px 12px;box-sizing:border-box;overflow:hidden;page-break-after:${isLast?'auto':'always'};page-break-inside:avoid">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">${miniStr(prevMes.a,prevMes.m)}<div style="text-align:center;flex:1"><div style="font-size:40px;font-weight:900;color:${cd};letter-spacing:4px;line-height:1">${anio}</div><div style="font-size:28px;font-weight:900;color:${ch};letter-spacing:5px">${MESES[idx].toUpperCase()}</div></div>${miniStr(nextMes.a,nextMes.m)}</div>
        <div style="display:grid;grid-template-columns:34px repeat(7,1fr);background:${ch}10;border-radius:6px;padding:4px 0;margin-bottom:4px"><div style="text-align:center;font-size:8px;color:${ch}88">SEM</div>${DIAS_NOMBRES.map((d,i)=>`<div style="text-align:center;font-size:11px;font-weight:800;color:${i===0?cd:ch}">${d}</div>`).join('')}</div>
        <div style="display:flex;flex-direction:column;flex:1;gap:2px">${rowsStr}</div>
        ${fases.length>0?`<div style="display:flex;gap:12px;justify-content:center;margin-top:6px;flex-wrap:wrap">${fases.map(f=>`<span style="font-size:9px;color:${ch}88">${ICONO_FASE[f.tipo]} ${f.dia} ${LABEL_FASE[f.tipo]}</span>`).join('')}</div>`:''}
      </div>`
    }).join('')

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
        #print-cal-root > div { width:100vw !important; height:100vh !important; page-break-after:always !important; page-break-inside:avoid !important; overflow:hidden !important; }
        #print-cal-root > div:last-child { page-break-after:auto !important; }
      }
    `
    document.head.appendChild(style)
    setTimeout(()=>{ window.print(); setTimeout(()=>{ container.remove(); style.remove() },1500) },400)
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100vh',display:'flex',flexDirection:'column',background:'#f8fafc' }}>

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
                  { label:'Tamaño',value:logoSize,set:setLogoSize,min:3,max:25,unit:'%' },
                  { label:'Opacidad',value:Math.round(logoOpacity*100),set:(v:number)=>setLogoOpacity(v/100),min:10,max:100,unit:'%' },
                ].map(item=>(
                  <div key={item.label} style={{ marginBottom:'8px' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',fontSize:'10px',fontWeight:700,color:'#64748b',marginBottom:'3px' }}>
                      <span>{item.label}</span><span>{item.value}{item.unit}</span>
                    </div>
                    <input type="range" min={item.min} max={item.max} value={item.value}
                      onChange={(e:any)=>item.set(parseInt(e.target.value))}
                      style={{ width:'100%',accentColor:paleta.acento }}/>
                  </div>
                ))}
                <div style={{ fontSize:'10px',color:'#94a3b8',textAlign:'center' }}>💡 Arrastrá el logo en la foto</div>
              </>}
            </div>
          )}
        </div>

        <div style={{ marginLeft:'auto',display:'flex',gap:'8px',alignItems:'center' }}>
          <button onClick={()=>{ guardarDiseno({tipo:'calendario',titulo,paleta,fuente,tamano,anio}); setGuardado(true); showToast(setToast,'💾 Guardado') }}
            style={{ padding:'6px 14px',borderRadius:'8px',border:'none',background:guardado?'#f0fdf4':'#f1f5f9',color:guardado?'#16a34a':'#64748b',cursor:'pointer',fontSize:'12px',fontWeight:600 }}>
            {guardado?'✅ Guardado':'💾 Guardar'}
          </button>
          <BotonesExportar onPDF={exportarPDFCalendario} onImprimir={imprimirCalendario} exportando={exportando}/>
        </div>
      </div>

      <BarraPaletas paleta={paleta} setPaleta={setPaleta}/>

      {/* PREVIEW */}
      <div style={{ flex:1,overflow:'auto',padding:'20px',background:paleta.fondo }} onClick={()=>{ setShowTamPanel(false); setShowLogo(false) }}>

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
              <div onClick={subirFoto} ref={previewRef} style={{ position:'absolute',inset:0,cursor:'pointer',background:foto?`url('${foto}') center/cover no-repeat`:`linear-gradient(135deg,${paleta.header}cc,${paleta.acento}99)` }}>
                {logo && (
                  <div
                    onMouseDown={(e)=>{ e.stopPropagation(); handleLogoDrag(e) }}
                    onClick={e => e.stopPropagation()}
                    style={{ position:'absolute',left:`${logoX}%`,top:`${logoY}%`,width:`${logoSize}%`,aspectRatio:'1 / 1',borderRadius:'50%',backgroundImage:`url('${logo}')`,backgroundSize:'cover',backgroundPosition:'center',opacity:logoOpacity,transform:'translate(-50%,-50%)',zIndex:8,cursor:'grab',boxShadow:'0 4px 16px rgba(0,0,0,0.3)',border:'3px solid rgba(255,255,255,0.8)' }}
                  />
                )}
                {!foto && (
                  <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px' }}>
                    <span style={{ fontSize:'40px',opacity:0.5 }}>🖼️</span>
                    <span style={{ fontSize:'13px',color:'rgba(255,255,255,0.9)',background:'rgba(0,0,0,0.3)',padding:'6px 16px',borderRadius:'20px',fontWeight:600 }}>Clic para agregar la foto del calendario</span>
                    <span style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)' }}>Una foto para todos los 12 meses</span>
                  </div>
                )}
              </div>
            </div>
            {foto && <div style={{ marginTop:'8px',textAlign:'center',fontSize:'11px',color:paleta.acento }}>✅ Esta foto aparecerá en la página 1 del calendario</div>}
          </div>
        )}

        {/* Vista CALENDARIO */}
        {vistaPreview==='calendario' && (
          <div style={{ maxWidth:'900px',margin:'0 auto' }}>
            {/* Selector de mes */}
            <div style={{ display:'flex',gap:'6px',justifyContent:'center',marginBottom:'12px',flexWrap:'wrap' }}>
              {MESES.map((m,i)=>(
                <button key={i} onClick={()=>setMesActivo(i)} style={{ padding:'4px 10px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:600,background:mesActivo===i?paleta.header:'transparent',color:mesActivo===i?'white':paleta.texto }}>
                  {m.slice(0,3)}
                </button>
              ))}
            </div>

            {/* Preview del mes */}
            <div style={{ position:'relative',width:'100%',paddingBottom:`${(tam.h/tam.w)*100}%`,borderRadius:'12px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
              <div style={{ position:'absolute',inset:0 }}>
                <PaginaCalendario mesIdx={mesActivo} anio={anio} paleta={paleta} fuente={fuente} titulo={titulo} isPreview={true}/>
              </div>
            </div>

            {/* Navegación */}
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