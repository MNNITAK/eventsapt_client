import { useEffect, useState } from "react"
import { Modal } from "../../../shared/components/ui/modal";

import { useDebouncedCallback } from "use-debounce";
import { fetchCity } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import spinner from "../../../../public/spinner.svg"
import Image from "next/image";
function CitiesActive({open,setOpen,vendorDetails,setvendorDetails}) {
  const [citiesActive, setCitiesActive] = useState([]);
  const [city, setCity] = useState("");
  const {mutate,isError,isPending,data}=useMutation({mutationFn:fetchCity})
  const debounce=useDebouncedCallback(async(val)=>{
    if(val.length>3){
      mutate(val)
    }  
  },1000)
  useEffect(()=>{
    //console.log(data); 
  },[data])
  return (
    <>
      {
        open && (
          <Modal>
            <h1 className="w-[100%] flex justify-between">Select your active cities <span onClick={()=>{setOpen(false)}} className="border-2 border-[#C94C73]  text-[#C94C73] cursor-pointer px-2 rounded-md">x</span></h1>
          <div className="relative">
          <input
          value={city}
          onChange={(e)=>{setCity(e.target.value);debounce(e.target.value);}}
          className="md:w-[100%] w-[100%] mt-2 md:mt-1 outline-2 pl-2 sm:pl-3 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-[6vh] rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
          placeholder="Choose city"
          name="citiesActive"
          />
          {
            isPending &&<Image src={spinner} alt="loading" width={20} height={20} className="absolute top-[55%] right-0 transform -translate-x-1/2 -translate-y-1/2" />
          }
          </div>
          <div>
            <h1></h1>
            {
              city.length<3 ?<>
              <div className="flex flex-wrap gap-2 mt-4">
              {
                vendorDetails?.citiesActive?.map((item,pos)=>
                <span className="border-2 border-[#C94C73] py-1 text-[#C94C73] bg-[#FFECEC] text-sm font-medium  cursor-pointer px-2 rounded-md" key={pos}>{item}</span>)
              }
              </div>
              </>:<>
              <div className="flex flex-wrap gap-2 mt-4">
                {
                  data?.map((item,pos)=>
                  <span onClick={()=>setvendorDetails((prev)=>({...prev,citiesActive:[...prev.citiesActive,item.name]}))} className={`border-2 border-[#C94C73] py-1 ${vendorDetails?.citiesActive?.includes(item.name) ?"bg-[#C94C73] text-white":" text-[#C94C73] bg-[#FFECEC]"}  text-sm font-medium  cursor-pointer px-2 rounded-md`} key={pos}>{item.name}</span>)
                }
              </div>
              </>
            }
          </div>
          {
            vendorDetails?.citiesActive?.length>0 && <div className="w-[100%] flex justify-end">
              <button onClick={()=>{setOpen(false)}} className="bg-[#C94C73] px-4 py-1 text-white font-medium rounded-md mr-3">
                Save
              </button>
            </div>
          }
          <div className="w-[100%]">           
          </div>
          </Modal>
        )
      }
    </>
  )
}
export { CitiesActive }