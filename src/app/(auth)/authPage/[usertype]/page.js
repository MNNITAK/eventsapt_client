export const metadata = { title: "EventApt - Sign In" }
import React from 'react'
import Link from 'next/link'
import AuthPage from '@/features/auth/_authPageStructure/authStruct.js'

async function page(props) {
  let { usertype } = await props.params
  const isVendor = usertype === 'vendor'

  const stats = isVendor
    ? [{ val: '10K+', label: 'Active Vendors' }, { val: '95%', label: 'Satisfaction' }, { val: '3x', label: 'More Bookings' }]
    : [{ val: '50K+', label: 'Happy Couples' }, { val: '500+', label: 'Top Vendors' }, { val: '4.9★', label: 'Avg Rating' }]

  return (
    <main className="w-screen min-h-screen bg-[#0e0e0e] flex flex-col md:flex-row overflow-hidden">

      {/* ── Left brand panel ── */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #130a1e 0%, #0e1a2d 60%, #1a0e2d 100%)' }}
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: isVendor ? 'radial-gradient(ellipse, rgba(166,140,255,0.12) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(255,137,172,0.12) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>EventApt</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex flex-col gap-5">
          <h2 className="text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            {isVendor ? 'Grow Your\nEvent Business' : 'Plan Your\nPerfect Day'}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>
            {isVendor
              ? 'Join thousands of event professionals reaching their ideal clients on EventApt.'
              : 'Discover and book world-class event vendors — all in one elegant place.'}
          </p>
          <div className="flex gap-10 mt-2">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(120deg, #FF89AC 0%, #A68CFF 100%)', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: '#adaaaa' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 pl-4" style={{ borderLeft: '2px solid #FF89AC' }}>
          <p className="text-sm italic leading-relaxed" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>
            {isVendor
              ? '"EventApt transformed how I reach clients. My bookings doubled in 2 months."'
              : '"Found our dream photographer and florist in one afternoon. Love this platform."'}
          </p>
          <p className="text-xs mt-2 text-white font-medium">
            {isVendor ? '— Marco Visuals, Cinematographer' : '— Sophie & James, Married 2026'}
          </p>
        </div>
      </div>

      {/* ── Right auth panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 md:hidden">
          <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>EventApt</span>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-5">
          <span
            className="self-start text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: isVendor ? 'rgba(166,140,255,0.1)' : 'rgba(255,137,172,0.1)',
              color: isVendor ? '#A68CFF' : '#FF89AC',
              border: `1px solid ${isVendor ? 'rgba(166,140,255,0.25)' : 'rgba(255,137,172,0.25)'}`,
            }}
          >
            {isVendor ? '🏢 Business Account' : '💍 Personal Account'}
          </span>

          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              {isVendor ? 'Business Sign In' : 'Welcome Back'}
            </h1>
            <p className="text-sm mt-2" style={{ color: '#adaaaa' }}>
              {isVendor ? 'Access your vendor dashboard and manage bookings.' : 'Continue planning your perfect event.'}
            </p>
          </div>

          <AuthPage usertype={usertype} />

          <p className="text-center text-sm pt-2" style={{ color: '#adaaaa' }}>
            {isVendor ? 'Planning an event? ' : 'Are you a vendor? '}
            <Link href={isVendor ? '/authPage/user' : '/authPage/vendor'} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#FF89AC' }}>
              {isVendor ? 'Sign in as a user →' : 'Business sign in →'}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default page
