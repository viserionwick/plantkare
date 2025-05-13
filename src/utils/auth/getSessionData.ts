// Essentials
import { getCookie } from "../getCookie";

export const blockClient = true;

const getSessionData = async (): Promise<string | null> => {
    const sessionCookie = await getCookie("userSession");    
    if (!sessionCookie) return blockClient ? null : null /* "anonymous" */;
    return sessionCookie;
}

export default getSessionData;