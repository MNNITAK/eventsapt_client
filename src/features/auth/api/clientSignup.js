import { signupUser, signupVendor } from "@/api/authClient";
import { create } from "@/app/action";
import { useAuthStore } from "@/store/store";


const signupClient = async (params) => {
    // params = { data: {...signupFields}, router, client }
    // client = 'user' | 'vendor'
    const { data, router, client } = params;
    try {
        let signupResponse;

        if (client === 'user') {
            // Required: username, email, password, phoneNumber
            // Optional: usertype, weddingDate
            const payload = {
                username: data.username,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
                ...(data.usertype && { usertype: data.usertype }),
                ...(data.weddingDate && { weddingDate: data.weddingDate }),
            };
            signupResponse = await signupUser(payload);

        } else if (client === 'vendor') {
            // Required: businessName, businessEmail, businessPhone, password
            // Optional: city, address, gstNumber, citiesActive, servicesProvided
            const payload = {
                businessName: data.businessName,
                businessEmail: data.businessEmail,
                businessPhone: data.businessPhone,
                password: data.password,
                ...(data.city && { city: data.city }),
                ...(data.address && { address: data.address }),
                ...(data.gstNumber && { gstNumber: data.gstNumber }),
                ...(data.citiesActive && { citiesActive: data.citiesActive }),
                ...(data.servicesProvided && { servicesProvided: data.servicesProvided }),
            };
            signupResponse = await signupVendor(payload);
        }

        console.log("Signup Response:", signupResponse?.data);
        await create(signupResponse?.data);
        const { setUser } = useAuthStore.getState();
        setUser(signupResponse);

        if (signupResponse.statusCode == 203) {
            if (client === 'user') {
                router.push(`/home/${client}?tab=home`);
            } else {
                router.push(`/vendor-dashboard`);
            }
        }

        return signupResponse;
    } catch (error) {
        console.log("Error during client signup:", error);
        throw error;
    }
}

export { signupClient }
