/* eslint-disable */
export default function IndicadorPasos({ paso, total }: { paso: number, total: number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <div key={p} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <div style={{
            width:'28px', height:'28px', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'11px', fontWeight:700,
            background: p < paso ? '#16a34a' : p === paso ? '#3b82f6' : '#f1f5f9',
            color: p <= paso ? 'white' : '#94a3b8'
          }}>{p < paso ? '✓' : p}</div>
          {p < total && <div style={{ width:'20px', height:'2px', background: p < paso ? '#16a34a' : '#e2e8f0', borderRadius:'1px' }}/>}
        </div>
      ))}
    </div>
  )
}