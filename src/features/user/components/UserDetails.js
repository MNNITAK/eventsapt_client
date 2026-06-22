'use client'
import React, { useEffect, useRef } from 'react'
import GoogleLogo from "../../../../public/google-icon.svg"
import Image from 'next/image'
import { userschema } from '@/schema/userSchema'
import { Authinput } from '../../../app/Components/ui/input'
import { LoginViaGoogle } from '@/lib/googleAuth'
import spinner from "../../../../public/spinner.svg"
import { checkusername } from '@/apiFunctions/checkusername'
import { useMutation } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { signup } from '@/apiFunctions/user/signup'
import Link from 'next/link'

const GRADIENT = 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)'

function Userdetailspage1({ userDetails, setDetails, prev, next, error, setError, index, queryParams }) {
  const { mutate, isPending, data, isError, error: checkError } = useMutation({ mutationFn: checkusername })
  const { mutate: signupMutation, isPending: signupPending, data: signupData, isError: signupIsError, error: signupCheckError } = useMutation({ mutationFn: signup })

  const usernameDebounce = useDebouncedCallback(val => { mutate(val.trim()) }, 500)

  useEffect(() => {
    if (userDetails.username.length > 3) usernameDebounce(userDetails.username)
  }, [userDetails.username])

  const handleSubmit = () => {
    let validationResponse = userschema.safeParse(userDetails)?.error?.errors
    validationResponse = validationResponse?.filter(item => item.path[0] !== 'locationCity')
    if (validationResponse?.length > 0) { setError(validationResponse) }
    else { setError([]); signupMutation({ cred: userDetails }) }
  }

  const loginViaGoole = () => LoginViaGoogle(userDetails, setDetails, false)

  const errorInitiator = name => error.some(el => el.path[0] === name)
  const errorMessage = name => error.filter(item => item.path == name)

  const setPreferences = () => {
    const params = new URLSearchParams(queryParams)
    params.set('compIndex', index + 1)
    window.history.pushState(null, '', `?${params.toString()}`)
    next()
  }

  // Auto-advance to the next step the moment sign-up succeeds, so the user is
  // never stranded on the form after a successful sign-up. The "Set Preferences"
  // button below remains as a manual fallback. Guarded by a ref so it only
  // advances once (and survives React StrictMode's double-invoke in dev).
  const advancedRef = useRef(false)
  useEffect(() => {
    if (!advancedRef.current && (signupData?.status === 201 || signupData?.status === 200)) {
      advancedRef.current = true
      setPreferences()
    }
  }, [signupData])

  const inputOption = [
    { type: 'text', placeholder: 'Enter username', name: 'username', label: 'Username' },
    { type: 'email', placeholder: 'Enter email', name: 'email', label: 'Email' },
    { type: 'password', placeholder: 'Enter password', name: 'password', label: 'Password' },
    { type: 'number', placeholder: 'Enter phone number', name: 'phoneNumber', label: 'Phone Number' },
  ]

  return (
    <div className="w-[87vw] md:w-[26vw] flex flex-col gap-1 py-2">
      {inputOption.map((item, pos) => (
        <div key={pos} className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>
            {item.label}
          </label>
          <div className="relative">
            <Authinput type={item.type} name={item.name} setDetails={setDetails} details={userDetails} placeholder={item.placeholder} />
            {item.name === 'username' && isPending && (
              <Image className="absolute top-3 right-3" src={spinner} alt="spinner" width={20} height={20} />
            )}
          </div>
          {item.name === 'username' && userDetails.username.length > 3 && !isPending && (
            data?.status === 200
              ? <p className="text-xs text-green-400 pl-1">✓ Username available</p>
              : checkError?.status === 409
                ? <p className="text-xs pl-1" style={{ color: '#FF89AC' }}>✗ Username not available</p>
                : null
          )}
          {item.name !== 'username' && error?.length > 0 && errorInitiator(item.name) && (
            <p className="text-xs pl-1" style={{ color: '#FF89AC' }}>{errorMessage(item.name)[0]?.message}</p>
          )}
        </div>
      ))}

      {/* Status messages */}
      {(signupData?.data?.message || signupCheckError?.response?.data?.message) && (
        <p className="text-sm text-center" style={{ color: '#adaaaa' }}>
          {signupData?.data?.message || signupCheckError?.response?.data?.message}
        </p>
      )}

      {/* CTA button */}
      {signupData?.status === 201 || signupCheckError?.status === 409
        ? <button onClick={setPreferences} className="w-full py-3 rounded-xl font-semibold text-black mt-3 transition-opacity hover:opacity-90" style={{ background: GRADIENT }}>
            Set Preferences
          </button>
        : <button disabled={signupIsError} onClick={handleSubmit} className="w-full py-3 rounded-xl font-semibold text-black mt-3 transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: GRADIENT }}>
            {signupPending ? 'Signing up…' : 'Sign Up'}
          </button>
      }

      <p className="text-center text-sm mt-1" style={{ color: '#adaaaa' }}>
        Already have an account?{' '}
        <Link href="/login?usertype=user" className="font-semibold" style={{ color: '#FF89AC' }}>Sign In</Link>
      </p>

      {/* Divider */}
      <div className="relative my-2">
        <hr style={{ borderColor: 'rgba(73,72,71,0.4)' }} />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 text-xs" style={{ color: '#adaaaa', background: '#0e0e0e' }}>OR</span>
      </div>

      {/* Google */}
      <button
        disabled={signupData || signupIsError}
        onClick={loginViaGoole}
        className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border transition-colors hover:border-white/30 disabled:opacity-50"
        style={{ background: '#1a1919', border: '1px solid rgba(73,72,71,0.4)', color: '#fff', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <Image alt="Google" src={GoogleLogo} height={18} width={18} />
        Continue with Google
      </button>
    </div>
  )
}

export { Userdetailspage1 }
