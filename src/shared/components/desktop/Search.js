'use client'
import { RiSearch2Line } from "react-icons/ri";
import { SearchSectionScroll } from "./SearchSectionScroll";
import { searchSection } from "@/lib/constants";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
function Search() {
  const router=useRouter()
  const searchParam=useSearchParams()
  const [searchQuery,setQuery]=useState("");
  const [filterList,setFiterList]=useState([]);
  const [selectFilter,setFilter]=useState([]);
  const filterQueries = (query) =>{
    setQuery(query)
    if(query=="") {
      setFiterList(searchSection)
      return
    }
    let filteredQuery = searchSection
  .map((item) => ({
    title: item.title,
    value: item.value.filter((items) =>
      items.toLowerCase().includes(query.trim().toLowerCase())
    ),
  }))
  .filter((item) => item.value.length > 0); // Remove items with no matching values
  // const params = new URLSearchParams();
  //           filteredQuery.forEach(f => params.append("filter", f));
  //           router.push(`?${params.toString()}`, { scroll: false });
    if(filteredQuery.length==0) return
    setFiterList(filteredQuery)
  }
  const applyFilter=()=>{
    const params = new URLSearchParams();
    params.set("filter", selectFilter.join(","));; // Keep multiple filters
    params.set("tab", "home"); 
    router.push(`?${params.toString()}`, { scroll: false });
}
const clearFilter=()=>{
  setFilter([])
  const params = new URLSearchParams();
  params.set("filter", ""); 
  params.set("tab", "home"); 
  router.push(`?${params.toString()}`, { scroll: false });
}
  return (
    <div className="md:w-[90%] z-10 flex flex-col items-center bg-white w-[100%] md:relative absolute top-0 left-0 mx-auto  mt-3 h-[99%] md:h-[95%]">
        <p className="text-sm md:w-[100%] w-[90%] text-gray-500">Search</p>
        <div className="relative mx-auto md:w-[100%]  w-[90%]">
        <RiSearch2Line className="absolute text-gray-500 top-2 left-3 text-[25px]"/>    
        <input value={searchQuery} onChange={(e)=>{filterQueries(e.target.value.toLowerCase())}} placeholder="Search keyword" type="text" className="w-[100%] text-sm text-gray-600 px-4 py-2 pl-10 bg-gray-200 rounded-lg outline-none  border-2 border-gray-300"/></div>
        <div className="w-[100%] preferenceList h-[90%] overflow-y-auto">
            {
                searchQuery != "" ? filterList.length>0?
                filterList.map((item,pos)=>
                  <SearchSectionScroll clearFilter={clearFilter} selectedFilter={selectFilter} setFilter={setFilter} key={pos} title={item.title} vals={item.value}/>
              )
                :
                <div>Nothing found</div>
                : searchSection.map((item,pos)=>
                <SearchSectionScroll clearFilter={clearFilter} selectedFilter={selectFilter} setFilter={setFilter} key={pos} title={item.title} vals={item.value}/>
            )
            }
        </div>
        <div className={`absolute flex bottom-0 w-[100%] ${selectFilter.length==0 && "hidden"}`}>
          <button onClick={clearFilter} disabled={selectFilter.length==0} className={`w-[100%] ml-2 bg-white border-[#9A2143] border-2 text-[#9A2143] px-3 rounded-lg text-sm py-1 ${selectFilter.length==0 && "cursor-not-allowed"}`}>Clear All</button>
          <button disabled={selectFilter.length==0} onClick={applyFilter} className="w-[100%] ml-2 bg-[#9A2143] text-white px-3 rounded-lg text-sm py-1">Apply filter</button>
        </div>
    </div>
  )
}
export {Search}