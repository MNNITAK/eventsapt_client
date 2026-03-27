'use client'
import Link from "next/link";

export default function AuthStruct({ usertype }) {
  const isVendor = usertype === 'vendor'

  const loginHref = {
    pathname: '/login',
    query: isVendor ? { usertype: 'vendor' } : { usertype: 'user' },
  }
  const signupHref = {
    pathname: '/signup',
    query: isVendor ? { usertype: 'vendor' } : { usertype: 'user', compIndex: '1' },
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-2">
      {/* Login button — gradient fill */}
      <Link
        href={loginHref}
        className="w-full text-center font-semibold py-3 rounded-xl text-black transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Login
      </Link>

      {/* Sign Up button — outlined */}
      <Link
        replace={!isVendor}
        href={signupHref}
        className="w-full text-center font-semibold py-3 rounded-xl text-white border transition-colors hover:border-white/50"
        style={{ borderColor: '#494847', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Sign Up
      </Link>
    </div>
  )
}
