"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  // "Unique Touch": Interactive Role Selection State
  const [hoveredRole, setHoveredRole] = useState(null);

  const features = [
    {
      title: "Portfolio Showcase",
      description: "Display your best work with stunning galleries designed to inspire couples.",
      stat: "2.5x",
      statLabel: "higher engagement"
    },
    {
      title: "Smart Connections",
      description: "Curated matching connects couples with vendors that fit their specific aesthetic.",
      stat: "10K+",
      statLabel: "active connections"
    },
    {
      title: "Business Suite",
      description: "Streamline inquiries and client communications in one elegant platform.",
      stat: "40hrs",
      statLabel: "saved monthly"
    }
  ];

  const vendors = [
    "Photography", "Videography", "Planning", "Catering", 
    "Floristry", "Venues", "Music", "Styling"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 selection:bg-rose-100 selection:text-rose-900 font-sans">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-md shadow-sm shadow-rose-200" />
            <span className="text-xl font-bold tracking-tight font-serif text-stone-900">VowStory</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="px-5 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Ambient Background Glows */}
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-orange-50/60 rounded-full blur-3xl -z-10 mix-blend-multiply" />

          <div className="relative z-10 text-center max-w-5xl mx-auto mb-16">
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-stone-900">
              Where Love Meets
              <br />
              <span className="font-serif bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent italic pr-2">
                Creativity
              </span>
            </h1>
            
            <p className="text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              The premier visual marketplace connecting stylish couples with world-class wedding professionals.
            </p>

            {/* UNIQUE TOUCH: Dual Identity Card Selection */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto">
              
              {/* Card 1: The Couple (User) */}
              <div 
                onMouseEnter={() => setHoveredRole('user')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => router.push('/authPage/user')}
                className={`
                  relative group cursor-pointer flex-1 p-8 rounded-2xl border transition-all duration-300 ease-out text-left
                  ${hoveredRole === 'vendor' ? 'opacity-60 blur-[1px]' : 'opacity-100'}
                  bg-white border-stone-100 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/50 hover:-translate-y-1
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-rose-50 rounded-full group-hover:bg-rose-100 transition-colors">
                    {/* Ring/Heart Icon */}
                    <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Free for Couples
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">I'm Planning</h3>
                <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                  Discover vendors, save inspiration, and build your dream team.
                </p>
                <div className="text-rose-500 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Find Vendors <span>→</span>
                </div>
              </div>

              {/* Card 2: The Vendor */}
              <div 
                onMouseEnter={() => setHoveredRole('vendor')}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => router.push('/authPage/vendor')}
                className={`
                  relative group cursor-pointer flex-1 p-8 rounded-2xl border transition-all duration-300 ease-out text-left
                  ${hoveredRole === 'user' ? 'opacity-60 blur-[1px]' : 'opacity-100'}
                  bg-stone-900 border-stone-800 hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/20 hover:-translate-y-1
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-stone-800 rounded-full group-hover:bg-stone-700 transition-colors">
                    {/* Camera/Store Icon */}
                    <svg className="w-6 h-6 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 bg-stone-800 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Join Network
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">I'm a Vendor</h3>
                <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                  Showcase your portfolio, manage inquiries, and get booked.
                </p>
                <div className="text-amber-200 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  List Business <span>→</span>
                </div>
              </div>

            </div>

            {/* Vendor Categories (Subtle) */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {vendors.map((vendor, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 bg-white border border-stone-100 rounded-full text-xs text-stone-500 cursor-default"
                >
                  {vendor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 bg-stone-50/50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-serif text-stone-900">Why VowStory?</h2>
            </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl border transition-all duration-500 bg-white ${
                  activeIndex === index
                    ? 'border-rose-200 shadow-xl shadow-rose-100/50 scale-[1.02]'
                    : 'border-stone-100 shadow-sm hover:border-rose-100 hover:shadow-md'
                }`}
              >
                <div className="mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-br from-rose-400 to-pink-500 bg-clip-text text-transparent font-serif">
                    {feature.stat}
                  </div>
                  <div className="text-sm text-stone-500 font-medium uppercase tracking-wider mt-2">{feature.statLabel}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-stone-900">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-sm">
          <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded shadow-sm" />
               <span className="font-semibold font-serif text-stone-900">VowStory</span>
          </div>
          <p>© 2024 VowStory. Elegantly crafted for professionals.</p>
        </div>
      </footer>
    </div>
  );
}