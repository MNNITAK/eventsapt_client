import { Modal } from "../../../shared/components/ui/modal";
import { useState } from "react";
import { userPreferences } from "@/lib/constants";
const ServicesModal = ({ open, setOpen, vendorDetails, setvendorDetails }) => {
    const [services, setServices] = useState("");
    const [servicesList, setServicesList] = useState([]);
    const filterServices=(val)=>{
        if(val!==""){
            let filteredList=userPreferences.filter((item)=>item?.value.filter((item2)=>item2.toLowerCase().includes(val.toLowerCase())).length>0);
            setServicesList(filteredList);
        }
    }
    return (
        <>
            {
                open && <Modal>
                    <h1 className="w-[100%] flex justify-between">Select your services<span onClick={() => { setOpen(false) }} className="border-2 border-[#C94C73]  text-[#C94C73] cursor-pointer px-2 rounded-md">x</span></h1>
                    <div className="relative">
                        <input
                            value={services}
                            onChange={(e) => {setServices(e.target.value);filterServices(e.target.value) }}
                            className="md:w-[100%] w-[100%] mt-2 md:mt-1 outline-2 pl-2 sm:pl-3 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-[6vh] rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
                            placeholder="Choose your services"
                            name="servicesOffered"
                        />
                        {/* {
                            isPending && <Image src={spinner} alt="loading" width={20} height={20} className="absolute top-[55%] right-0 transform -translate-x-1/2 -translate-y-1/2" />

                        } */}
                    </div>
                    <div>
            {
              services==""?<>
              <div className="flex flex-wrap gap-2 preferenceList mt-4 md:h-[40vh] overflow-y-auto h-[40vh]">
                {
                    userPreferences?.map((item,pos)=>
                    <main key={pos} className="w-[100%]">
                        <h1 className="w-[100%] text-sm text-gray-600 font-normal">{item.title}</h1>
                        <div className="w-[100%] flex flex-wrap gap-2 ">
                            {
                                item?.value?.map((val,pos)=>
                                    <span onClick={()=>{setvendorDetails({...vendorDetails,servicesProvided:[...vendorDetails?.servicesProvided,val]})}} className={`border-2 border-[#C94C73] py-1 ${vendorDetails?.servicesProvided?.includes(val) ?"bg-[#C94C73] text-white":" text-[#C94C73] bg-[#FFECEC]"}  text-sm font-medium  cursor-pointer px-2 rounded-md`} key={pos}>{val}</span>
                                )
                            }
                        </div>
                    </main>
                    )
                }
              </div>
              </>:<>  
              <div className="flex flex-wrap gap-2 w-[95%] mt-4 md:h-[40vh] overflow-y-auto h-[40vh]">
              {
                    servicesList?.map((item,pos)=>
                    <main key={pos} className="w-[100%]">
                        <h1 className="w-[100%] text-sm text-gray-600 font-normal">{item.title}</h1>
                        <div className="w-[100%] flex flex-wrap gap-2 ">
                            {
                                item?.value?.map((val,pos)=>
                                    <span onClick={()=>{setvendorDetails({...vendorDetails,servicesProvided:[...vendorDetails?.servicesProvided,val]})}} className={`border-2 border-[#C94C73] py-1 ${vendorDetails?.servicesProvided?.includes(val) ?"bg-[#C94C73] text-white":" text-[#C94C73] bg-[#FFECEC]"}  text-sm font-medium  cursor-pointer px-2 rounded-md`} key={pos}>{val}</span>
                                )
                            }
                        </div>
                    </main>
                    )
                }
              </div>
              </>
            }
          </div>
          {
            vendorDetails?.servicesProvided?.length>0 && <div className="w-[100%] flex justify-end">
              <button onClick={()=>{setOpen(false)}} className="bg-[#C94C73] px-4 py-1 text-white font-medium rounded-md mr-3">
                Save
              </button>
            </div>
          }
        </Modal>
            }
        </>
    )
}
export { ServicesModal }