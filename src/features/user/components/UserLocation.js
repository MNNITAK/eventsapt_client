import Image from 'next/image'
import React, { useState } from 'react'
import locationLogo from "../../../../public/location.svg"
import { useDebouncedCallback } from 'use-debounce'
import { fetchCity } from '@/lib/apis'
import fadeLoader from "../../../../public/fadeLoader.svg"

function Userlocation({ prev, next, userDetails, setDetails, queryParams, index }) {
  const famousCityList = ["Mumbai", "Delhi", "Jaipur", "Chennai", "Kolkata", "Hugli", "Telangana"]
  const availableServiceCities = ["Mirzapur", "Jabalpur", "Varanasi", "Hamirpur", "Jammu", "Singrauli", "Pune", "Haryana", "Jabalpur", "Shivpur"]
  const [fetchedCity, setCityArr] = useState([])
  const [loading, setLoader] = useState(false)
  const [locVal, setLocVal] = useState("")

  const debounceSearch = useDebouncedCallback(val => {
    if (!(famousCityList.includes(val) || availableServiceCities.includes(val))) {
      setLoader(true)
      fetchCity(val.toLowerCase())
        .then(res => { setCityArr(res.length > 0 ? res.filter(item => item.country === 'IN') : []); setLoader(false) })
        .catch(() => { setCityArr([]); setLoader(false) })
    }
  }, 1000)

  const searchCity = e => { setLocVal(e.target.value); debounceSearch(e.target.value) }

  const WindowHistoryStack = (pageIndex, replace = false) => {
    const params = new URLSearchParams(queryParams)
    params.set('compIndex', pageIndex)
    replace ? window.history.replaceState(null, '', `?${params.toString()}`) : window.history.pushState(null, '', `?${params.toString()}`)
    return true
  }

  const chipBase = 'px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all'

  return (
    <div className="w-[87vw] md:w-[26vw] flex flex-col gap-4">

      {/* Search input */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: '#adaaaa' }}>Search your city</label>
        <input
          type="text"
          name="locationCity"
          className="w-full h-12 rounded-xl px-4 text-white text-sm outline-none transition-all placeholder:text-[#555]"
          style={{ background: '#1a1919', border: '1px solid rgba(73,72,71,0.4)' }}
          onFocus={e => (e.target.style.borderColor = '#FF89AC')}
          onBlur={e => (e.target.style.borderColor = 'rgba(73,72,71,0.4)')}
          placeholder="Type to search…"
          value={locVal}
          onChange={searchCity}
        />
      </div>

      {/* Popular cities */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#adaaaa' }}>Popular cities</p>
        <div className="flex flex-wrap gap-2">
          {famousCityList.map((item, pos) => (
            <span
              key={pos}
              onClick={() => { setDetails(prev => ({ ...prev, locationCity: item })); setLocVal(item); setCityArr([]) }}
              className={chipBase}
              style={
                userDetails.locationCity === item
                  ? { background: 'linear-gradient(135deg, #FF89AC, #EA73FB)', color: '#000' }
                  : { background: 'rgba(255,137,172,0.08)', color: '#FF89AC', border: '1px solid rgba(255,137,172,0.2)' }
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Search results */}
      {locVal.length > 0 && fetchedCity.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2 flex items-center gap-2" style={{ color: '#adaaaa' }}>
            Results {loading && <Image className="ml-1" alt="loader" src={fadeLoader} width={16} height={16} />}
          </p>
          <div className="flex flex-wrap gap-2">
            {fetchedCity.map((item, pos) => (
              <span
                key={pos}
                onClick={() => { setDetails(prev => ({ ...prev, locationCity: item.name })); setLocVal(item.name) }}
                className={chipBase}
                style={
                  userDetails.locationCity === item.name
                    ? { background: 'linear-gradient(135deg, #FF89AC, #EA73FB)', color: '#000' }
                    : { background: 'rgba(255,137,172,0.08)', color: '#FF89AC', border: '1px solid rgba(255,137,172,0.2)' }
                }
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty illustration */}
      {locVal.length === 0 && (
        <div className="flex justify-center py-4 opacity-30">
          <Image alt="location" loading="lazy" width={140} height={140} src={locationLogo} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-2">
        <button
          onClick={() => { next(); WindowHistoryStack(index + 1, false) }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:border-white/30"
          style={{ borderColor: '#494847', color: '#adaaaa' }}
        >
          Skip
        </button>
        <button
          onClick={() => { userDetails.locationCity.length > 0 && locVal.length > 0 && WindowHistoryStack(index + 1) && next() }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FF89AC 0%, #EA73FB 100%)' }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export { Userlocation }
