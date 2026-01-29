import { axiosInstance } from "@/axios/axios.js";
import { getCookies } from "@/app/action.js";
const getSbscribers = async (user) => {
    const refreshToken = await getCookies();
    try {
        const response = await axiosInstance.get(`/${user}/getSubscribers`, {
            headers: {
                "wedoraCredentials": refreshToken,
            },
        });
        //console.log(response.data);
        return response.data;
    } catch (error) {
        //console.log(error);
    }
};
export  {getSbscribers}