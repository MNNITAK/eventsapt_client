"use client"
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import Image from 'next/image';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
function PostImageSlider({ imageResponse }) {
    let imageSet = imageResponse?.images?.slice(0, 6) || imageResponse?.couplecover?.slice(0, 6)
    return (
        <Splide aria-label="" options={{
            pagination: true
        }}
            hasTrack={false}>
            <SplideTrack className="w-[100%] overflow-hidden h-[100%]">
                {
                    imageSet?.map((item, index) =>
                        <SplideSlide key={index} className='md:w-[100%] h-[74vw] md:h-[20.5vw] rounded-lg '>
                            {
                                index < 6 && <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  priority style={{ objectFit: 'cover' }} fill={true} src={item} alt='pics' />
                            }
                        </SplideSlide>
                    )
                }
            </SplideTrack>
            <div className="splide__arrows  md:flex justify-between w-[100%] px-0 absolute top-[50%] transform -translate-y-1/2">
                <button className="splide__arrow hidden md:block splide__arrow--prev bg-white aspect-square rounded-full border-2 p-2 w-[2vw] h-[2vw]"><FaArrowLeft className="w-[100%] h-[100%] text-xl" /></button>
                <button className="splide__arrow hidden md:block splide__arrow--next bg-white aspect-square rounded-full border-2 p-2 w-[2vw] h-[2vw]"><FaArrowRight className="w-[100%] h-[100%] text-xl" /></button>
            </div>
        </Splide>
    )
}
export { PostImageSlider }