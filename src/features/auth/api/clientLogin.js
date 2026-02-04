import { loginUser, loginVendor } from "@/api/authClient";
import { create } from "@/app/action";
import { tryCatchWrapper } from "@/lib/functionResolver";
import { useAuthStore } from "@/store/store";


const loginClient = async (params) => {
    // params = { data: {userid, password, isGoogleAuthenticated}, router, client }
    const { data, router, client } = params;
    try {
        // Use the appropriate login function based on client type
        let loginResponse;
        if (client === 'user') {
            loginResponse = await loginUser(data.userid, data.password);
        } else if (client === 'vendor') {
            loginResponse = await loginVendor(data.userid, data.password);
        }
        
        console.log("Login Response:", loginResponse);
        await create(loginResponse);
        const { setUser } = useAuthStore.getState();
        setUser(loginResponse);
        if (loginResponse.statusCode == 203) {
            router.push(`/home/${client}?tab=home`);
        }
        return loginResponse;
    } catch (error) {
        console.log("Error during client login:", error);
        throw error;
    }
}

export { loginClient }