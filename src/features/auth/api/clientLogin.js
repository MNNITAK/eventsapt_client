import { loginUser, loginVendor } from "@/api/authClient";
import { create } from "@/app/action";
import { tryCatchWrapper } from "@/lib/functionResolver";
import { useAuthStore } from "@/store/store";


const loginClient = async (params) => {
    // params = { data: {userid, password, isGoogleAuthenticated}, router, client }
    const { data, router } = params;
    // Default to 'user' so a missing usertype query param doesn't break login.
    const client = params.client === 'vendor' ? 'vendor' : 'user';
    try {
        // Use the appropriate login function based on client type
        const loginResponse = client === 'vendor'
            ? await loginVendor(data.userid, data.password)
            : await loginUser(data.userid, data.password);

        await create(loginResponse?.data);
        const { setUser } = useAuthStore.getState();
        setUser(loginResponse);
        // Both 200 (login successful) and 203 (mobile not verified) are successful
        // logins — redirect on either. Previously only 203 redirected, so verified
        // users (200) were left stranded on the login screen.
        if (loginResponse?.statusCode === 200 || loginResponse?.statusCode === 203) {
            if (client === 'vendor') {
                router.push(`/vendor-dashboard`);
            } else {
                router.push(`/home/${client}?tab=home`);
            }
        }
        return loginResponse;
    } catch (error) {
        console.log("Error during client login:", error);
        throw error;
    }
}

export { loginClient }

