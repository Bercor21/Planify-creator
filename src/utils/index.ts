import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { TAMANOS_MM } from '../constants'

// ── Mapeo de tamaños para @page CSS ──────────────────────────────────────────
const PAGE_SIZES_CSS: Record<string, string> = {
  carta:     '215.9mm 279.4mm',
  oficio:    '215.9mm 330.2mm',
  ejecutivo: '184.1mm 266.7mm',
  a4:        '210mm 297mm',
  a3:        '297mm 420mm',
  a5:        '148mm 210mm',
  a6:        '105mm 148mm',
  tabloide:  '279.4mm 431.8mm',
  '11x17':   '279.4mm 431.8mm',
  '60x90':   '600mm 900mm',
  cuaderno:  '160mm 215mm',
  // Agenda
  bolsillo:     '100mm 150mm',
  'cuaderno-s': '140mm 210mm',
  'cuaderno-m': '170mm 240mm',
  'escritorio-s': '210mm 150mm',
  'escritorio-m': '300mm 210mm',
  'escritorio-l': '420mm 297mm',
}

function getPageCSS(tamano: string): string {
  const size = PAGE_SIZES_CSS[tamano] ?? '210mm 297mm'
  return `
    @page {
      size: ${size} !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  `
}

export function getDias(anio: number, mes: number) {
  const dim = new Date(anio, mes + 1, 0).getDate()
  const fd  = new Date(anio, mes, 1).getDay()
  const ini = fd === 0 ? 6 : fd - 1
  return Array.from({ length: Math.ceil((ini + dim) / 7) * 7 }, (_, i) => {
    const d = i - ini + 1
    return d >= 1 && d <= dim ? d : null
  })
}

export function showToast(set: (v: string | null) => void, msg: string, ms = 2800) {
  set(msg)
  setTimeout(() => set(null), ms)
}

// ── PDF de un solo elemento (captura completa) ───────────────────────────────
export async function exportarPDF(
  elementId: string,
  nombre: string,
  tamano: string,
  setExportando: (v: boolean) => void,
  setToast: (v: string | null) => void
) {
  const el = document.getElementById(elementId)
  if (!el) return
  setExportando(true)
  try {
    await new Promise(r => setTimeout(r, 500))
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    })
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    const [ancho, alto] = TAMANOS_MM[tamano] ?? [210, 297]
    const pdf = new jsPDF({
      orientation: ancho > alto ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [ancho, alto],
    })
    pdf.addImage(imgData, 'JPEG', 0, 0, ancho, alto)
    const blob = pdf.output('blob')
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = nombre; link.style.display = 'none'
    document.body.appendChild(link); link.click()
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url) }, 1500)
    showToast(setToast, '✅ PDF descargado correctamente')
  } catch (e: any) {
    console.error('PDF Error:', e)
    showToast(setToast, `❌ Error: ${e?.message ?? 'No se pudo generar el PDF'}`)
  }
  setExportando(false)
}

// ── PDF multi-página: captura cada sección [data-page] como una hoja ─────────
export async function exportarPDFPaginas(
  previewId: string,
  nombre: string,
  tamano: string,
  setExportando: (v: boolean) => void,
  setToast: (v: string | null) => void
) {
  const container = document.getElementById(previewId)
  if (!container) return
  setExportando(true)

  try {
    const [ancho, alto] = TAMANOS_MM[tamano] ?? [210, 297]
    const pdf = new jsPDF({
      orientation: ancho > alto ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [ancho, alto],
    })

    const secciones = Array.from(container.querySelectorAll('[data-page]')) as HTMLElement[]

    if (secciones.length === 0) {
      await exportarPDF(previewId, nombre, tamano, setExportando, setToast)
      return
    }

    showToast(setToast, `⏳ Generando ${secciones.length} páginas...`)

    // Contenedor temporal para clonar cada sección y capturarla limpiamente
    const wrap = document.createElement('div')
    wrap.style.cssText = `position:fixed;left:-9999px;top:0;width:794px;overflow:visible;box-sizing:border-box;`
    document.body.appendChild(wrap)

    for (let i = 0; i < secciones.length; i++) {
      const seccion = secciones[i]

      // Clonar la sección en el contenedor temporal
      const clone = seccion.cloneNode(true) as HTMLElement
      clone.style.width   = '794px'
      clone.style.minHeight = '1122px'
      clone.style.pageBreakAfter = 'unset'
      wrap.innerHTML = ''
      wrap.appendChild(clone)

      await new Promise(r => setTimeout(r, 150))

      const canvas = await html2canvas(wrap, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width:  794,
        height: Math.max(1122, clone.scrollHeight),
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.90)
      if (i > 0) pdf.addPage([ancho, alto])
      pdf.addImage(imgData, 'JPEG', 0, 0, ancho, alto)

      showToast(setToast, `⏳ Página ${i + 1} de ${secciones.length}...`)
    }

    document.body.removeChild(wrap)

    const blob = pdf.output('blob')
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = nombre; link.style.display = 'none'
    document.body.appendChild(link); link.click()
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url) }, 2000)
    showToast(setToast, `✅ PDF de ${secciones.length} páginas descargado`)
  } catch (e: any) {
    console.error('PDF Error:', e)
    showToast(setToast, `❌ Error: ${e?.message ?? 'No se pudo generar el PDF'}`)
  }
  setExportando(false)
}

