/* eslint-disable */
export default function BtnVolver({ setVista }: { setVista: (v: any) => void }) {
  return (
    <button onClick={() => setVista('home')} style={{
      padding:'6px 14px', borderRadius:'8px',
      border:'1px solid #e2e8f0', background:'white',
      cursor:'pointer', fontSize:'12px', color:'#64748b', fontWeight:600
    }}>← Inicio</button>
  )
}