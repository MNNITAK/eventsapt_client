import { BottomNavBar } from "@/shared/components/phone/BottomNavBar";
import { NavBar } from "@/shared/components/navbar/NavBar";
import { SideBarMain } from "@/shared/components/desktop/SideBarMain.js";
export default async function HomePageLayout({ children,params, searchParams }) {
  const navParams = await params
  const tbparams=await searchParams
  return <>
    <>
    <main className="w-[100%] flex">
    <div className='w-[20%] hidden md:block border-r-2 border-gray-300 h-screen'>
          <NavBar user={navParams.clientType} />
          <SideBarMain client={navParams.clientType}  />
     </div>
    <main className="w-[100%] md:w-[80%] ">
      {children}
    </main>
    </main>
    <BottomNavBar />
    </>
  </>
}