// ── Imprimir elemento genérico (planificador, agenda vieja) ──────────────────
export function imprimirElemento(id: string, tamano = 'a4') {
  const el = document.getElementById(id)
  if (!el) return
  const previo = document.getElementById('print-generic-root')
  if (previo) previo.remove()
  const prevStyle = document.getElementById('print-generic-style')
  if (prevStyle) prevStyle.remove()

  const container = document.createElement('div')
  container.id = 'print-generic-root'
  container.innerHTML = el.innerHTML
  document.body.appendChild(container)

  const style = document.createElement('style')
  style.id = 'print-generic-style'
  style.innerHTML = `
    ${getPageCSS(tamano)}
    @media screen  { #print-generic-root { display: none; } }
    @media print {
      body > *:not(#print-generic-root) { display: none !important; }
      #print-generic-root { display: block !important; }
    }
  `
  document.head.appendChild(style)
  setTimeout(() => {
    window.print()
    setTimeout(() => { container.remove(); style.remove() }, 1000)
  }, 300)
}

// ── Imprimir calendario mes a mes ────────────────────────────────────────────
export function imprimirCalendarioMesAMes(
  anio: number,
  titulo: string,
  paleta: { fondo: string; header: string; texto: string; acento: string },
  fuente: string,
  tipo: 'pared' | 'mesa',
  fotos: Record<number, string>,
  MESES: string[],
  DIAS: string[],
  tamano = 'carta'
) {
  const previo = document.getElementById('print-calendario-root')
  if (previo) previo.remove()
  const prevStyle = document.getElementById('print-calendario-style')
  if (prevStyle) prevStyle.remove()

  const mesesHTML = MESES.map((mes, idx) => {
    const dias   = getDias(anio, idx)
    const hoy    = new Date()
    const isLast = idx === MESES.length - 1

    const celdasHTML = dias.map((dia, i) => {
      const isHoy = dia === hoy.getDate() && idx === hoy.getMonth() && anio === hoy.getFullYear()
      const esDom = i % 7 === 6
      const color = !dia ? 'transparent' : isHoy ? 'white' : esDom ? paleta.acento : paleta.texto
      const bg    = isHoy ? paleta.acento : 'transparent'
      const fw    = isHoy ? 700 : esDom ? 600 : 400
      return `<div style="text-align:center;font-size:14px;color:${color};background:${bg};border-radius:50%;width:28px;height:28px;margin:0 auto;display:flex;align-items:center;justify-content:center;font-weight:${fw};">${dia || ''}</div>`
    }).join('')

    const fotoStyle = fotos[idx]
      ? `background:url('${fotos[idx]}') center/cover`
      : `background:linear-gradient(135deg,${paleta.header}dd,${paleta.acento}99)`

    const fotoSection = tipo === 'pared' ? `
      <div style="height:260px;${fotoStyle};position:relative;border-radius:12px 12px 0 0;">
        <div style="position:absolute;bottom:12px;left:16px;font-size:22px;font-weight:800;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.7);font-family:${fuente};">${mes}</div>
      </div>` : ''

    const mesHeader = tipo === 'mesa' ? `
      <div style="font-size:22px;font-weight:800;color:${paleta.header};text-align:center;margin-bottom:16px;letter-spacing:2px;font-family:${fuente};">${mes.toUpperCase()}</div>` : ''

    return `
      <div style="
        page-break-after: ${isLast ? 'auto' : 'always'};
        width:100%; height:100vh;
        display:flex; align-items:center; justify-content:center;
        background:${paleta.fondo}; padding:40px; box-sizing:border-box;
      ">
        <div style="width:100%;max-width:520px;background:${paleta.fondo === '#0f172a' ? '#1e293b' : 'white'};border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);border:1px solid ${paleta.acento}33;font-family:${fuente};">
          ${fotoSection}
          <div style="padding:24px;">
            <div style="text-align:center;margin-bottom:20px;">
              <div style="font-size:13px;font-weight:600;color:${paleta.acento};letter-spacing:1px;">${titulo.toUpperCase()} · ${anio}</div>
            </div>
            ${mesHeader}
            <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:8px;">
              ${DIAS.map(d => `<div style="text-align:center;font-size:12px;font-weight:700;color:${paleta.acento};padding:4px 0;">${d}</div>`).join('')}
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">${celdasHTML}</div>
          </div>
        </div>
      </div>`
  }).join('')

  const container = document.createElement('div')
  container.id = 'print-calendario-root'
  container.innerHTML = mesesHTML
  document.body.appendChild(container)

  const style = document.createElement('style')
  style.id = 'print-calendario-style'
  style.innerHTML = `
    ${getPageCSS(tamano)}
    @media screen { #print-calendario-root { display: none; } }
    @media print {
      body > *:not(#print-calendario-root) { display: none !important; }
      #print-calendario-root { display: block !important; }
    }
  `
  document.head.appendChild(style)
  setTimeout(() => {
    window.print()
    setTimeout(() => { container.remove(); style.remove() }, 1000)
  }, 300)
}

