import { VendorInput } from "../commonComponent/vendorInput"
import { vendorDetails_p1 } from "@/lib/constants"
import { CitiesActive } from "@/app/Components/vendorComponent/CitiesActive"
import { ServicesModal } from "./services"
import { useState } from "react"
import { vendorSchema } from "@/schema/vendorSchema"
import { useMutation } from "@tanstack/react-query"
import { signup } from "@/features/vendor/api/signup"
import { useRouter } from "next/navigation"

const GRADIENT = 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)'

function VendorSignup({ vendorDetails, setvendorDetails }) {
  const router = useRouter()
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [validationError, setVaidationErr] = useState([])
  const { mutate, error, isPending, isError } = useMutation({ mutationFn: signup })

  const submit = () => {
    const validationResponse = vendorSchema.safeParse(vendorDetails)
    setVaidationErr(validationResponse?.error?.errors)
    if (!validationResponse?.error?.errors) {
      mutate({ cred: vendorDetails, router })
    }
  }

  const checkErr = name => {
    const resp = validationError?.filter(item => item.path[0] === name)
    return resp?.length > 0 ? [true, resp[0]?.message] : [false, '']
  }

  const inputStyle = {
    background: '#1a1919',
    border: '1px solid rgba(73,72,71,0.4)',
    color: 'white',
    fontFamily: 'var(--font-inter), sans-serif',
  }

  return (
    <>
      <CitiesActive open={citiesOpen} setOpen={setCitiesOpen} vendorDetails={vendorDetails} setvendorDetails={setvendorDetails} />
      <ServicesModal open={servicesOpen} setOpen={setServicesOpen} vendorDetails={vendorDetails} setvendorDetails={setvendorDetails} />

      <div className="w-full flex flex-col gap-3">

        {/* Main fields from constants */}
        {vendorDetails_p1.map((item, pos) => (
          <div key={pos} className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: '#adaaaa', fontFamily: 'var(--font-inter), sans-serif' }}>
              {item.title}
            </label>
            <VendorInput
              details={vendorDetails}
              setDetails={setvendorDetails}
              placeholder={item.placeholder}
              type={item.type}
              name={item.name}
            />
            {validationError?.length > 0 && checkErr(item.name)[0] && (
              <p className="text-xs pl-1" style={{ color: '#FF89AC' }}>{checkErr(item.name)[1]}</p>
            )}
          </div>
        ))}

        {/* City + Address row */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-[35%]">
            <label className="text-xs font-medium" style={{ color: '#adaaaa' }}>City</label>
            <input
              type="text"
              placeholder="City"
              className="w-full h-11 rounded-xl px-3 text-white text-sm outline-none transition-all placeholder:text-[#555]"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#FF89AC')}
              onBlur={e => (e.target.style.borderColor = 'rgba(73,72,71,0.4)')}
              onChange={e => setvendorDetails({ ...vendorDetails, city: e.target.value.trim() })}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-medium" style={{ color: '#adaaaa' }}>Address</label>
            <textarea
              placeholder="Complete address"
              className="w-full rounded-xl px-3 py-2 text-white text-sm outline-none transition-all resize-none placeholder:text-[#555]"
              style={{ ...inputStyle, height: 44 }}
              onFocus={e => (e.target.style.borderColor = '#FF89AC')}
              onBlur={e => (e.target.style.borderColor = 'rgba(73,72,71,0.4)')}
              onChange={e => setvendorDetails({ ...vendorDetails, address: e.target.value.trim() })}
              name="address"
            />
          </div>
        </div>
        {validationError?.length > 0 && validationError.filter(item => ['city', 'address'].includes(item.path[0])).length > 0 && (
          <p className="text-xs pl-1" style={{ color: '#FF89AC' }}>Please complete your address</p>
        )}

        {/* Cities + Services selectors */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCitiesOpen(!citiesOpen)}
            className="py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:border-[#FF89AC]/50"
            style={{ borderColor: '#FF89AC', color: '#FF89AC', background: 'rgba(255,137,172,0.05)' }}
          >
            Select Cities
          </button>
          <button
            onClick={() => setServicesOpen(!servicesOpen)}
            className="py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:border-[#FF89AC]/50"
            style={{ borderColor: '#FF89AC', color: '#FF89AC', background: 'rgba(255,137,172,0.05)' }}
          >
            Select Services
          </button>
        </div>
        {validationError?.length > 0 && validationError.filter(item => ['servicesProvided', 'citiesActive'].includes(item.path[0])).length > 0 && (
          <p className="text-xs pl-1" style={{ color: '#FF89AC' }}>Choose at least 1 city and 1 service</p>
        )}

        {/* GST */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: '#adaaaa' }}>GST Number</label>
          <input
            value={vendorDetails['gstNumber']}
            type="text"
            placeholder="GST number"
            className="w-full h-11 rounded-xl px-4 text-white text-sm outline-none transition-all placeholder:text-[#555]"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#FF89AC')}
            onBlur={e => (e.target.style.borderColor = 'rgba(73,72,71,0.4)')}
            onChange={e => setvendorDetails({ ...vendorDetails, gstNumber: e.target.value.trim() })}
            name="gstnumber"
          />
          {validationError?.length > 0 && validationError.filter(item => item.path[0] === 'gstNumber').length > 0 && (
            <p className="text-xs pl-1" style={{ color: '#FF89AC' }}>Provide a valid GST number</p>
          )}
        </div>

        {/* API error */}
        {isError && error?.status > 400 && (
          <p className="text-sm text-center" style={{ color: '#adaaaa' }}>
            {error?.response?.data?.message || 'Something went wrong'}. Redirecting to login…
          </p>
        )}

        {/* Submit */}
        <button
          disabled={isPending}
          onClick={submit}
          className="w-full py-3 rounded-xl font-semibold text-black mt-1 transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: GRADIENT, fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {isPending ? 'Creating account…' : 'Sign Up'}
        </button>
      </div>
    </>
  )
}

export default VendorSignup
