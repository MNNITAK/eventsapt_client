'use client'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
function SearchSectionScroll({ vals, title, selectedFilter, setFilter,clearFilter }) {
    const router=useRouter();
    const setFilterHandler = (val) => {
        if(selectedFilter.includes(val)) {
            const f1=selectedFilter.filter((item) => item != val)
            if(f1.length==0){
                clearFilter()
            }
            setFilter(f1)
        }else{
            setFilter([...selectedFilter,val])
        }
    }
    return (
        <div className="w-[100%] mt-2">
            <p className='text-sm text-gray-500 mt-2'>{title}</p>
            <Splide
                options={{
                    perPage: 3,
                    pagination: false
                }}
                className="w-[100%] flex justify-center h-[18vh]" hasTrack={false}>
                <SplideTrack className="w-[92%] overflow-hidden h-[100%]  rounded-xl">
                    {
                        vals.map((item, pos) =>
                            <SplideSlide key={pos} className="flex justify-center">
                            <div onClick={() => setFilterHandler(item)} className={`w-[95%] overflow-hidden cursor-pointer h-[18vh] rounded-xl  border-2 ${selectedFilter.includes(item) ? "border-[#9A2143] rounded-xl bg-[#FFECEC] " : "border-gray-200 bg-white"}`}>
                                    <div className='w-[100%] h-[65%] bg-gray-200'></div>
                                    <div className={`w-[100%] h-[35%] text-sm  mt-1 ml-1 text-wrap ${selectedFilter.includes(item) ? "text-[#9A2143]" : "text-gray-500"}`}>{item}</div>
                                </div>
                            </SplideSlide>
                        )
                    }
                </SplideTrack>
                {
                    <div className={`splide__arrows ${vals.length <= 3 ? " invisible" : " visible"}  flex justify-between w-[100%] px-0 absolute top-[50%] transform -translate-y-1/2`}>
                        <button className="splide__arrow  md:block splide__arrow--prev bg-white aspect-square rounded-full border-2 md:p-2  md:w-[2vw] w-[3.5vw] md:h-[2vw] h-[3.5vw]"><FaArrowLeft className="w-[100%] h-[100%] md:text-xl text-[20px]" /></button>
                        <button className="splide__arrow   md:block splide__arrow--next bg-white aspect-square rounded-full border-2 md:p-2  md:w-[2vw] w-[3.5vw] md:h-[2vw] h-[3.5vw]"><FaArrowRight className="w-[100%] h-[100%] md:text-xl text-[20px]" /></button>
                    </div>
                }
            </Splide>
            <div >
            </div>
        </div>
    )
}
export { SearchSectionScroll }