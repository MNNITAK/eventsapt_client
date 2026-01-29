import Image from 'next/image'
import React, { use, useState } from 'react'
import locationLogo from "../../../../public/location.svg"
import { useDebouncedCallback } from 'use-debounce';
import { fetchCity } from '@/lib/apis';
import fadeLoader from "../../../../public/fadeLoader.svg"
function Userlocation({prev,next,userDetails,setDetails,queryParams,index}) {
    let famousCityList=["Mumbai","Delhi","Jaipur","Chennai","Kolkata","Hugli","Telangana"]
    let availableServiceCities=["Mirzapur","Jabalpur","Varanasi","Hamirpur","Jammu","Singrauli","Pune","Haryana","Jabalpur","Shivpur"]
    let [fetchedCity,setCityArr]=useState([])
    let [loading,setLoader]=useState(false)
    let [locVal,setLocVal]=useState("")
    let debounceSearch=useDebouncedCallback((val)=>{
      if(!(famousCityList.includes(val) || availableServiceCities.includes(val)))
     {
      setLoader(true)
      fetchCity(val.toLowerCase()).then((res)=>{
        //console.log(res);
        setCityArr(res.length>0?res.filter((item)=>item.country==="IN"):[])
        setLoader(false)
      }).catch((err)=>{
        setCityArr([])
        setLoader(false)
      })
     }
    },1000)
    let searchCity=async(e)=>{
      //setDetails((prev)=>({...prev,[e.target.name]:e.target.value}))
      //setCityArr(availableServiceCities.filter((item)=>item.toLowerCase().includes(e.target.value.toLowerCase())))
      setLocVal(e.target.value)
      debounceSearch(e.target.value)
    }
    const WindowHistoryStack=(pageIndex,replace=false)=>{
      const params = new URLSearchParams(queryParams)
      params.set('compIndex', pageIndex)
      if(replace){
        window.history.replaceState(null, '', `?${params.toString()}`)
      }else{
        window.history.pushState(null, '', `?${params.toString()}`)
      }
      return true
    }
    return (
    <>
    <div className='w-[100%] flex flex-col items-center md:px-0 h-[55vh]  md:h-[60vh]'>
    <input
    type="text"
    name="locationCity"
    className= "md:w-[25vw] w-[85vw] mt-4 md:ml-1 outline-2 pl-4 sm:pl-7 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-[6vh] rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
    placeholder="Search location"
    value={locVal}
    onChange={(e)=>{searchCity(e)}}/>
     <div className='w-[100%] relative'>  
    {/* <div className='w-[98%] ml-1 py-3 recommenerbody h-[30vh] md:min-h-[1vh] md:max-h-[20vh] overflow-auto absolute top-1 bg-[#ffffff] rounded-lg border-2 border-gray-500'>
      {
        availableServiceCities.map((item,pos)=>
        <div key={pos} className=' mt-1 mb-1 bg-[#FFECEC] rounded-lg text-[#C94C73] font-semibold text-[0.8rem] py-1 px-2'>{item}</div>
      )
      }
    </div> */}
     </div>
    <h2 className='text-[0.9rem] w-[97%] mt-2 font-semibold text-gray-500'>Our famous services are available in</h2>
    <div className='flex flex-wrap mt-2'>
        {
           famousCityList.map((item,pos)=>
        <span key={pos} onClick={()=>{setDetails((prev)=>({...prev,locationCity:item}));setLocVal(item),setCityArr([])}} className={`mx-1 mt-1 mb-1 rounded-lg  ${userDetails['locationCity']===item?"bg-[#C94C73] text-white":"text-[#C94C73] bg-[#FFECEC]"} font-semibold text-[0.8rem] py-1 px-2`}>{item}</span>) 
        }
    </div>
    {
      locVal.length>0 && fetchedCity.length>0 ? <>
      <h2 className='text-[0.9rem] w-[97%] flex mt-4 font-semibold text-gray-500'>Cities founded {loading?<><Image className='ml-2' alt='loader' src={fadeLoader} width={20} height={20}/></>:<></>}</h2>
    <div className='flex flex-wrap mt-2 w-[97%]'>
        {
           fetchedCity?.map((item,pos)=>
        <span key={pos} onClick={()=>{setDetails((prev)=>({...prev,locationCity:item?.name}));setLocVal(item?.name)}} className={`mx-1 mt-1 mb-1 rounded-lg  ${userDetails['locationCity']==item?.name?"bg-[#C94C73] text-white":"text-[#C94C73] bg-[#FFECEC] "} font-semibold text-[0.8rem] py-1 px-2`}>{item?.name}</span>) 
        }
    </div>
      </> : <div className='flex justify-center mt-10 md:mt-5'>
      <Image alt='location' loading='lazy' sizes='w-auto h-auto' width={200} height={250} src={locationLogo}/>
  </div>
    }
    </div>
     <div className="mt-1 md:mt-4 flex justify-between px-1">
        <button className="p-2 rounded-lg text-[#C94C73]  mr-1" onClick={()=>{next();WindowHistoryStack(index+1,false)}}>
          Skip
        </button>
        <button className="p-2 border-2 rounded-lg border-[#C94C73] ml-1" onClick={()=>{ userDetails['locationCity'].length>0 && locVal.length>0 && WindowHistoryStack(index+1) && next()  }}>
          Next
        </button>
      </div>
    </>
  )
}
export { Userlocation }