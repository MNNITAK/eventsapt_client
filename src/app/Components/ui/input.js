function Authinput({details,setDetails,placeholder,type,name,onChange}) {
  return (
    <>
    <input
    type={type}
    name={name}
    readOnly={details['isGoogleAuthenticated'] && type=="password"}
    className= "md:w-[25vw] w-[85vw] mt-3 md:mt-4 md:ml-1 outline-2 pl-4 sm:pl-7 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-[6vh] rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
    placeholder={details['isGoogleAuthenticated'] && type=="password" ? "No password required":placeholder}
    value={details[name]}
    onChange={(e)=>{setDetails((prev)=>({...prev,[e.target.name]:(e.target.value).trim()}))}}
    />
    </> 
  )
}
export { Authinput }