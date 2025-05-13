"use client"

// Essentials
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import validator from "validator";

// Database
import { dbAuth } from "@/utils/dbConnect";
import {
    setPersistence, browserLocalPersistence,
    signInWithEmailAndPassword,
    signOut as dbSignOut,
    deleteUser as dbDeleteUser,
    createUserWithEmailAndPassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    onAuthStateChanged,
    User as dbUser,
    sendPasswordResetEmail,
} from "firebase/auth";

// Contexts
import { useOverlayContext } from "./Overlay";

// Utils
import newError from "@/utils/error/newError";
import errorReturner from "@/utils/error/errorReturner";

// Validators
import { validate_user_email } from "@/models/validators/User/user.email";
import { validate_user_password } from "@/models/validators/User/user.password";

// Models
import { UserProfile, UserLoginCredentials, UserSignupCredentials, UserDoc, UserSession } from "@/models/User";

// Types
export type LoginUser = ({ }: UserLoginCredentials | object, fromRegister?: boolean) => Promise<any>;
export type LogoutUser = (redirect?: string) => Promise<void>;
export type SignupUser = ({ }: UserSignupCredentials, isAnonymous?: boolean) => Promise<any>;
export type DeleteUser = (password: UserLoginCredentials["password"] | null, isAnonymous?: boolean, redirect?: boolean) => Promise<void>;
export type ForgotPassword = (email: UserLoginCredentials["email"]) => Promise<void>;

export type AuthContextType = {
    currentUser: dbUser | null;
    userProfile: UserProfile | null;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    loginUser: LoginUser;
    logoutUser: LogoutUser;
    signupUser: SignupUser;
    deleteUser: DeleteUser;
    loading: boolean;
    forgotPassword: ForgotPassword;
    isForgotPasswordEmailSent: boolean;
    setIsForgotPasswordEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
    deletingUser: boolean;
    populateProfileWithData: (idToken: string) => Promise<boolean>;
    getIdToken: () => Promise<string | undefined>;
};

