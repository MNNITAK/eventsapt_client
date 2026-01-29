'use client'
import React from "react";
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import { StoryCard } from "./StoryCard";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
// import '@splidejs/react-splide/css';
function StorySection() {
    return (
        <>
            <Splide
                className="relative flex items-center w-[100%] md:w-[50vw]"
                options={{
                    perPage: 6,
                    pagination:false,
                    breakpoints:{
                        640:{
                            perPage:4
                        },
                        1024:{
                            perPage:4
                        }
                    }
                }}
                hasTrack={false} aria-label="...">
                <SplideTrack className="w-[100%] overflow-visible md:w-[50vw] h-[18vh] md:h-[24vh] md:mt-4">
                    {
                        new Array(10).fill(0).map((_, pos) =>
                            <SplideSlide className="overflow-visible " key={pos}>
                                <StoryCard/>
                            </SplideSlide>
                        )
                    }
                </SplideTrack>
                <div className="splide__arrows  md:flex justify-between w-[100%] px-0 absolute top-[50%] transform -translate-y-1/2">
                    <button className="splide__arrow hidden md:block splide__arrow--prev bg-white aspect-square rounded-full border-2 p-2 w-[2vw] h-[2vw]"><FaArrowLeft className="w-[100%] h-[100%] text-xl"/></button>
                    <button className="splide__arrow hidden md:block splide__arrow--next bg-white aspect-square rounded-full border-2 p-2 w-[2vw] h-[2vw]"><FaArrowRight className="w-[100%] h-[100%] text-xl"/></button>
                </div>
            </Splide>
        </>
    );
}
export { StorySection }
