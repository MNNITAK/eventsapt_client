import { updatePreference } from "@/apiFunctions/user/signup"
import { userPreferences } from "@/lib/constants"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Userpreference({ prev, next, userDetails, setDetails, index, queryParams }) {
  const router = useRouter()
  const { mutate: updatePref, data: prefData, isError: prefIsError, error: prefErr, isPending: prefPending } = useMutation({ mutationFn: updatePreference })

  const updateList = (title, value) => {
    const isInside = userDetails.userPreference.some(item => item.title === title)
    if (isInside) {
      const updated = userDetails.userPreference.map(item => {
        if (item.title !== title) return item
        return { ...item, value: item.value.includes(value) ? item.value.filter(v => v !== value) : [...item.value, value] }
      })
      setDetails(prev => ({ ...prev, userPreference: updated.filter(item => item.value.length > 0) }))
    } else {
      setDetails(prev => ({ ...prev, userPreference: [...userDetails.userPreference, { title, value: [value] }] }))
    }
  }

  const isSelected = (title, value) =>
    userDetails.userPreference.some(item => item.title === title && item.value.includes(value))

  const WindowHistoryStack = (pageIndex, replace = false) => {
    const params = new URLSearchParams(queryParams)
    params.set('compIndex', pageIndex)
    replace ? window.history.replaceState(null, '', `?${params.toString()}`) : window.history.pushState(null, '', `?${params.toString()}`)
  }

  useEffect(() => {}, [prefErr])

  return (
    <div className="w-[87vw] md:w-[26vw] flex flex-col gap-4">

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>Your Preferences</h2>
        <p className="text-xs mt-1" style={{ color: '#adaaaa' }}>Choose what matters most for your event</p>
      </div>

      {/* Scrollable preference list */}
      <div className="preferenceList overflow-y-auto flex flex-col gap-5" style={{ maxHeight: '45vh' }}>
        {userPreferences.map((item, pos) => (
          <section key={pos}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#adaaaa' }}>{item.title}</h3>
            <div className="flex flex-wrap gap-2">
              {item.value.map((listItem, i) => (
                <span
                  key={i}
                  onClick={() => updateList(item.title, listItem)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
                  style={
                    isSelected(item.title, listItem)
                      ? { background: 'linear-gradient(135deg, #FF89AC, #EA73FB)', color: '#000' }
                      : { background: 'rgba(255,137,172,0.08)', color: '#FF89AC', border: '1px solid rgba(255,137,172,0.2)' }
                  }
                >
                  {listItem}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      {prefData?.status === 401 && (
        <p className="text-sm text-center" style={{ color: '#adaaaa' }}>Your account already exists — please login.</p>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => { prev(); WindowHistoryStack(index - 1, true) }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:border-white/30"
          style={{ borderColor: '#494847', color: '#adaaaa' }}
        >
          ← Back
        </button>

        {prefData || prefIsError
          ? <button
              disabled={prefPending}
              onClick={() => router.push('/home/user?tab=search')}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)' }}
            >
              Continue →
            </button>
          : <button
              disabled={userDetails.userPreference.length === 0 || prefPending}
              onClick={() => updatePref({ cred: userDetails })}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)' }}
            >
              {prefPending ? 'Saving…' : 'Save & Continue'}
            </button>
        }
      </div>

      <button onClick={() => router.push('/home/user')} className="text-center text-sm" style={{ color: '#adaaaa' }}>
        Skip for now
      </button>
    </div>
  )
}

export { Userpreference }