const AuthContext = createContext({} as AuthContextType);
export const useAuthContext = () => useContext(AuthContext);
export const AuthProvider = ({ children, userSession }: { children: React.ReactNode, userSession: UserSession }) => {
    // Other Contexts
    const {
        setOverlay,
    } = useOverlayContext();

    // States
    const [currentUser, setCurrentUser] = useState<dbUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deletingUser, setDeletingUser] = useState<boolean>(false);
    const [isForgotPasswordEmailSent, setIsForgotPasswordEmailSent] = useState<boolean>(false);

    // Paths
    const navApp = "/";
    const navLogin = "/auth/login";

    // Redirect
    const router = useRouter();
    const currentPath = usePathname();
    const searchParams = useSearchParams();
    const redirectQuery = searchParams?.get("redirect") || null;

    const [redirectingTo, setRedirectingTo] = useState<string>("");
    const navTo = (path: string) => {
        router.push(path);
        setRedirectingTo(path.replace(/%2F/g, "/"));
    }

    useEffect(() => {
        const fullPath = searchParams.toString() ? `${currentPath}?${searchParams.toString().replace(/%2F/g, "/")}` : currentPath;
        if (fullPath === redirectingTo) {
            setOverlay(true);
            window.location.reload();
        }
    }, [navTo, searchParams]);

    // Populate user profile state.
    const populateProfileOnStateChange = async (user: dbUser | null) => {
        if (user) {
            const idToken = await user.getIdToken();
            const processedUser = {
                id: user.uid,
                email: user.email!,
                emailVerified: user.emailVerified,
            }

            if (!currentPath.includes("/auth")) await populateProfileWithData(idToken);

            setUserProfile(prev => ({
                ...(prev || {}),
                ...processedUser as UserProfile
            }));
        } else setUserProfile(null)
    }

    useEffect(() => {
        setLoading(false);
    }, []);

    // Reinitialize user state on auth change.
    useEffect(() => {
        const unsub = onAuthStateChanged(dbAuth, (user: any) => {
            if (user) {
                setCurrentUser(user)
                populateProfileOnStateChange(user);
            } else {
                setCurrentUser(null)
                populateProfileOnStateChange(null);
            }
        });
        return unsub;
    }, []);

    // Get user data.
    const populateProfileWithData = async (idToken: string) => {
        try {
            const getUserPreferences = await axios.post("/api/auth/getData", { idToken });
            if (!getUserPreferences) throw newError(409, "There was a problem updating user's preferences.", "populateProfileWithData", "getUserPreferences");
            const userPreferences = getUserPreferences.data.user as UserDoc;

            if (getUserPreferences.status === 200) {
                // Populate the state.
                setUserProfile(prev => ({
                    ...prev,
                    ...{
                        timezone: userPreferences.timezone,
                        hour24Format: userPreferences.hour24Format
                    } as UserProfile
                }));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw errorReturner(error);
        }
    }

    // Functions: Get ID Token
    const getIdToken = async () => {
        if (currentUser) {
            return currentUser.getIdToken();
        }
    }

    // Functions: Login
    const loginUser: LoginUser = async (credentials, fromRegister = false) => {
        setLoading(true);
        try {
            const loginCredentials = credentials as UserLoginCredentials;
            validate_user_email(loginCredentials.email);
            if (!loginCredentials || !loginCredentials.email || !loginCredentials.password) throw new Error("Username and password are required.");
            const { email, password } = loginCredentials;

            // Login with Firebase Auth.
            await setPersistence(dbAuth, browserLocalPersistence);
            const userData = await signInWithEmailAndPassword(dbAuth, email, password);

            const fetchedUser = userData?.user;
            if (fetchedUser) {
                const response = await axios.post("/api/auth/session", { userSession: "auth" });
                if (response.status === 200) {
                    const idToken = await fetchedUser.getIdToken();
                    const successful = fromRegister ? true : await populateProfileWithData(idToken);

                    if (successful) {
                        localStorage.setItem("userType", "user");

                        if (redirectQuery && typeof window !== "undefined") {
                            const origin = window.location.origin;
                            let queriesWithoutRedirect = new URLSearchParams(searchParams.toString());
                            queriesWithoutRedirect.delete("redirect");

                            const fullPath = queriesWithoutRedirect.toString() ? `${redirectQuery}?${queriesWithoutRedirect.toString()}` : redirectQuery;

                            if (validator.isURL(origin + redirectQuery, { require_tld: false })) {
                                navTo(fullPath.replace(/%2F/g, "/"));
                            } else {
                                navTo(navApp);
                            }
                        } else {
                            navTo(navApp);
                        }
                        return fetchedUser;
                    }
                } else throw newError(400, "Failed to create session.", "loginUser", "session");
            } else throw newError(403, "Email or password is wrong.", "loginUser", "credentials");
        } catch (error: any) {
            setLoading(false);
            if (error.code === "auth/invalid-credential") throw newError(403, "Email or password is wrong.", "loginUser", "wrong");
            throw errorReturner(error);
        }
    }

    // Functions: Logout
    const logoutUser: LogoutUser = async (redirect) => {
        setLoading(true);
        try {
            await dbSignOut(dbAuth).then(async () => {
                await axios.delete("/api/auth/session");
                navTo(redirect ?? navLogin);
                localStorage.removeItem("userType");
            })
        } catch (error: any) {
            setLoading(false);
            throw errorReturner(error);
        }
    }

    // Functions: Signup
    const signupUser: SignupUser = async (formData) => {
        setLoading(true);
        try {
            // Validate.
            const credentials = formData as UserSignupCredentials;
            if (!credentials || !credentials.email || !credentials.password) throw newError(400, "User signup credentials are required.", "signupUser", "required");
            validate_user_email(credentials.email);
            validate_user_password(credentials.password);

            // Create user.
            await setPersistence(dbAuth, browserLocalPersistence);
            const createdUser = await createUserWithEmailAndPassword(dbAuth, credentials.email, credentials.password!);
            if (!createdUser) throw newError(409, "There was a problem creating user.", "signupUser", "createUserWithEmailAndPassword");
            const fetchedIdToken = await createdUser.user.getIdToken();

            // Set States.
            const userData = createdUser;
            const idToken = fetchedIdToken;

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const updateUserPreferences = await axios.post("/api/auth/signup", {
                idToken,
                timezone,
                hour24Format: timezone === "Europe/Istanbul" ? true : false
            });
            if (!updateUserPreferences) throw newError(409, "There was a problem updating user's preferences.", "signupUser", "updateUserPreferences");

            // Login user.
            if (userData?.user && updateUserPreferences.status === 200) {
                await loginUser({ ...formData }, true);
            }
        } catch (error: any) {
            setLoading(false);
            if (error.code === "auth/email-already-in-use") throw newError(409, "Email already exists.", "signupUser", "exists");
            else if (error.response?.data?.headers?.from === "validateServerCaptcha") throw newError(403, "Captcha failed.", "signupUser", "checkCaptchaToken");
            throw errorReturner(error);
        }
    }

    // Functions: Delete User
    const deleteUser: DeleteUser = async (password, redirect = true) => {
        if (!currentUser) throw newError(400, "No user is currently logged in.", "deleteUser", "badrequest");
        setDeletingUser(true);

        try {
            if (password) {
                const credential = EmailAuthProvider.credential(
                    currentUser.email!,
                    password
                );
                await reauthenticateWithCredential(currentUser, credential);
            }

            const idToken = await currentUser.getIdToken();
            await axios.post("/api/auth/delete", { idToken });
            await dbDeleteUser(currentUser);

            await axios.delete("/api/auth/session");
            setCurrentUser(null);
            if (redirect) {
                navTo(navLogin);
            }
            localStorage.removeItem("userSession");
            localStorage.removeItem("userType");
        } catch (error: any) {
            setLoading(false);
            setDeletingUser(false);
            if (error.code === "auth/invalid-credential") throw newError(403, "Password is wrong.", "deleteUser", "wrong");
            if (error.code === "auth/too-many-requests") throw newError(403, "Too many failures, please try again later.", "deleteUser", "tooManyFailures");
            else throw errorReturner(error)
        }
    }

    // Functions: Forgot Password
    const forgotPassword: ForgotPassword = async (email) => {
        if (!email) throw newError(400, "Email is required.", "forgotPassword", "required");
        setLoading(true);

        try {
            validate_user_email(email);
            await sendPasswordResetEmail(dbAuth, email);
            setIsForgotPasswordEmailSent(true);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            throw errorReturner(error);
        }
    }

    const value = {
        // Functions
        loginUser,
        logoutUser,
        signupUser,
        deleteUser,
        forgotPassword, isForgotPasswordEmailSent, setIsForgotPasswordEmailSent,
        populateProfileWithData,
        getIdToken,

        // States
        currentUser,
        userProfile, setUserProfile,
        loading,
        deletingUser
    }

    // Feature Flag: Different pricing for blurred posts.
    /* if (typeof window !== "undefined" && !localStorage.getItem("ff_profileAndPrice")) {
        const blurredPosts = Math.random() < 0.5;
        localStorage.setItem("ff_profileAndPrice", blurredPosts ? "true" : "false");
    } */

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}