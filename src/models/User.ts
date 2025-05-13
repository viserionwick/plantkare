// Models
import { Timestamp } from "firebase/firestore";
import { Timestamp as TimestampAdmin } from "firebase-admin/firestore";

export type UserSession = "auth" | null;

export interface UserDoc {
    id?: string,
    email?: string,
    createdAt: Timestamp | TimestampAdmin | null,
    timezone: string,
    hour24Format: boolean,
};

export interface UserProfile extends UserDoc {
    emailVerified: boolean,
};

// Login
export interface UserLoginCredentials extends Pick<UserProfile,
    "email"
> {
    password: string,
};

export type UserLoginCredentialsErrors = {
    [K in keyof UserLoginCredentials]: string;
};

// Signup
export interface UserSignupCredentials extends UserLoginCredentials {
    passwordAgain?: string
}

export type UserSignupCredentialsErrors = {
    [K in keyof UserSignupCredentials]: string;
};