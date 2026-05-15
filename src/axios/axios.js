import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000/api"

const axiosInstance=axios.create(
    {
        baseURL: BASE_URL,
        timeout:20000,
        withCredentials:true
    }
)
const pseudoAxios=axios.create({
    baseURL: BASE_URL,
    withCredentials:true
})

export {axiosInstance,pseudoAxios}