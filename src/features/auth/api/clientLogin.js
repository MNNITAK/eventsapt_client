import { axiosInstance } from "@/axios/axios";
import { create } from "@/app/action";
import { tryCatchWrapper } from "@/lib/functionResolver";
import { useAuthStore } from "@/store/store";


const loginClient = async (params) => {
    // params = { data: {userid, password, isGoogleAuthenticated}, router, client }
    const { data, router, client } = params;
    const dynamicPayload = {
        userid: params?.data?.userid,
        password: params?.data?.password
    };
    try {
        let loginResponse = await axiosInstance.post(`/auth/${client}/login`, dynamicPayload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Login Response:", loginResponse);
        await create(loginResponse?.data);
        const { setUser } = useAuthStore.getState();
        setUser(loginResponse?.data);
        if (loginResponse.status == 203) {
            router.push(`/home/${client}?tab=home`);
        }
        return loginResponse?.data;
    } catch (error) {
        console.log("Error during client login:", error);
        throw error;
    }
}

export { loginClient }