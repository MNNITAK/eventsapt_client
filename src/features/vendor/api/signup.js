import { create } from "@/app/action";
import { signupVendor } from "@/api/authClient";
const signup=async({cred,router})=>{
    try {
        let response = await signupVendor(cred);
        // API body is { statusCode, data: { ...profile, refreshToken, accessToken } }.
        // Persist the tokens from response.data, not the whole body.
        await create(response?.data);
        router.push("/vendor-dashboard");
        return response;
    } catch (error) {
        // Only redirect to login when the vendor already exists (409). For any
        // other error, surface it so the user can fix their details and retry.
        if (error?.response?.status === 409) {
            router.push("/login?usertype=vendor");
        }
        throw error;
    }
}
export {signup}

