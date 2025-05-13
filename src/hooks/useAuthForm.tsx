// Essentials
import { useState } from "react";

// Contexts
import { AuthContextType, useAuthContext } from "@/contexts/Auth";

// Components
import * as Checkbox from "@radix-ui/react-checkbox";

// Models
import { UserLoginCredentials, UserLoginCredentialsErrors, UserSignupCredentials, UserSignupCredentialsErrors } from "@/models/User";
import userModelSettings from "@/models/validators/User/settings";

type HandleLoginFormChange = (e: React.ChangeEvent<any>) => void;
type HandleLoginFormSubmit = (e: React.FormEvent<HTMLFormElement>) => void;
type HandleSignupFormChange = (e: React.ChangeEvent<any> | Checkbox.CheckedState, from?: string) => void;
type HandleSignupFormSubmit = (e: React.FormEvent<HTMLFormElement>) => void;
type HandleForgotPasswordFormChange = (e: React.ChangeEvent<any>) => void;
type HandleForgotPasswordFormSubmit = (e: React.FormEvent<HTMLFormElement>) => void;
type UseAuthForm = () => {
    // Login
    loginFormData: UserLoginCredentials;
    setLoginFormData: React.Dispatch<React.SetStateAction<UserLoginCredentials>>;
    loginFormErrorsDefault: UserLoginCredentialsErrors;
    loginFormErrors: UserLoginCredentialsErrors;
    setLoginFormErrors: React.Dispatch<React.SetStateAction<UserLoginCredentialsErrors>>;
    handleLoginFormChange: HandleLoginFormChange;
    handleLoginFormSubmit: HandleLoginFormSubmit;

    // Signup
    signupFormData: UserSignupCredentials;
    setSignupFormData: React.Dispatch<React.SetStateAction<UserSignupCredentials>>;
    signupFormErrorsDefault: UserSignupCredentialsErrors;
    signupFormErrors: UserSignupCredentialsErrors;
    setSignupFormErrors: React.Dispatch<React.SetStateAction<UserSignupCredentialsErrors>>;
    handleSignupFormChange: HandleSignupFormChange;
    handleSignupFormSubmit: HandleSignupFormSubmit;

    // OTHER //
    email: UserLoginCredentials["email"];
    setEmail: React.Dispatch<React.SetStateAction<UserLoginCredentials["email"]>>;
    emailError: string;
    setEmailError: React.Dispatch<React.SetStateAction<string>>;
    handleForgotPasswordFormChange: HandleForgotPasswordFormChange;
    handleForgotPasswordFormSubmit: HandleForgotPasswordFormSubmit;

    // Auth Context
    loginUser: AuthContextType["loginUser"];
    logoutUser: AuthContextType["logoutUser"];
    signupUser: AuthContextType["signupUser"];
    loading: boolean;
    isForgotPasswordEmailSent: boolean,
    setIsForgotPasswordEmailSent: React.Dispatch<React.SetStateAction<boolean>>,
};

