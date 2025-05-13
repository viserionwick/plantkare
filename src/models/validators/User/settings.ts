// Essentials
import validator from "validator";

// Models
import { UserProfile } from "@/models/User";

const passwordRegex: RegExp = /^\S+$/;

const userModelSettings = {
  email: {
    validator: (value: string) => typeof value === "string" && validator.isEmail(value),
    invalidMessage: "Invalid email address.",
    requiredMessage: "User 'email' is required.",
    uniqueMessage: "Email is already registered.",
    notFoundMessage: "Email has not been found.",
    maxLength: 64,
  },
  password: {
    validator: (value: string) => typeof value === "string" && passwordRegex.test(value),
    invalidMessage: "Invalid password. The password must not contain any spaces.",
    requiredMessage: "'password' is required.",
    minLength: 8,
    maxLength: 64,
  },
};

export const userEmptyDefault: UserProfile = {
  email: "",
  emailVerified: false,
  timezone: "",
  createdAt: null,
  hour24Format: false
}

export default userModelSettings;