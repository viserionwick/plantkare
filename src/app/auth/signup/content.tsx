"use client"

// Essentials
import { NextPage } from "next";
import Link from "next/link";

// Hooks
import useAuthForm from "@/hooks/useAuthForm";

// Components
import Form from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Form/FormField";
import TextField from "@/components/ui/TextField/TextField";
import Button from "@/components/ui/Button/Button";

const CONTENT: NextPage = () => {
  const {
    signupFormData,
    signupFormErrors,
    handleSignupFormChange,
    handleSignupFormSubmit,

    // Auth Context
    loading
  } = useAuthForm();

  return (
    <div className="p-AuthSignup">
      <h1 className="p-AuthSignup--headline">
        Sign Up
      </h1>
      <Form className="p-AuthSignup--form" onSubmit={handleSignupFormSubmit}>
        <FormField
          name="email"
          headline="Email"
          errors={[
            {
              match: "valueMissing",
              forceMatch: signupFormErrors.email === "missing",
              message: "Please enter your email."
            },
            {
              match: "typeMismatch",
              forceMatch: signupFormErrors.email === "invalid",
              message: "Please provide a valid email."
            },
            {
              customMatch: true,
              forceMatch: signupFormErrors.email === "exists",
              message: <>
                Email is already in use. Do you want to <Link href={"/auth/login?e=" + signupFormData.email}>login</Link>?
              </>
            }
          ]}
        >
          <TextField
            name="email"
            type="email"
            required
            value={signupFormData.email!}
            onChange={handleSignupFormChange}
            className={
              signupFormErrors.email
                ? "error"
                : ""
            }
          />
        </FormField>
        <FormField
          name="password"
          headline="Password"
          errors={[
            {
              match: "valueMissing",
              forceMatch: signupFormErrors.password === "missing",
              message: "Please enter your password."
            },
            {
              match: "tooShort",
              forceMatch: signupFormErrors.password === "tooShort",
              message: "Password must be at least 8 characters long."
            },
            {
              match: "tooLong",
              forceMatch: signupFormErrors.password === "tooLong",
              message: "Password must be at most 64 characters long."
            },
            {
              match: "typeMismatch",
              forceMatch: signupFormErrors.password === "invalid",
              message: "Please enter the same password."
            }
          ]}
        >
          <TextField
            name="password"
            type="password"
            required
            revealablePassword
            value={signupFormData.password}
            onChange={handleSignupFormChange}
            className={
              signupFormErrors.password
                ? "error"
                : ""
            }
          />
        </FormField>
        <FormField
          name="passwordAgain"
          headline="Confirm Password"
          errors={[
            {
              match: "valueMissing",
              forceMatch: signupFormErrors.passwordAgain === "missing",
              message: "Please enter your password."
            },
            {
              match: "typeMismatch",
              forceMatch: signupFormErrors.passwordAgain === "mismatch",
              message: "Please enter the same password."
            }
          ]}
        >
          <TextField
            name="passwordAgain"
            type="password"
            required
            revealablePassword
            value={signupFormData.passwordAgain!}
            onChange={handleSignupFormChange}
            className={
              signupFormErrors.passwordAgain
                ? "error"
                : ""
            }
          />
        </FormField>
        <Button
          type="submit"
          className={`
            p-AuthSignup--form__submit
            ${loading ? "loading" : ""}
          `}
          disabled={loading}
          loading={loading}
          keepSizeOnLoading
        >
          Sign Up
        </Button>
      </Form>
      <div className="p-AuthSignup--loginInstead">
        Already have an account?
        <Link href="/auth/login">Login</Link>
      </div>
    </div>
  )
}

export default CONTENT;