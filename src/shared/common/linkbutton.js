import Link from 'next/link'
import React from 'react'
function Linkbutton({linkText="/authPage/user",linkTag,color="bg-[#C94C73]",client}) {
  return (
    <Link replace={linkTag == "/signup" && client=="user"}  href={{
      pathname:linkTag,    
      target:"_blank",
      query: client == "user" ?
      linkTag=="/signup"?{usertype:"user",compIndex:"1"}:{usertype:"user"}
      :{usertype:"vendor"}
    }} className={`w-[80%] text-center text-black py-2 rounded-[25px] mt-4 ${color}`}><>{linkText}</></Link>
  )
}
export default Linkbutton