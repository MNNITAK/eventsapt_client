'use client'
import { FiBell } from "react-icons/fi";
import { NotifyBar } from "./notifyBar";
import { useMutation } from "@tanstack/react-query";
import { getSbscribers } from "@/features/chat/api/getSbscribers.js";
import { useEffect,useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";
const SideWindow = ({ user }) => {
    const searchParams = useSearchParams();
    const { mutate: getSubMutate, data: getSubData, isPending: getSubPending, isError: getSubError } = useMutation({
        mutationFn: getSbscribers
    })
    useEffect(() => {
        getSubMutate(user)
    }, [user])
    useEffect(() => {
        //console.log(getSubData);
    },[getSubData])
    return (
        <div className="md:w-[30%] md:bg-[#f9efef] w-[100%] flex flex-col items-center border-2 h-[100%]">
            <div className=" py-3 w-[90%] border-b-2 flex justify-between items-center">
                <IoChevronBackOutline/>
                <span className="text-xl font-semibold text-[#C94C73]">Chats</span>
                <span className="text-xl">
                    <FiBell />
                </span>
            </div>
            {
                getSubPending && <div className="md:w-[100%] w-[100%] py-4 flex items-center justify-center">
                    <LuLoaderCircle className="animate-spin text-[30px]" />
                </div>
            }
            {
                getSubData?.data.length==0 && <div className="md:w-[100%] w-[100%] py-4 flex items-center justify-center">Ooops ! you haven't messaged anyone yet</div>
            }
              {
                user == 'user' && getSubData  ? <div className="mt-2 w-[100%] overflow-auto">
                    {
                        getSubData?.data?.map((item, pos) =>
                            <NotifyBar senderId={item.senderId} recieverId={item.recieverId} num={item.numberofUnseenMess} orgName={item.roomName} lastMessage={item.subscriber?.lastMessage} uid={item.subscriber.uuid} user={user} key={pos} />
                        )
                    }
                </div> : <div className="mt-2 w-[100%] overflow-auto">
                    {
                        getSubData?.data?.map((item, pos) =>
                            <NotifyBar num={item.numberofUnseenMess} senderId={getSubData?.data?.vendorId} recieverId={item.userId} lastMessage={item?.lastMessage} orgName={item.userName} uid={item.uuid} user={user} key={pos} />
                        )
                    }
                </div>
            }
        </div>
    )
}
export { SideWindow }