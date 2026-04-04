import { SideBar } from "@/features/event/event-wizard/components/SideBar";

export default async function Layout({ children,params,searchParams }) {
    const eventWizardURLData = await params
    
    
    return <div className="w-[100vw] flex items-center bg-[#F8F9FA] h-[100vh]">
        <div className="w-[25vw] h-[90vh] ml-10 "><SideBar/></div>
        <div className="w-[75vw] h-[100vh]">{children}</div>
    </div>;
}