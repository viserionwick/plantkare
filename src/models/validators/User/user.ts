// Essentials
import { validate_user_email } from "./user.email";
import { validate_user_password } from "./user.password";

// Models
import { UserSignupCredentials } from "@/models/User";

export const validate_user = (user: UserSignupCredentials) => {
    try {
        validate_user_email(user.email);
        validate_user_password(user.password);
    } catch (error) {
        throw error;
    }
}