import React from 'react'
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
      <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
        EventApt
      </span>
    </div>
  )
}
export default Logo
