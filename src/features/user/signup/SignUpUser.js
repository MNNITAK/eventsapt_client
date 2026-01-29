'use client'
import React, { useEffect, useRef,useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Userdetailspage1 } from "@/features/user/components/UserDetails.js";
import { Userlocation } from "@/features/user/components/UserLocation.js";
import { Userpreference } from "@/features/user/components/UserPreference.js";
import { SlickNav } from "@/app/Components/userComponent/SlickNav.js";
function UserSignUp({queryParams,index}) {
  const [userDetails, setDetails] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "91",
    usertype: "user",
    isGoogleAuthenticated: false,
    locationCity:"",
    userPreference:[]
})
const inputFieldHandle = (e) => {
  setDetails(prev=>({...prev,[e.target.name]:e.target.value}))
}
let [error,setError]=useState([]);
const [pageTracker,updateTracker]=useState({
  currentIndex:1,
  propertyList:[
    {
      index:1,
      property:{
        skippable:false,
        validated:false,
      }
    },
    {
      index:2,
      property:{
        skippable:false,
        validated:false,
      }
    },
    {
      index:3,
      property:{
        skippable:true,
        validated:false,
      }
    }
  ]
})
  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite:false,
    nextArrow:<SlickNav /> ,//only empty string
    prevArrow:<SlickNav/>
  };
  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.current.slickNext();
  };
  const previous = () => {
    sliderRef.current.slickPrev();
  };
  const handlePopState = (event) => {
    if(sliderRef.current){
      let querySearchIndex=window?.location?.search?.split("compIndex=")[1].split("&")[0]
    //console.log("Current rout is ",window?.location?.pathname);
    //console.log(querySearchIndex);
   
    sliderRef.current.slickGoTo(querySearchIndex-1);
    }
    else{
      //console.log("no sliderref");
    }
  };
  useEffect(() => {
    // Add the popstate listener when the component mount
    window.addEventListener("popstate", handlePopState);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <>
      <Slider
        ref={sliderRef}
        className=" flex flex-col items-center md:w-[26vw] w-[87vw] md:h-[70vh] md:mt-[10vh] mt-[10vh]"  swipe={false} {...settings}>
       <Userdetailspage1
       userDetails={userDetails}
       setDetails={setDetails}
       inputFieldHandle={inputFieldHandle}
       pageIndex={1}
       pageTracker={pageTracker}
       updateTracker={updateTracker}
       prev={previous}
       next={next}
       error={error}
       setError={setError}
       index={1}
       queryParams={queryParams}
       />
       <Userlocation
       userDetails={userDetails}
       setDetails={setDetails}
       prev={previous}
       next={next}
       error={error}
       setError={setError}
       index={2}
       queryParams={queryParams}
       />
       <Userpreference
       userDetails={userDetails}
       setDetails={setDetails}
       prev={previous}
       next={next}
       index={3}
       queryParams={queryParams}
       />
      </Slider>
    </>
  )
}
export default UserSignUp