// ── PDF mes a mes para el calendario ─────────────────────────────────────────
export async function exportarCalendarioPDFPaginas(
  anio: number,
  titulo: string,
  paleta: { fondo: string; header: string; texto: string; acento: string },
  fuente: string,
  tipo: 'pared' | 'mesa',
  fotos: Record<number, string>,
  MESES_LIST: string[],
  DIAS_LIST: string[],
  tamano: string,
  setExportando: (v: boolean) => void,
  setToast: (v: string | null) => void
) {
  setExportando(true)
  showToast(setToast, '⏳ Generando PDF — 12 páginas...')

  try {
    const [ancho, alto] = TAMANOS_MM[tamano] ?? [215.9, 279.4]
    const pdf = new jsPDF({
      orientation: ancho > alto ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [ancho, alto],
    })

    // Contenedor temporal fuera de pantalla
    const wrap = document.createElement('div')
    wrap.style.cssText = `
      position:fixed; left:-9999px; top:0;
      width:794px; height:1122px;
      overflow:hidden; box-sizing:border-box;
    `
    document.body.appendChild(wrap)

    for (let idx = 0; idx < MESES_LIST.length; idx++) {
      const mes  = MESES_LIST[idx]
      const dias = getDias(anio, idx)
      const hoy  = new Date()

      const celdas = dias.map((dia, i) => {
        const isHoy = dia === hoy.getDate() && idx === hoy.getMonth() && anio === hoy.getFullYear()
        const esDom = i % 7 === 6
        const col = !dia ? 'transparent' : isHoy ? 'white' : esDom ? paleta.acento : paleta.texto
        const bg  = isHoy ? paleta.acento : 'transparent'
        const fw  = isHoy ? 700 : esDom ? 600 : 400
        return `<div style="text-align:center;font-size:16px;color:${col};background:${bg};border-radius:50%;width:32px;height:32px;margin:0 auto;display:flex;align-items:center;justify-content:center;font-weight:${fw};">${dia||''}</div>`
      }).join('')

      const fotoStyle = fotos[idx]
        ? `background:url('${fotos[idx]}') center/cover no-repeat`
        : `background:linear-gradient(135deg,${paleta.header}dd,${paleta.acento}99)`

      const fotoSec = tipo === 'pared' ? `
        <div style="height:300px;${fotoStyle};border-radius:14px 14px 0 0;position:relative;">
          <div style="position:absolute;bottom:16px;left:20px;font-size:28px;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.7);font-family:${fuente};">${mes}</div>
        </div>` : ''

      const mesHead = tipo === 'mesa' ? `
        <div style="font-size:32px;font-weight:800;color:${paleta.header};text-align:center;margin-bottom:20px;letter-spacing:2px;font-family:${fuente};">${mes.toUpperCase()}</div>` : ''

      wrap.innerHTML = `
        <div style="width:100%;height:100%;background:${paleta.fondo};display:flex;align-items:center;justify-content:center;padding:40px;box-sizing:border-box;font-family:${fuente};">
          <div style="width:100%;max-width:620px;background:${paleta.fondo==='#0f172a'?'#1e293b':'white'};border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);border:1px solid ${paleta.acento}33;">
            ${fotoSec}
            <div style="padding:32px;">
              <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:14px;font-weight:600;color:${paleta.acento};letter-spacing:1px;">${titulo.toUpperCase()} · ${anio}</div>
              </div>
              ${mesHead}
              <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:10px;">
                ${DIAS_LIST.map(d=>`<div style="text-align:center;font-size:13px;font-weight:700;color:${paleta.acento};padding:6px 0;">${d}</div>`).join('')}
              </div>
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">${celdas}</div>
            </div>
          </div>
        </div>`

      await new Promise(r => setTimeout(r, 200))

      const canvas = await html2canvas(wrap, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: paleta.fondo, logging: false,
        width: 794, height: 1122,
      })

      const img = canvas.toDataURL('image/jpeg', 0.92)
      if (idx > 0) pdf.addPage([ancho, alto])
      pdf.addImage(img, 'JPEG', 0, 0, ancho, alto)

      showToast(setToast, `⏳ Página ${idx + 1} de 12...`)
    }

    document.body.removeChild(wrap)

    const blob = pdf.output('blob')
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${titulo}-${anio}.pdf`; a.style.display = 'none'
    document.body.appendChild(a); a.click()
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 2000)
    showToast(setToast, '✅ PDF de 12 páginas descargado')

  } catch (e: any) {
    console.error('PDF Error:', e)
    showToast(setToast, `❌ Error: ${e?.message ?? 'No se pudo generar el PDF'}`)
  }

  setExportando(false)
}