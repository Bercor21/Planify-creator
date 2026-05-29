/* eslint-disable */
import { useState, useEffect } from 'react'
import { Vista, Diseno } from './constants'
import Home               from './components/Home'
import EditorCalendario   from './calendario/EditorCalendario'
import WizardAgenda       from './agenda/WizardAgenda'
import EditorPlanificador from './planificador/EditorPlanificador'

export default function App() {
  const [vista,   setVista]   = useState<Vista>('home')

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

  function guardarDiseno(d: Omit<Diseno, 'id' | 'fechaCreacion'>) {
    setDisenos(prev => [...prev, {
      ...d,
      id:            Date.now().toString(),
      fechaCreacion: new Date().toLocaleDateString('es-CR')
    }])
  }

  function eliminarDiseno(id: string) {
    setDisenos(prev => prev.filter(d => d.id !== id))
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

      {vista === 'home'         && <Home setVista={setVista} disenos={disenos} onEliminar={eliminarDiseno} />}
      {vista === 'calendario'   && <EditorCalendario   setVista={setVista} guardarDiseno={guardarDiseno} />}
      {vista === 'agenda'       && <WizardAgenda        setVista={setVista} guardarDiseno={guardarDiseno} />}
      {vista === 'planificador' && <EditorPlanificador  setVista={setVista} guardarDiseno={guardarDiseno} />}
    </div>
  )
}