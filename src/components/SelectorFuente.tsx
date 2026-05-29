/* eslint-disable */
import { FUENTES } from '../constants'

export default function SelectorFuente({ fuente, setFuente }: { fuente: string, setFuente: (v: string) => void }) {
  return (
    <select value={fuente} onChange={(e: any) => setFuente(e.target.value)} style={{
      padding:'6px 10px', borderRadius:'8px', border:'1px solid #e2e8f0',
      fontSize:'12px', cursor:'pointer', outline:'none', fontFamily:fuente
    }}>
      {FUENTES.map(f => <option key={f} value={f} style={{ fontFamily:f }}>T {f}</option>)}
    </select>
  )
}