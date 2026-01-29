import { ChatSection } from "@/features/chat/components/chatsection"
import { SideWindow } from "@/features/chat/components/SideWindow"
async function page(props,searchParam) {
    const src=await searchParam
    const params=await props.params
    return(
        <main className="w-[100%] flex h-[100vh]">
            <SideWindow user={params.clientType}/>
            <ChatSection user={params.clientType}/>
        </main>
    )
}
export const metadata={
    title:"Chatpen",
    description:"chats"
}
export default page