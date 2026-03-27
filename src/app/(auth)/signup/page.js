export const metadata = { title: "EventApt - Sign Up", description: "Create your EventApt account" }
import Link from "next/link"
import SignUp from "../../../features/auth/components/SignUp"
import { Suspense } from "react"

async function page(props) {
  const { usertype, compIndex } = await props.searchParams
  const isVendor = usertype === 'vendor'

  return (
    <div className="w-screen min-h-screen bg-[#0e0e0e] flex flex-col md:flex-row overflow-hidden">

      {/* ── Left decorative panel ── */}
      <div
        className="hidden md:flex md:w-[38%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #130a1e 0%, #0e1a2d 60%, #1a0e2d 100%)' }}
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: isVendor ? 'radial-gradient(ellipse, rgba(166,140,255,0.1) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(255,137,172,0.1) 0%, transparent 70%)' }}
        />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>EventApt</span>
        </Link>

        <div className="relative z-10 flex flex-col gap-5">
          <h2 className="text-4xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            {isVendor ? 'Join the Elite\nVendor Network' : 'Start Planning\nYour Dream Event'}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>
            {isVendor
              ? 'Create your vendor profile and start reaching thousands of couples looking for exactly what you offer.'
              : 'Set up your free account and get instant access to hundreds of curated event professionals.'}
          </p>

          <div className="flex flex-col gap-3 mt-2">
            {(isVendor
              ? ['✦  Free to list your services', '✦  Get discovered by high-intent clients', '✦  Manage bookings & inquiries easily']
              : ['✦  Browse 500+ verified vendors', '✦  Save favourites & compare quotes', '✦  Free for couples — always']
            ).map((f, i) => (
              <p key={i} className="text-sm" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>{f}</p>
            ))}
          </div>
        </div>

        <div className="relative z-10 pl-4" style={{ borderLeft: '2px solid #FF89AC' }}>
          <p className="text-sm italic leading-relaxed" style={{ color: '#adaaaa' }}>
            {isVendor
              ? '"Signing up was effortless. I had my first booking within a week."'
              : '"Set up in minutes, found our florist in hours. Best decision we made."'}
          </p>
          <p className="text-xs mt-2 text-white font-medium">
            {isVendor ? '— Lily Chen, Floral Designer' : '— Marcus & Priya, Married 2026'}
          </p>
        </div>
      </div>

      {/* ── Right signup form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 overflow-y-auto">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 md:hidden">
          <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>EventApt</span>
        </Link>

        <div className="w-full max-w-md">
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{
              background: isVendor ? 'rgba(166,140,255,0.1)' : 'rgba(255,137,172,0.1)',
              color: isVendor ? '#A68CFF' : '#FF89AC',
              border: `1px solid ${isVendor ? 'rgba(166,140,255,0.25)' : 'rgba(255,137,172,0.25)'}`,
            }}
          >
            {isVendor ? '🏢 Business Account' : '💍 Personal Account'}
          </span>

          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Create your account
          </h1>
          <p className="text-sm mb-6" style={{ color: '#adaaaa' }}>
            {isVendor ? 'Set up your vendor profile in minutes.' : 'Free forever for couples planning their event.'}
          </p>

          <Suspense fallback={<div className="text-white/40 text-sm">Loading…</div>}>
            <SignUp usertype={usertype} compIndex={compIndex || ""} />
          </Suspense>

          <p className="text-center text-sm mt-6" style={{ color: '#adaaaa' }}>
            Already have an account?{' '}
            <Link href={`/authPage/${usertype || 'user'}`} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#FF89AC' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
