"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const GRADIENT = 'linear-gradient(120deg, #FF89AC 0%, #A68CFF 100%)';
const BTN_GRADIENT = 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)';

const categories = [
  { name: 'Photography', emoji: '📷' },
  { name: 'Videography', emoji: '🎥' },
  { name: 'Planning', emoji: '📋' },
  { name: 'Catering', emoji: '🍽️' },
  { name: 'Floristry', emoji: '💐' },
  { name: 'Venues', emoji: '🏛️' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Styling', emoji: '✨' },
];

const reels = [
  { label: 'Garden Ceremony', sub: 'Photography', bg: 'linear-gradient(135deg, #3d0e2b 0%, #6b1a4a 100%)' },
  { label: 'Cinematic Story', sub: 'Videography', bg: 'linear-gradient(135deg, #1a0e40 0%, #3d1a8e 100%)' },
  { label: 'Reception Night', sub: 'Planning', bg: 'linear-gradient(135deg, #2a1040 0%, #5d1a6e 100%)' },
  { label: 'Bridal Portraits', sub: 'Photography', bg: 'linear-gradient(135deg, #3d1a0e 0%, #7a3a1a 100%)' },
];

const topVendors = [
  { name: 'Elena Morris', specialty: 'Fine Art Photography', rating: '4.9', reviews: '234', bg: 'linear-gradient(135deg, #3d0e2b, #6b1a4a)' },
  { name: 'Marco Visuals', specialty: 'Cinematic Videography', rating: '4.8', reviews: '189', bg: 'linear-gradient(135deg, #1a0e40, #3d1a8e)' },
  { name: 'Bloom & Co.', specialty: 'Floral Design', rating: '5.0', reviews: '156', bg: 'linear-gradient(135deg, #0e2d1a, #1a6e3d)' },
  { name: 'The Sound House', specialty: 'Live Music & DJ', rating: '4.9', reviews: '201', bg: 'linear-gradient(135deg, #2d1a0e, #6e3d1a)' },
];

const testimonials = [
  {
    quote: 'Found our dream photographer within a week. The quality of vendors here is absolutely unmatched.',
    author: 'Sophie & James',
    role: 'Married June 2026',
  },
  {
    quote: 'As a florist, this platform transformed my business. My bookings tripled in just 3 months.',
    author: 'Lily Chen',
    role: 'Floral Designer',
  },
  {
    quote: 'The curation is exceptional. Every vendor we hired through EventApt exceeded all expectations.',
    author: 'Marcus & Priya',
    role: 'Married September 2026',
  },
];

const steps = [
  { title: 'Discover', desc: 'Browse through an elite list of hand-picked vendors from around the globe.' },
  { title: 'Explore', desc: 'View detailed portfolios, read real reviews, and check real-time availability.' },
  { title: 'Book', desc: 'Secure your dream team with one click and manage everything in one place.' },
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-x-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* Navbar */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrollY > 20 ? 'rgba(14,14,14,0.9)' : 'transparent',
          backdropFilter: scrollY > 20 ? 'blur(12px)' : 'none',
          borderBottom: scrollY > 20 ? '1px solid rgba(73,72,71,0.3)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md" style={{ background: BTN_GRADIENT }} />
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              EventApt
            </span>
          </div>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium transition-colors"
            style={{ color: '#adaaaa' }}
            onMouseEnter={e => (e.target.style.color = '#fff')}
            onMouseLeave={e => (e.target.style.color = '#adaaaa')}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-28 px-8">
        {/* Ambient glow */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,137,172,0.08) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex gap-16 items-center">

            {/* Left: Copy + CTAs */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <h1
                className="font-extrabold leading-none tracking-[-3px]"
                style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontSize: 'clamp(48px, 5.5vw, 72px)' }}
              >
                Discover &amp;<br />
                Book the{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
                  Best
                </span>
                <br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
                  Event
                </span>
                <br />
                Vendors
              </h1>

              <p className="text-lg leading-relaxed max-w-[460px]" style={{ color: '#adaaaa' }}>
                The elite marketplace for high-end event services. From world-class photography to immersive
                decor, curate your perfect moment with the click of a button.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => router.push('/authPage/user')}
                  className="px-8 py-4 rounded-full text-black font-semibold text-lg transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ background: BTN_GRADIENT }}
                >
                  Explore Vendors
                </button>
                <button
                  onClick={() => router.push('/authPage/vendor')}
                  className="px-8 py-4 rounded-full text-white font-semibold text-lg border transition-colors hover:border-white/50"
                  style={{ borderColor: '#494847' }}
                >
                  Become a Vendor
                </button>
              </div>
            </div>

            {/* Right: Staggered image grid */}
            <div className="flex-1 min-w-0 hidden lg:grid grid-cols-3 gap-4" style={{ height: 640 }}>
              {/* Col 1 — starts lower */}
              <div className="flex flex-col gap-4 pt-12">
                <div className="flex-1 rounded-[28px]" style={{ background: 'linear-gradient(160deg, #3d0e2b 0%, #6b1a4a 100%)', minHeight: 220 }} />
                <div className="flex-1 rounded-[28px]" style={{ background: 'linear-gradient(160deg, #1a0e40 0%, #3d1a8e 100%)', minHeight: 280 }} />
              </div>
              {/* Col 2 — starts higher */}
              <div className="flex flex-col gap-4 pb-12">
                <div className="flex-1 rounded-[28px]" style={{ background: 'linear-gradient(160deg, #2a1040 0%, #5d1a6e 100%)', minHeight: 280 }} />
                <div className="flex-1 rounded-[28px]" style={{ background: 'linear-gradient(160deg, #0e2d1a 0%, #1a6e3d 100%)', minHeight: 220 }} />
              </div>
              {/* Col 3 — offset */}
              <div className="flex flex-col gap-4 pt-6">
                <div className="flex-1 rounded-[28px]" style={{ background: 'linear-gradient(160deg, #3d1a0e 0%, #7a3a1a 100%)', minHeight: 250 }} />
                <div className="flex-1 rounded-[28px]" style={{ background: 'linear-gradient(160deg, #1a2d0e 0%, #3a6e1a 100%)', minHeight: 250 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-8 border-t border-b" style={{ borderColor: 'rgba(73,72,71,0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-10 justify-center">
            {categories.map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-colors"
                  style={{
                    background: '#201f1f',
                    border: '1px solid rgba(73,72,71,0.2)',
                  }}
                >
                  {cat.emoji}
                </div>
                <span className="text-sm font-medium" style={{ color: '#adaaaa' }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reels Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Moments in Motion
              </h2>
              <p style={{ color: '#adaaaa' }}>See the craft in action through vendor reels</p>
            </div>
            <button
              className="px-6 py-2 text-sm font-medium border rounded-full transition-colors hover:border-white/40"
              style={{ color: '#adaaaa', borderColor: '#494847' }}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reels.map((reel, i) => (
              <div
                key={i}
                className="relative rounded-[24px] overflow-hidden cursor-pointer group"
                style={{ height: 320, background: reel.bg }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {/* Play button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-semibold text-sm">{reel.label}</p>
                  <p className="text-white/60 text-xs">{reel.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Vendors Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Top-Rated Professionals
            </h2>
            <div className="flex gap-2">
              {['M15 19l-7-7 7-7', 'M9 5l7 7-7 7'].map((d, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors hover:border-white/40"
                  style={{ borderColor: '#494847' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topVendors.map((v, i) => (
              <div
                key={i}
                className="rounded-[24px] overflow-hidden cursor-pointer transition-colors"
                style={{ border: '1px solid rgba(73,72,71,0.2)' }}
              >
                <div className="h-48" style={{ background: v.bg }} />
                <div className="p-5" style={{ background: '#1a1919' }}>
                  <p className="font-semibold text-white text-base mb-1">{v.name}</p>
                  <p className="text-sm mb-3" style={{ color: '#adaaaa' }}>{v.specialty}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-sm font-medium">{v.rating}</span>
                    <span className="text-sm ml-1" style={{ color: '#adaaaa' }}>({v.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-8 relative">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] pointer-events-none"
          style={{ borderTop: '1px dashed rgba(73,72,71,0.2)' }}
        />
        <div className="max-w-4xl mx-auto flex flex-col gap-16 items-center relative z-10">
          <div className="flex flex-col gap-4 items-center text-center">
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Curating Excellence Made Simple
            </h2>
            <p style={{ color: '#adaaaa' }}>Three steps to finding your perfect event team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: '#262626', border: '1px solid rgba(73,72,71,0.3)' }}
                >
                  <span
                    className="text-2xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: GRADIENT, fontFamily: "var(--font-plus-jakarta), sans-serif" }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="font-semibold text-xl text-white">{step.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#adaaaa' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <h2
            className="text-4xl font-bold text-white text-center"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            Loved by the Community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-[32px] p-8 flex flex-col gap-6"
                style={{
                  background: 'rgba(38,38,38,0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(73,72,71,0.2)',
                }}
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white text-base leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm text-white">{t.author}</p>
                  <p className="text-sm" style={{ color: '#adaaaa' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8" style={{ borderTop: '1px solid rgba(73,72,71,0.2)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              EventApt
            </span>
            <p className="text-xs uppercase tracking-widest" style={{ color: '#71717a' }}>
              © 2026 EventApt. Built for the elite.
            </p>
          </div>
          <div className="flex gap-8 text-sm" style={{ color: '#adaaaa' }}>
            {['About', 'Vendors', 'Privacy', 'Contact'].map(link => (
              <Link key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
