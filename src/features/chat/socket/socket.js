import { io } from "socket.io-client";
const SERVER_URL = `${process.env.NEXT_PUBLIC_SOCKET_API}/chatpen`;
export const socket = io(SERVER_URL, {
    transports: ["websocket"], 
    autoConnect: false,  // Prevent auto -connecting before useEffect
    withCredentials: true,
});