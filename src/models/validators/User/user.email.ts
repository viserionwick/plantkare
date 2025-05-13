// Essentials
import createHttpError from "http-errors";

// Models
import userModelSettings from "./settings";
import { UserSignupCredentials } from "@/models/User";

export const validate_user_email = (email: UserSignupCredentials["email"]) => {
    if (!email) {
        throw createHttpError(400, userModelSettings.email.requiredMessage, { headers: { from: "user_email", key: "required" } })
    }

    if (!userModelSettings.email.validator(email)) {
        throw createHttpError(400, userModelSettings.email.invalidMessage, { headers: { from: "user_email", key: "invalid" } });
    }
    if (email.length > userModelSettings.email.maxLength) {
        throw createHttpError(422, `Email can be maximum ${userModelSettings.email.maxLength} characters.`, { headers: { from: "user_email", key: "invalid" } });
    }
}