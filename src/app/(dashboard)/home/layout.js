// HomeLayout.js
import { Suspense } from "react";
import { LoadingPage } from "../../Components/ui/loadingPage";
import Logo from "@/shared/common/logo"
import checkAuth from "./checkAuth";
import Link from "next/link";
export  async function AuthenticatedContent({ children }) {
    let res=await checkAuth()// Perform your authentication logic here
    return <>{
        res===1?children:<>
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <Logo/>
            <h1>Session expired</h1>
            <Link className="mt-2 rounded-lg px-3 py-2 border-2 border-[#C94C73] text-[#C94C73]" href={"/"}>Login</Link>
        </div>
        </>
    }</>;
  }
export default async function Layout({ children,params }) {
  const data = await params
  //console.log(data);
  
  return (
    <Suspense fallback={<LoadingPage />}>
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </Suspense>
  );
}