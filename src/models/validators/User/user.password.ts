// Essentials
import createHttpError from "http-errors";

// Models
import userModelSettings from "./settings";
import { UserSignupCredentials } from "@/models/User";

export const validate_user_password = (password: UserSignupCredentials["password"]) => {
    if (!password) {
        throw createHttpError(400, userModelSettings.password.requiredMessage, { headers: { from: "user_password", key: "required" } })
    }

    if (!(
        password.length >= userModelSettings.password.minLength
        &&
        password.length <= userModelSettings.password.maxLength
    )) {
        throw createHttpError(422, `Password must be minimum ${userModelSettings.password.minLength} and maximum ${userModelSettings.password.maxLength} characters.`, { headers: { from: "user_password", key: "invalid" } });
    }

    if (!userModelSettings.password.validator(password)) {
        throw createHttpError(400, userModelSettings.password.invalidMessage, { headers: { from: "user_password", key: "invalid" } });
    }
}