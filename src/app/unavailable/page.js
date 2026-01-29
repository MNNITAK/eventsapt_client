'use client'
import Image from "next/image";
import errorPage from "../../../public/errorPage.svg"
import Logo from "@/shared/common/logo.js"
import useNetworkStatus from "../../lib/networkStatus";
 const metadata = {
  title: "Erros Occured",
  description:"Errors occured"
}
export default  function page() {
    const isOnline = useNetworkStatus();
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div><Logo/></div>
        {
            !isOnline ? <p className="mt-4 mb-2">Oops! you are offline</p> : <p className="mt-4 mb-2">Sorry we faced an error</p>
        }
        <Image src={errorPage} width={500} height={500} alt="error" />
      </div>
    );
}