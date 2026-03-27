'use client'
import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { PlaceholdersAndVanishInput } from "@/app/Components/ui/changeInputPlaceholder"
import Link from "next/link";
import GoogleLogo from "../../../../public/google-icon.svg"
import Image from "next/image";
import { logViaGoogle } from "@/lib/googleAuth";
import { loginSchema } from "@/schema/userSchema";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { loginClient } from "@/features/auth/api/clientLogin";

function UserLogin() {
  const searchParams = useSearchParams()
  const searchKey = searchParams.get('usertype')
  const router = useRouter()
  const [credError, setErr] = useState([])
  const { mutate, error, isPending, isError, isSuccess } = useMutation({ mutationFn: loginClient })
  const [userCredentials, setCredentials] = useState({ userid: "", password: "", isGoogleAuthenticated: false })

  const placeholders = ["Enter username or email", "Enter email"]

  const loginViaGoogle = async () => {
    const data = await logViaGoogle()
    mutate({ data: { userid: data.email }, router, client: searchKey })
  }

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value.trim() }))
  }

  const onSubmit = () => {
    setErr([])
    const validated = loginSchema.safeParse(userCredentials)
    if (!validated?.success) { setErr(validated?.error?.errors); return }
    mutate({ data: userCredentials, router, client: searchKey })
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Username/email input */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: '#adaaaa' }}>Username or Email</label>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
          autofocusInput={true}
          name="userid"
        />
      </div>

      {/* Password input */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: '#adaaaa' }}>Password</label>
        <input
          type="password"
          className="w-full h-12 rounded-xl px-4 text-white text-sm outline-none transition-all"
          style={{
            background: '#1a1919',
            border: '1px solid rgba(73,72,71,0.4)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
          onFocus={e => e.target.style.borderColor = '#FF89AC'}
          onBlur={e => e.target.style.borderColor = 'rgba(73,72,71,0.4)'}
          placeholder="Enter password"
          onChange={handleChange}
          name="password"
        />
      </div>

      {/* Errors */}
      {credError?.length > 0 && (
        <p className="text-sm" style={{ color: '#FF89AC' }}>Please provide valid credentials.</p>
      )}
      {isError && (
        <p className="text-sm" style={{ color: '#FF89AC' }}>{error?.response?.data?.message}</p>
      )}

      {/* Login button */}
      <button
        onClick={onSubmit}
        disabled={isPending || isSuccess}
        className="w-full py-3 rounded-xl font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
        style={{ background: 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {isPending ? 'Signing in…' : 'Login'}
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm" style={{ color: '#adaaaa' }}>
        Don&apos;t have an account?{' '}
        <Link href="/authPage/user" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#FF89AC' }}>
          Sign Up
        </Link>
      </p>

      {/* Google — only for non-vendor */}
      {searchKey !== 'vendor' && (
        <>
          <div className="relative my-1">
            <hr style={{ borderColor: 'rgba(73,72,71,0.4)' }} />
            <span
              className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 text-xs"
              style={{ color: '#adaaaa', background: '#0e0e0e' }}
            >
              OR
            </span>
          </div>

          <button
            onClick={loginViaGoogle}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border transition-colors hover:border-white/30"
            style={{
              background: '#1a1919',
              border: '1px solid rgba(73,72,71,0.4)',
              color: '#ffffff',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            <Image alt="Google" src={GoogleLogo} height={18} width={18} />
            Continue with Google
          </button>
        </>
      )}
    </div>
  )
}

export { UserLogin }
