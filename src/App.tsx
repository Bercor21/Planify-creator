/* eslint-disable */
import { useState, useEffect } from 'react'
import { Vista, Diseno } from './constants'
import Home               from './components/Home'
import EditorCalendario   from './calendario/EditorCalendario'
import WizardAgenda       from './agenda/WizardAgenda'
import EditorPlanificador from './planificador/EditorPlanificador'

export default function App() {
  const [vista,   setVista]   = useState<Vista>('home')
  const [disenoAbierto, setDisenoAbierto] = useState<Diseno | null>(null)

  // ── Carga desde localStorage al iniciar ──────────────────────────────────
  const [disenos, setDisenos] = useState<Diseno[]>(() => {
    try {
      const saved = localStorage.getItem('planify-disenos')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ── Guarda automáticamente cada vez que cambia disenos ───────────────────
  useEffect(() => {
    try {
      localStorage.setItem('planify-disenos', JSON.stringify(disenos))
    } catch (e) {
      console.error('Error guardando diseños:', e)
    }
  }, [disenos])

  // Crea un diseño nuevo, o actualiza uno existente si se pasa un "id"
  function guardarDiseno(d: Omit<Diseno, 'id' | 'fechaCreacion'> & { id?: string }) {
    if (d.id) {
      // Actualizar diseño existente
      setDisenos(prev => prev.map(x => x.id === d.id ? { ...x, ...d, id: d.id as string } : x))
      setDisenoAbierto(prev => prev ? { ...prev, ...d, id: d.id as string } : prev)
      return d.id
    }
    const nuevoId = Date.now().toString()
    const nuevo: Diseno = {
      ...d,
      id:            nuevoId,
      fechaCreacion: new Date().toLocaleDateString('es-CR')
    }
    setDisenos(prev => [...prev, nuevo])
    setDisenoAbierto(nuevo)
    return nuevoId
  }

  function eliminarDiseno(id: string) {
    setDisenos(prev => prev.filter(d => d.id !== id))
  }

  // Abrir un diseño guardado para editarlo
  function abrirDiseno(d: Diseno) {
    setDisenoAbierto(d)
    setVista(d.tipo)
  }

  // Crear un diseño nuevo desde cero (botones "Nuevo Calendario" etc.)
  function crearNuevo(tipo: Vista) {
    setDisenoAbierto(null)
    setVista(tipo)
  }

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f8fafc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;600;700&family=Raleway:wght@400;600;700&family=Merriweather:wght@400;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600&family=Roboto:wght@400;500;700&family=Dancing+Script:wght@400;700&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:6px; height:6px }
        ::-webkit-scrollbar-track { background:#f1f5f9 }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px }
      `}</style>

      {vista === 'home'         && <Home setVista={crearNuevo} disenos={disenos} onEliminar={eliminarDiseno} onAbrir={abrirDiseno} />}
      {vista === 'calendario'   && <EditorCalendario   setVista={setVista} guardarDiseno={guardarDiseno} disenoInicial={disenoAbierto?.tipo==='calendario' ? disenoAbierto : undefined} />}
      {vista === 'agenda'       && <WizardAgenda        setVista={setVista} guardarDiseno={guardarDiseno} disenoInicial={disenoAbierto?.tipo==='agenda' ? disenoAbierto : undefined} />}
      {vista === 'planificador' && <EditorPlanificador  setVista={setVista} guardarDiseno={guardarDiseno} disenoInicial={disenoAbierto?.tipo==='planificador' ? disenoAbierto : undefined} />}
    </div>
  )
}