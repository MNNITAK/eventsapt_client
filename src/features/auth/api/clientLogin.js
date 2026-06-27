import { loginUser, loginVendor } from "@/api/authClient";
import { create } from "@/app/action";
import { tryCatchWrapper } from "@/lib/functionResolver";
import { useAuthStore } from "@/store/store";


const attemptLogin = (client, data) =>
    client === 'vendor'
        ? loginVendor(data.userid, data.password)
        : loginUser(data.userid, data.password);

const loginClient = async (params) => {
    // params = { data: {userid, password, isGoogleAuthenticated}, router, client }
    const { data, router } = params;
    // The toggle/?usertype param only sets which collection we try FIRST.
    // Default to 'user' when unset.
    const preferred = params.client === 'vendor' ? 'vendor' : 'user';
    // Try the preferred account type first; if the account isn't in that
    // collection (404), fall back to the other type automatically. This means a
    // vendor who logs in without flipping the toggle (or vice-versa) still gets
    // in, instead of seeing "no user found".
    const order = preferred === 'vendor' ? ['vendor', 'user'] : ['user', 'vendor'];

    let lastError;
    for (const client of order) {
        try {
            const loginResponse = await attemptLogin(client, data);

            await create(loginResponse?.data);
            const { setUser } = useAuthStore.getState();
            setUser(loginResponse);
            // Both 200 (login successful) and 203 (mobile not verified) are
            // successful logins — redirect on either. Route by the collection
            // that actually authenticated, not the toggle.
            if (loginResponse?.statusCode === 200 || loginResponse?.statusCode === 203) {
                router.push(client === 'vendor' ? `/vendor-dashboard` : `/home/${client}?tab=home`);
            }
            return loginResponse;
        } catch (error) {
            lastError = error;
            // Only fall through to the other type when the account simply wasn't
            // found here (404). A wrong password (403) or any other error must
            // surface immediately — don't retry it against the other collection.
            const status = error?.response?.status;
            if (status !== 404) throw error;
        }
    }
    console.log("Error during client login:", lastError);
    throw lastError;
}

export { loginClient }

