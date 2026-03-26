import {Breadcrumb} from "@/features/user/dashboard/BreadCrumb.js";
import { Sidebar } from "@/features/user/dashboard/DashboardSidebar.js"
export const metadata = {
  title: 'User profile',
  description: 'Manage your wedding services',
}
export default async function RootLayout({ children }) {
  return (

    <div className="bg-[#F8F9FA] text-gray-900 antialiased">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar - Fixed to the left */}
        <Sidebar />

        {/* Main Content Area - Takes up remaining space and scrolls */}
        <main className="flex-1 overflow-y-auto">

          <div className="min-h-full w-full pt-4">
            <Breadcrumb items={{name:"User Profile",urlTags:["Home", "Dashboard", "Profile"]}} />
            {children}
          </div>
        </main>

      </div>
    </div>

  );
}