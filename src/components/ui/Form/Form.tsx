"use client"

// Essentials
import * as RadixForm from "@radix-ui/react-form";

type FormProps = {
    children: React.ReactNode;
    className?: string;
    onSubmit: (e: any) => void;
    ref?: React.Ref<HTMLFormElement>;
};

const Form: React.FC<FormProps> = ({ children, className, onSubmit, ref }) => {
    return (
        <RadixForm.Root
            className={`
                c-Form
                ${className ? className : ""}
            `}
            onSubmit={onSubmit}
            ref={ref}
        >
            {children}
        </RadixForm.Root>
    );
};

export default Form;