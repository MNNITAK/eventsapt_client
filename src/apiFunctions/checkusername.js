import { checkUsernameAvailability } from "@/api/authClient";

export const checkusername = async(username) => {
    try {
        let resp = await checkUsernameAvailability(username);
        return { status: resp.statusCode, data: resp };
    } catch (error) {
        throw error;
    }  
}