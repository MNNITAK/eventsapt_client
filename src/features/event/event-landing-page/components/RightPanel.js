import { useTypingEffect } from "../hooks/useTypingEffect.js"
import { 
  Star, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
export const RightPanel = () => {
    const animatedText = useTypingEffect([
        "Unforgettable Weddings",
        "Epic Birthdays",
        "Corporate Retreats",
        "Dream Events"
      ]);
    return(
        <>
        <div className="hidden md:flex md:w-[70%] bg-gradient-to-br from-indigo-300 to-purple-400 p-12 flex-col justify-center relative overflow-hidden min-h-screen">
                
                {/* Abstract Background Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>
        
                <div className="relative z-10 max-w-3xl mx-auto w-full">
                  {/* Main Headline with Typing Effect */}
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                    Bring your vision to life. <br />
                    <span className="block h-[17vh] text-pink-200">
                      {animatedText}
                      <span className="animate-pulse">|</span>
                    </span>
                  </h1>
                  
                  <p className="text-lg lg:text-xl text-white/90 mb-12 max-w-2xl font-light">
                    Discover top-rated vendors, view their latest work through immersive reels, and instantly chat to make your dream event a reality.
                  </p>
        
                  {/* Trust / Advertising Cards (Glassmorphism) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white transform hover:-translate-y-1 transition-transform">
                      <Users className="text-pink-200 mb-4" size={32} />
                      <h3 className="text-2xl font-bold mb-1">50k+</h3>
                      <p className="text-white/80 text-sm">Active vendors showcasing their skills daily.</p>
                    </div>
        
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white transform hover:-translate-y-1 transition-transform">
                      <Star className="text-yellow-300 mb-4" size={32} />
                      <h3 className="text-2xl font-bold mb-1">4.9/5</h3>
                      <p className="text-white/80 text-sm">Average rating from thousands of happy users.</p>
                    </div>
        
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white transform hover:-translate-y-1 transition-transform">
                      <ShieldCheck className="text-green-300 mb-4" size={32} />
                      <h3 className="text-2xl font-bold mb-1">100%</h3>
                      <p className="text-white/80 text-sm">Secure bookings and verified vendor profiles.</p>
                    </div>
        
                  </div>
                </div>
              </div>
        </>
    )
}