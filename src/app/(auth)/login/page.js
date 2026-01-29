export const metadata={
    title:"Login"
}
import Logo from "@/shared/common/logo"
import { Suspense } from "react"
import { UserLogin } from "../../../features/auth/components/Login"
function page() {
  return (
    <div className="w-screen flex flex-col items-center">
    <header className="md:mt-8 mt-5">
        <Logo />
    </header>
    <main className="md:w-[50%] md:mt-[14vh] mt-[12vh]  w-[95%] flex flex-col items-center">
        <h1 className="text-3xl text-[#802e47] font-semibold">Welcome Back</h1>
        <Suspense fallback={<div>Loading...</div>}>
           <UserLogin />
        </Suspense>
    </main>
    </div>
  )
}
export default page