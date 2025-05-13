"use client"

// Essentials
import React from "react";
import * as RadixForm from "@radix-ui/react-form";

export interface Error extends Pick<RadixForm.FormMessageProps,
    "match" |
    "forceMatch"
> {
    customMatch?: boolean;
    message: string | React.ReactNode;
};

type FormFieldProps = {
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    errors?: Error[];
    name: string;
    headline?: string;
};

const FormField: React.FC<FormFieldProps> = ({
    children,
    className,
    contentClassName,
    errors,
    name,
    headline
}) => {
    return (
        <RadixForm.Field
            className={`
                c-Form--field
                ${className ? className : ""}
            `}
            name={name}
        >
            <div className="c-Form--field--texts">
                {
                    headline &&
                    <RadixForm.Label className="c-Form--field--headline">
                        {headline}
                    </RadixForm.Label>
                }
                <div className="c-Form--field--errors">
                    {
                        name === "wrong" &&
                        <RadixForm.Message className="c-Form--field--error">
                            Email or password is wrong.
                        </RadixForm.Message>
                    }
                    {
                        errors?.map((error, i) => (
                            !error.customMatch ?
                                <RadixForm.Message key={i} className="c-Form--field--error" match={error.match} forceMatch={error.forceMatch}>
                                    {error.message}
                                </RadixForm.Message>
                                :
                                <React.Fragment key={i}>
                                    {
                                        error.forceMatch &&
                                        <RadixForm.Message key={i} className="c-Form--field--error">
                                            {error.message}
                                        </RadixForm.Message>
                                    }
                                </React.Fragment>
                        ))
                    }
                </div>
            </div>
            <div
                className={`
                    c-Form--field--content
                    ${contentClassName ? contentClassName : ""}
                `}
            >
                {children}
            </div>
        </RadixForm.Field>
    );
};

export default FormField;