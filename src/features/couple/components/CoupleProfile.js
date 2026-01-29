'use client'
import wedImage from "@/../public/wed.jpg"
import { useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { fetchCoupleDetails } from "@/features/couple/api/fetchCoupleProfile"
import { useEffect } from "react"
import Image from "next/image"
const CoupleProfile=()=>{
    const searchParam=useSearchParams()
    const {mutate,data,isPending,isError,error,isSuccess} = useMutation({
        mutationFn:fetchCoupleDetails
    })
    useEffect(()=>{
        mutate(searchParam.get('coupleName'))
    },[])
    return(
        <>
        <main className="md:w-[80vw] w-[100%] h-[100vh] overflow-x-hidden overflow-y-auto">
            <div className="w-[80%] mx-auto relative h-[25vh] mt-10" style={{backgroundImage:`url(/wed.jpg)`}}>
                <h1 className="text-white absolute bottom-2 left-4 text-[30px]">{searchParam.get('coupleName')}</h1>
                <div className="absolute text-white  text-right bottom-2 right-3">
                    <p className="text-[12px]">Organized by</p>
                    <h1>{data?.name}</h1>
                </div>
            </div>
            <p className="my-2 text-gray-300 w-[80%] mx-auto font-semibold">Some memories</p>
            <div className="md:w-[80%] w-[100%] mb-2 mx-auto grid grid-cols-3 gap-1 mt-1">
                {
                    data?.couplecover?.map((item,pos)=>
                    <div  key={pos} className="h-[30vh] relative"><Image style={{objectFit:'cover'}}  alt="pics" fill={true} src={`${item}`}/></div>
                    
                    )
                }
            </div>
        </main>
        </>
    )
}
export {CoupleProfile}