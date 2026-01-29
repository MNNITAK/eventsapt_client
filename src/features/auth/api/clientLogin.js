import { axiosInstance } from "@/axios/axios";
import { create } from "@/app/action";
import { tryCatchWrapper } from "@/lib/functionResolver";
import { useAuthStore } from "@/store/store";
const loginClient = tryCatchWrapper(async ({ data, router, client }) => {
    let loginResponse = await axiosInstance.post(`/${client}/login`, data,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    await create(loginResponse?.data)
    const { setUser } = useAuthStore.getState();
    //console.log(loginResponse?.data);
    setUser(loginResponse?.data);
    if (loginResponse.status == 203) {
        router.push(`/home/${client}?tab=home`)
    }
    return loginResponse?.data
})
export { loginClient }