const useAuthForm: UseAuthForm = () => {
    const {
        loginUser,
        logoutUser,
        signupUser,
        forgotPassword, isForgotPasswordEmailSent, setIsForgotPasswordEmailSent,
        loading
    } = useAuthContext();

    // Defaults: Login
    const loginFormDefault: UserLoginCredentials = {
        email: "",
        password: ""
    }
    const loginFormErrorsDefault: UserLoginCredentialsErrors = {
        email: "",
        password: ""
    }

    // Defaults: Signup
    const signupFormDefault: UserSignupCredentials = {
        email: "",
        password: "",
        passwordAgain: ""
    }
    const signupFormErrorsDefault: UserSignupCredentialsErrors = {
        email: "",
        password: "",
        passwordAgain: "",
    }

    // States: Login
    const [loginFormData, setLoginFormData] = useState<UserLoginCredentials>(loginFormDefault);
    const [loginFormErrors, setLoginFormErrors] = useState<UserLoginCredentialsErrors>(loginFormErrorsDefault);

    // States: Signup
    const [signupFormData, setSignupFormData] = useState<UserSignupCredentials>(signupFormDefault);
    const [signupFormErrors, setSignupFormErrors] = useState<UserSignupCredentialsErrors>(signupFormErrorsDefault);

    // States: Elements
    const [email, setEmail] = useState<UserLoginCredentials["email"]>("");
    const [emailError, setEmailError] = useState<string>("");

    // Handle Change: Login
    const handleLoginFormChange: HandleLoginFormChange = (e) => {
        const { name, value } = e.target;

        setLoginFormData({
            ...loginFormData,
            [name]: value
        });

        switch (name) {
            case "email":
                setLoginFormErrors({
                    ...loginFormErrors,
                    email: "",
                });
                break;
            case "password":
                setLoginFormErrors({
                    ...loginFormErrors,
                    password: "",
                });
                break;
            default:
                setLoginFormErrors({
                    email: "",
                    password: "",
                });
                break;
        }

        if (loginFormErrors.email === "wrong" || loginFormErrors.password === "wrong") { // Reset errors after wrong credentials.     
            setLoginFormErrors({
                email: "",
                password: "",
            });
        }
    };

    // Handle Submit: Login
    const handleLoginFormSubmit: HandleLoginFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!loginFormData.email && !loginFormData.password) { // Check all inputs.
                setLoginFormErrors({
                    email: "missing",
                    password: "missing"
                });
            } else if (!userModelSettings.email.validator(loginFormData.email!)) { // Validate email input.
                setLoginFormErrors({
                    ...loginFormErrors,
                    email: "invalid"
                });
            } else { // Successfull Login                
                await loginUser({
                    email: loginFormData.email,
                    password: loginFormData.password
                });
            }
        } catch (error: any) {
            if (error.headers?.key === "wrong") {
                setLoginFormErrors({
                    ...loginFormErrors,
                    email: "wrong",
                    password: "wrong"
                })
            }
        }
    };

    // Handle Change: Signup
    const handleSignupFormChange: HandleSignupFormChange = (e, from?) => {
        // This prints "value" of the element and if the "name" doesn't exist, you can determine it and then pass it with "from" parameter and "e" would be the "value".
        const [name, value] = (e && typeof e !== "boolean" && e !== "indeterminate") ? [e.target.name, e.target.value] : [from, e];

        setSignupFormData({
            ...signupFormData,
            [name]: value
        });

        switch (name) {
            case "email":
                setSignupFormErrors({
                    ...signupFormErrors,
                    email: "",
                });
                break;
            case "password":
                setSignupFormErrors({
                    ...signupFormErrors,
                    password: "",
                });
                break;
            case "passwordAgain":
                setSignupFormErrors({
                    ...signupFormErrors,
                    passwordAgain: "",
                });
                break;
            default:
                setSignupFormErrors({
                    email: "",
                    password: "",
                    passwordAgain: "",
                });
                break;
        }
    };

    // Handle Submit: Signup
    const handleSignupFormSubmit: HandleSignupFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!signupFormData.email && !signupFormData.password && !signupFormData.passwordAgain) { // Check all inputs.
                setSignupFormErrors({
                    email: "missing",
                    password: "missing",
                    passwordAgain: "missing",
                });
            } else if (!userModelSettings.email.validator(signupFormData.email!)) { // Validate email input.
                setSignupFormErrors({
                    ...signupFormErrors,
                    email: "invalid"
                });
            } else if (!userModelSettings.password.validator(signupFormData.password)) { // Validate password input.
                setSignupFormErrors({
                    ...signupFormErrors,
                    password: "invalid"
                })
            } else if (signupFormData.password.length < userModelSettings.password.minLength) { // Check password minimum length.
                setSignupFormErrors({
                    ...signupFormErrors,
                    password: "tooShort"
                })
            } else if (signupFormData.password.length > userModelSettings.password.maxLength) { // Check password maximum length.
                setSignupFormErrors({
                    ...signupFormErrors,
                    password: "tooLong"
                })
            } else if (signupFormData.password !== signupFormData.passwordAgain) { // Check password mismatch.
                setSignupFormErrors({
                    ...signupFormErrors,
                    passwordAgain: "mismatch"
                });
            } else { // Successfull Signup
                await signupUser({
                    email: signupFormData.email,
                    password: signupFormData.password,
                });
            }
        } catch (error: any) {
            if (error.headers?.key === "exists") {
                setSignupFormErrors({
                    ...signupFormErrors,
                    email: "exists",
                })
            }
        }
    };


    /////////////////////////// OTHER ///////////////////////////

    // Handle Change: Forgot Password
    const handleForgotPasswordFormChange = (e: any) => {
        const { value } = e.target;
        setEmail(value);
        setEmailError("");
    };

    // Handle Submit: Forgot Password
    const handleForgotPasswordFormSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (!email) { // Check the input.
                setEmailError("missing");
            } else if (!userModelSettings.email.validator(email)) { // Validate email input.
                setEmailError("invalid");
            } else { // Successfull
                await forgotPassword(email);
            }
        } catch {
        }
    }

    return {
        // Login
        loginFormData, setLoginFormData,
        loginFormErrors, setLoginFormErrors,
        handleLoginFormChange,
        handleLoginFormSubmit,
        // Login: Defaults
        loginFormDefault,
        loginFormErrorsDefault,

        // Signup
        signupFormData, setSignupFormData,
        signupFormErrors, setSignupFormErrors,
        handleSignupFormChange,
        handleSignupFormSubmit,
        // Signup: Defaults
        signupFormDefault,
        signupFormErrorsDefault,

        // OTHER //
        email, setEmail,
        emailError, setEmailError,
        handleForgotPasswordFormChange,
        handleForgotPasswordFormSubmit,


        // Auth Context
        loginUser,
        /* loginGuest, */
        logoutUser,
        signupUser,
        forgotPassword, isForgotPasswordEmailSent, setIsForgotPasswordEmailSent,
        loading,
    }
}

export default useAuthForm;