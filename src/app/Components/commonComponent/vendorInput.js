function VendorInput({ details, setDetails, placeholder, type, name }) {
  return (
    <input
      type={type}
      name={name}
      readOnly={details['isGoogleAuthenticated'] && type === 'password'}
      className="w-full h-11 rounded-xl px-4 text-white text-sm outline-none transition-all placeholder:text-[#555]"
      style={{
        background: '#1a1919',
        border: '1px solid rgba(73,72,71,0.4)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
      onFocus={e => (e.target.style.borderColor = '#FF89AC')}
      onBlur={e => (e.target.style.borderColor = 'rgba(73,72,71,0.4)')}
      placeholder={placeholder}
      value={details[name]}
      onChange={e => setDetails(prev => ({ ...prev, [e.target.name]: e.target.value.trim() }))}
    />
  )
}
export { VendorInput }
