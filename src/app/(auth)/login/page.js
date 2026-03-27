export const metadata = { title: "EventApt - Login" }
import Link from "next/link"
import { Suspense } from "react"
import { UserLogin } from "../../../features/auth/components/Login"

function page() {
  return (
    <div className="w-screen min-h-screen bg-[#0e0e0e] flex flex-col md:flex-row overflow-hidden">

      {/* ── Left decorative panel ── */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #130a1e 0%, #0e1a2d 60%, #1a0e2d 100%)' }}
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,137,172,0.1) 0%, transparent 70%)' }}
        />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>EventApt</span>
        </Link>

        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Your Next<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(120deg, #FF89AC 0%, #A68CFF 100%)' }}>
              Perfect Event
            </span><br />
            Starts Here
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>
            Log in to access your curated vendor network, saved favourites, and upcoming event plans.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-3 mt-2">
            {[
              '✦  Instant access to 500+ verified vendors',
              '✦  Manage bookings in one elegant dashboard',
              '✦  Real-time availability & messaging',
            ].map((f, i) => (
              <p key={i} className="text-sm" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>{f}</p>
            ))}
          </div>
        </div>

        <div className="relative z-10 pl-4" style={{ borderLeft: '2px solid #FF89AC' }}>
          <p className="text-sm italic leading-relaxed" style={{ color: '#adaaaa' }}>
            &ldquo;Found our dream photographer and florist in one afternoon. Absolutely love this platform.&rdquo;
          </p>
          <p className="text-xs mt-2 text-white font-medium">— Sophie & James, Married 2026</p>
        </div>
      </div>

      {/* ── Right login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 md:hidden">
          <div className="w-8 h-8 rounded-md" style={{ background: 'linear-gradient(135deg, #FF89AC, #EA73FB)' }} />
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>EventApt</span>
        </Link>

        <div className="w-full max-w-sm flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-4" style={{ color: '#adaaaa' }}>Sign in to continue to your account.</p>

          <Suspense fallback={<div className="text-white/50 text-sm">Loading...</div>}>
            <UserLogin />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default page
