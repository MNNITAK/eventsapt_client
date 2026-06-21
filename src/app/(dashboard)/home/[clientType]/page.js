export const metadata = {
  title: "Home",
}
import { NavBar } from "@/shared/components/navbar/NavBar"
import { Posts } from "@/features/feed/components/Posts"
import { Search } from "@/shared/components/desktop/Search.js"
import { VendorPublicProfile } from "@/features/vendor/components/VendorPublicProfile"
import { CoupleProfile } from "@/features/couple/components/CoupleProfile"
import { HomeRightPanel } from "@/features/feed/components/HomeRightPanel"
import { ReelsViewer } from "@/features/feed/components/ReelsViewer"

async function page({ params, searchParams }) {
  const clientParam = await params;
  const searchprm = await searchParams
  const tab = searchprm?.tab || 'home'  // default to the home feed when no tab is set

  return (
    <>
      <div id="mainPost" className='flex md:flex-row w-full h-[85vh] md:h-[100vh] overflow-y-auto flex-col bg-[#0e0e0e]'>

        {/* Mobile top bar */}
        <div className="md:hidden w-full">
          <NavBar user={clientParam.clientType} />
        </div>

        {/* Vendor / Couple profile — full width */}
        {tab === 'profile' && (
          <div className="w-full h-full overflow-y-auto">
            <VendorPublicProfile />
          </div>
        )}

        {tab === 'coupleProfile' && (
          <div className="w-full flex justify-center items-center">
            <CoupleProfile />
          </div>
        )}

        {/* Reels — full-screen vertical viewer */}
        {tab === 'reels' && (
          <div className="w-full h-[calc(85vh-3.5rem)] md:h-screen">
            <ReelsViewer />
          </div>
        )}

        {/* Home / Search tabs — feed + optional right panel */}
        {(tab === 'home' || tab === 'search') && (
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* Centre — stories + feed */}
            <div className='flex flex-col flex-1 min-w-0 items-center md:items-start h-full overflow-y-auto'>
              <Posts id_={"mainPost"} />
            </div>

            {/* Right — search panel OR trending/vendors panel */}
            {tab === 'search'
              ? <div className="w-[300px] xl:w-[320px] flex-shrink-0 h-full overflow-y-auto border-l border-[#1a1a1a]"><Search /></div>
              : <HomeRightPanel />
            }
          </div>
        )}
      </div>
    </>
  )
}

export default page
