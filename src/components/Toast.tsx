/* eslint-disable */
export default function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  const isError = msg.startsWith('❌')
  return (
    <div style={{
      position:'fixed', bottom:'20px', right:'20px',
      background: isError ? '#dc2626' : '#16a34a',
      color:'white', padding:'10px 18px', borderRadius:'10px',
      fontSize:'13px', fontWeight:600,
      boxShadow:'0 4px 16px rgba(0,0,0,0.18)', zIndex:9999,
    }}>
      {msg}
    </div>
  )
}