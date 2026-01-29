import axios from "axios"
const axiosInstance=axios.create(
    {
        baseURL:process.env.backend_api,
        timeout:6000,
        withCredentials:true
    }
)
const pseudoAxios=axios.create({
    baseURL:process.env.backend_api,
        withCredentials:true
})
export {axiosInstance,pseudoAxios}