"use client"

// Essentials
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Hooks
import useAuthForm from "@/hooks/useAuthForm";

// Components
import ForgotPassword from "./forgotPassword";
import Form from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Form/FormField";
import TextField from "@/components/ui/TextField/TextField";
import Button from "@/components/ui/Button/Button";

const CONTENT: NextPage = () => {
  const {
    loginFormData, setLoginFormData,
    loginFormErrors,
    handleLoginFormChange,
    handleLoginFormSubmit,

    // Auth Context
    loading,
  } = useAuthForm();

  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("e")) {
      setLoginFormData(prev => ({
        ...prev,
        ...{
          email: searchParams.get("e")
        } as any
      }));
    }
  }, [searchParams]);

  return (
    <div className="p-AuthLogin">
      <h1 className="p-AuthLogin--headline">
        Login
      </h1>
      <Form className="p-AuthLogin--form" onSubmit={handleLoginFormSubmit}>
        <FormField
          name="email"
          headline="Email"
          errors={[
            {
              match: "valueMissing",
              forceMatch: loginFormErrors.email === "missing",
              message: "Please enter your email."
            },
            {
              match: "typeMismatch",
              forceMatch: loginFormErrors.email === "invalid",
              message: "Please provide a valid email."
            },
            {
              customMatch: true,
              forceMatch: loginFormErrors.email === "wrong",
              message: "Email or password is wrong."
            }
          ]}
        >
          <TextField
            name="email"
            type="email"
            required
            value={loginFormData.email!}
            onChange={handleLoginFormChange}
            className={
              loginFormErrors.email
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
              forceMatch: loginFormErrors.password === "missing",
              message: "Please enter your password."
            },
            {
              match: "tooShort",
              forceMatch: loginFormErrors.password === "tooShort",
              message: "Password must be at least 8 characters long."
            },
            {
              match: "tooLong",
              forceMatch: loginFormErrors.password === "tooLong",
              message: "Password must be at most 64 characters long."
            },
            {
              match: "typeMismatch",
              forceMatch: loginFormErrors.password === "invalid",
              message: "Please enter the same password."
            },
            {
              customMatch: true,
              forceMatch: loginFormErrors.email === "wrong",
              message: "Email or password is wrong."
            }
          ]}
        >
          <TextField
            name="password"
            type="password"
            required
            revealablePassword
            value={loginFormData.password}
            onChange={handleLoginFormChange}
            className={
              loginFormErrors.password
                ? "error"
                : ""
            }
          />
          <ForgotPassword defaultEmail={loginFormData.email ?? undefined} />
        </FormField>

        <div className="p-AuthLogin--form__buttons">
          <Button
            type="submit"
            className={`
              p-AuthLogin--form__submit
              ${loading ? "loading" : ""}
            `}
            disabled={loading}
            loading={loading}
            keepSizeOnLoading
          >
            Login
          </Button>
        </div>
      </Form>
      <div className="p-AuthLogin--signupInstead">
        Don't have an account yet?
        <Link href="/auth/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default CONTENT;