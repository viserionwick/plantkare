"use client"

// Essentials
import { useEffect } from "react";

// Hooks
import useAuthForm from "@/hooks/useAuthForm";

// Components
import TextField from "@/components/ui/TextField/TextField";
import Button from "@/components/ui/Button/Button";
import Dialog from "@/components/ui/Dialog/Dialog";
import Form from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Form/FormField";

type PROPS = {
    defaultEmail?: string;
};

const ForgotPassword: React.FC<PROPS> = ({
    defaultEmail
}) => {
    const {
        email, setEmail,
        emailError, setEmailError,
        handleForgotPasswordFormChange,
        handleForgotPasswordFormSubmit,

        // Auth Context
        loading,
        isForgotPasswordEmailSent,
    } = useAuthForm();

    const clearStates = () => {
        setEmail("");
        setEmailError("");
    }

    useEffect(() => {
        if (defaultEmail) {
            setEmail(defaultEmail);
            setEmailError("");
        } else {
            setEmail("");
            setEmailError("");
        }
    }, [defaultEmail]);

    return (
        <Dialog
            trigger={
                <Button
                    inline
                    className="p-AuthLogin--form__forgotPassword"
                >
                    Forgot password?
                </Button>
            }
            title={
                !isForgotPasswordEmailSent
                    ? "Forgot your password?"
                    : "Email Sent"
            }
            buttonsStyle={!isForgotPasswordEmailSent ? "columns" : "rows"}
            buttons={!isForgotPasswordEmailSent ? [
                <Button
                    key="approve"
                    className={loading ? "loading" : ""}
                    disabled={loading}
                    onClick={handleForgotPasswordFormSubmit}
                >
                    Reset Password
                </Button>,
                <Button
                    key="cancel"
                    inverted
                    onClick={clearStates}
                >
                    Cancel
                </Button>
            ] : [
                <Button
                    key="cancel2"
                    onClick={clearStates}
                >
                    Understood
                </Button>
            ]}
        >
            {
                !isForgotPasswordEmailSent ?
                    <Form onSubmit={handleForgotPasswordFormSubmit}>
                        <FormField
                            name="email"
                            headline="Email"
                            errors={[
                                {
                                    match: "valueMissing",
                                    forceMatch: emailError === "missing",
                                    message: "Please enter your email."
                                },
                                {
                                    match: "typeMismatch",
                                    forceMatch: emailError === "invalid",
                                    message: "Please provide a valid email."
                                }
                            ]}
                        >
                            <TextField
                                name="email"
                                type="email"
                                required
                                value={email!}
                                onChange={handleForgotPasswordFormChange}
                                className={
                                    emailError
                                        ? "error"
                                        : ""
                                }
                            />
                        </FormField>
                    </Form>
                    :
                    <div className="p-AuthLogin--form__forgotPassword--sent">
                        We've sent a link to your email address to reset your password.
                    </div>
            }
        </Dialog>
    )
}

export default ForgotPassword;