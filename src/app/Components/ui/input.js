const inputBase = [
  'w-full h-12 rounded-xl px-4 text-white text-sm outline-none transition-all',
  'bg-[#1a1919] border border-[rgba(73,72,71,0.4)]',
  'focus:border-[#FF89AC] placeholder:text-[#555]',
].join(' ')

function Authinput({ details, setDetails, placeholder, type, name }) {
  return (
    <input
      type={type}
      name={name}
      readOnly={details['isGoogleAuthenticated'] && type === 'password'}
      className={inputBase + ' mt-3 w-[85vw] md:w-[25vw]'}
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      placeholder={details['isGoogleAuthenticated'] && type === 'password' ? 'No password required' : placeholder}
      value={details[name]}
      onChange={e => setDetails(prev => ({ ...prev, [e.target.name]: e.target.value.trim() }))}
    />
  )
}
export { Authinput }
