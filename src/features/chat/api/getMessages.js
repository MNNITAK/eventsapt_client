import { axiosInstance } from "@/axios/axios";
import { getCookies } from "@/app/action";
const formatMessages = (messageData) => {
    const formattedDate = new Date(messageData.chatDate).toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
    const formattedPayloads = messageData.payloads.map((msg) => ({
        text: msg.text,
        sender: msg.sender,
        receiver: msg.receiver,
        sentAt: new Date(msg.createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).replace(/^0/, '') // Remove leading zero in hour (if present)
    }));
    return {
        chatDate: `${formattedDate}`, // Adding comma at the end as per requirement
        messages: formattedPayloads
    };
};
export function formatMessageData(pseudoPayload) {
    // Get current date and format it to a readable string
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    // Get formatted time (e.g., "5:46 PM")
    const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
    // Construct the message object
    return {
         // Example: "Friday, March 7, 2025"
        messages: 
            {
                text: pseudoPayload.text,
                sender: pseudoPayload.sender,
                receiver: pseudoPayload.receiver,
                sentAt: formattedTime  // Example: "5:46 PM"
            } 
    };
}
// Example usage
let pseudoPayload = {
    text: "Hi kundans",
    sender: "67c8a1b8166df9be2214ebcd",
    receiver: "67c8a1c9166df9be2214ece2"
};
//console.log(formatMessageData(pseudoPayload));
// Example Usage:
const messageData = {
    chatDate: "2025-03-05T18:30:00.000Z",
    payloads: [
        {
            text: "hi",
            sender: "67c8a1b8166df9be2214ebb9",
            receiver: "67c8a1c9166df9be2214ece5",
            _id: "67c9ac6e096746b208ecaa45",
            createdAt: "2025-03-06T14:08:46.810Z"
        }
    ]
};
//console.log(formatMessages(messageData));
export const getMessages=async(roomId)=>{
    try {
        let resp=await axiosInstance.post(`/cmn/getMessages`,{roomID:roomId},{
            headers:{
                'wedoraCredentials':await getCookies()
            }
        })
        let messData=resp?.data?.data.map((i)=>formatMessages(i))
        //console.log(messData);
        return messData;
    } catch (error) {
    }
}