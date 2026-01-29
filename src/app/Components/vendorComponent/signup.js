import { VendorInput } from "../commonComponent/vendorInput"
import { vendorDetails_p1 } from "@/lib/constants"
import {CitiesActive} from "@/app/Components/vendorComponent/CitiesActive"
import { ServicesModal } from "./services"
import { useState } from "react"
import { vendorSchema } from "@/schema/vendorSchema"
import { useMutation } from "@tanstack/react-query"
import { signup } from "@/features/vendor/api/signup"
import { useRouter } from "next/navigation"
function VendorSignup({vendorDetails,setvendorDetails}) {
  const router=useRouter()
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [gst,setGST]=useState("")
  const [validationError,setVaidationErr]=useState([])
  const {mutate,data,error,isPending,isError}=useMutation({
    mutationFn:signup
  })
  const submit=()=>{
    let validationResponse=vendorSchema.safeParse(vendorDetails)
    setVaidationErr(validationResponse?.error?.errors)
    if(!(validationResponse?.error?.errors)){
      mutate({
        cred:vendorDetails,
        router:router
    })
    }
  }
  const checkErr=(name)=>{
    let resp= validationError.filter((item)=>(item.path)[0]==name)
    if(resp?.length>0){
      return [true,resp[0]?.message]
    }
    else{
      return [false,""]
    }
  }
  return (
    <>
    <CitiesActive open={citiesOpen} setOpen={setCitiesOpen} vendorDetails={vendorDetails} setvendorDetails={setvendorDetails}/>
    <ServicesModal open={servicesOpen} setOpen={setServicesOpen} vendorDetails={vendorDetails} setvendorDetails={setvendorDetails}/>
    <div className="md:w-[25vw] mb-5 w-[85vw] mt-10 flex flex-col items-center"> 
        {
          vendorDetails_p1.map((item,pos)=>
          <main key={pos}>
          <div key={pos} className="flex flex-col mt-3 mb-0 justify-start w-[100%]">
          <h1 className="w-[100%] ml-2 text-sm text-gray-500 font-normal">{item.title}</h1>
          <VendorInput details={vendorDetails} setDetails={setvendorDetails} placeholder={item.placeholder} type={item.type} name={item.name} onChange={setvendorDetails}/>
          {
           <h1 className="text-red-400 text-[12px] ml-2">{
            validationError?.length>0 ? <>
            {
              checkErr(item.name)[0] &&  checkErr(item.name)[1]
            }
            </>:<></>
           }</h1>
          }
          </div>
          </main>
          )
        }
        <div className="w-[100%] flex flex-col md:flex-row mt-2">
          <div className="md:w-[30%]">
            <span className="ml-2 text-sm text-gray-500 font-normal">City</span>
            <input type="text" onChange={(e)=>{setvendorDetails({...vendorDetails,city:(e.target.value).trim()})}} placeholder="City" className="w-[100%] outline-2 pl-4 md:pl-2 sm:pl-3 border-[1px] focus:outline-[#C94C73] pr-1 relative dark:bg-zinc-800 py-2 md:py-1 rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200" />
          </div>
          <div className="md:w-[70%] mt-3 md:mt-0 ml-1">
            <span className="ml-2 text-sm text-gray-500 font-normal">Address</span>
            <textarea onChange={(e)=>{setvendorDetails({...vendorDetails,address:(e.target.value).trim()})}} placeholder="Complete address" className="w-[100%] max-h-[12vh] outline-2 pl-2 md:pl-3 border-[1px] focus:outline-[#C94C73] pr-5 relative dark:bg-zinc-800 h-[10vh] py-2 rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200" name="address"></textarea>
          </div>
        </div>
         {
          validationError?.length>0 && (validationError?.filter((item)=>(item.path)[0]=="city" || (item.path)[0]=="address")).length>0 &&  <h1 className="text-red-400 text-[12px] ml-2 mb-1 w-[100%]">Complete your address</h1>
         }
        <div className="grid grid-cols-2 w-[100%] gap-1">
         <button className="border-2 col-span-1 border-[#C94C73] p-1 rounded-md text-[#C94C73]" onClick={()=>{setCitiesOpen(!citiesOpen)}}>Select Cities</button>
         <button className="border-2 col-span-1 border-[#C94C73] p-1 rounded-md text-[#C94C73]" onClick={()=>{setServicesOpen(!servicesOpen)}}>Select services</button>
        </div>
        {
          validationError?.length>0 && (validationError?.filter((item)=>(item.path)[0]=="servicesProvided" || (item.path)[0]=="citiesActive")).length>0 &&  <h1 className="text-red-400 text-[12px] ml-2 mb-1 w-[100%]">Choose minimum 1 from above</h1>
         }
        <div className="relative w-[100%] mt-3">
        <h1 className="w-[100%] ml-2 text-sm text-gray-500 font-normal">GST</h1>
                  <input
                  value={vendorDetails['gstNumber']}
                  type="text"
                  onChange={(e)=>{setvendorDetails({...vendorDetails,gstNumber:(e.target.value).trim()})
                  }}
                  className="md:w-[100%] w-[100%] mt-0 md:mt-0 outline-2 pl-2 sm:pl-3 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-[6vh] rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
                  placeholder="GST"
                  name="gstnumber"           
                 />
                  {/* {
                    isPending &&<Image src={spinner} alt="loading" width={20} height={20} className="absolute top-[55%] right-0 transform -translate-x-1/2 -translate-y-1/2" />
                  } */}
                  </div>
                  {
          validationError?.length>0 && (validationError?.filter((item)=>(item.path)[0]=="gstNumber")).length>0 &&  <h1 className="text-red-400 text-[12px] ml-2 mb-1 w-[100%]">Provide gst number</h1>
         }
         {
          isError && error?.status>400 && <p className="text-gray-500 font-medium w-[100%] mt-1">{
            (`${error?.response?.data?.message}. Redirecting to login`) || ("Something went wrong")
            }</p>
         }
        <button disabled={isPending} className="w-[100%] bg-[#C94C73] font-semibold text-white py-3 mt-4 rounded-md" onClick={submit
        }>
          {
            isPending ?"Signing you in":"Sign up"
          }
        </button>
    </div>
    </>
  )
}
export default VendorSignup