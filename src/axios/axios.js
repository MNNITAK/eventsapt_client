import axios from "axios"

const axiosInstance=axios.create(
    {
        baseURL:"http://localhost:4000/api",
        timeout:6000,
        withCredentials:true
    }
)
const pseudoAxios=axios.create({
    baseURL:"http://localhost:4000/api",
        withCredentials:true
})
console.log("Backend API URL:", process.env.NEXT_PUBLIC_BACKEND_API);
export {axiosInstance,pseudoAxios}
