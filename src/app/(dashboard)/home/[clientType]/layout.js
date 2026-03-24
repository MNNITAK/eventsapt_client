import { BottomNavBar } from "@/shared/components/phone/BottomNavBar";
import { NavBar } from "@/shared/components/navbar/NavBar";
import { SideBarMain } from "@/shared/components/desktop/SideBarMain.js";
export default async function HomePageLayout({ children,params, searchParams }) {
  const navParams = await params
  const tbparams=await searchParams
  return <>
    <>
    <main className="w-[100%] flex min-h-screen bg-[#0e0e0e]">
    <div className='w-[20%] sm:hidden md:flex flex-col bg-gradient-to-b from-[#0e0e0e] to-[#131313] border-r border-[#1f1f1f] h-screen sticky top-0 overflow-y-auto'>
          <NavBar user={navParams.clientType} />
          <SideBarMain client={navParams.clientType}  />
     </div>
    <main className="w-[100%] md:w-[80%] bg-[#0e0e0e]">
      {children}
    </main>
    </main>
    <BottomNavBar />
    </>
  </>
}