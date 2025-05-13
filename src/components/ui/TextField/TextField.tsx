"use client"

// Essentials
import { useEffect, useRef, useState } from "react";

// Components
import * as Form from "@radix-ui/react-form";
import Icon from "../Icon/Icon";
import { Eye, EyeSlash } from "@phosphor-icons/react";

type TextFieldProps = {
    children?: React.ReactNode;
    name: string;
    value: string;
    onChange: (e?: any) => void;
    focus?: boolean;
    icon?: React.ReactNode;
    type?: string;
    rootClassName?: string;
    className?: string;
    required?: boolean;
    revealPassword?: boolean;
    revealablePassword?: boolean;
    placeholder?: string;
    standalone?: boolean;
    disabled?: boolean;
};

const TextField: React.FC<TextFieldProps> = ({
    children,
    className,
    name,
    required,
    placeholder,
    type = "text",
    icon,
    value,
    onChange,
    focus,
    revealPassword = false,
    revealablePassword = false,
    standalone,
    rootClassName,
    disabled,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFocusInput = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (focus) {
            inputRef.current?.focus();
        }
    }, [focus]);

    const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(revealPassword);

    return !standalone ?
        <Form.Field
            name={name}
            onChange={onChange}
            className={`
                c-TextField--wrapper
                ${rootClassName ? rootClassName : ""}
            `}
        >
            {
                icon &&
                <div className="c-TextField--icon" onClick={handleFocusInput}>
                    {icon}
                </div>
            }
            <Form.Control asChild>
                <input
                    ref={inputRef}
                    className={`
                        c-TextField
                        ${className ? className : ""}
                        ${icon ? "withIcon" : ""}
                        ${revealablePassword ? "withRevealablePassword" : ""}
                    `}
                    required={required}
                    value={value}
                    type={
                        type !== "password"
                            ? type
                            : isPasswordRevealed
                                ? "text"
                                : "password"
                    }
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </Form.Control>
            {
                revealablePassword &&
                <button
                    type="button"
                    tabIndex={-1}
                    className={`
                        c-TextField--revealPasswordButton
                        ${isPasswordRevealed ? "passwordRevealed" : ""}
                    `}
                    onClick={() => setIsPasswordRevealed(prev => !prev)}
                >
                    {
                        isPasswordRevealed
                            ? <Icon of={<Eye weight="fill" />} />
                            : <Icon of={<EyeSlash weight="fill" />} />
                    }
                </button>
            }
            {
                children ? children : <></>
            }
        </Form.Field>
        :
        <div
            className={`
                c-TextField--wrapper
                ${rootClassName ? rootClassName : ""}
            `}
        >
            {
                icon &&
                <div className="c-TextField--icon" onClick={handleFocusInput}>
                    {icon}
                </div>
            }
            <input
                ref={inputRef}
                className={`
                    c-TextField
                    ${className ? className : ""}
                    ${icon ? "withIcon" : ""}
                    ${revealablePassword ? "withRevealablePassword" : ""}
                `}
                name={name}
                onChange={onChange}
                required={required}
                value={value}
                type={
                    type !== "password"
                        ? type
                        : isPasswordRevealed
                            ? "text"
                            : "password"
                }
                placeholder={placeholder}
                disabled={disabled}
            />
            {
                revealablePassword &&
                <button
                    type="button"
                    className={`
                        c-TextField--revealPasswordButton
                        ${isPasswordRevealed ? "passwordRevealed" : ""}
                    `}
                    onClick={() => setIsPasswordRevealed(prev => !prev)}
                >
                    {
                        isPasswordRevealed
                            ? <Icon of={<Eye weight="fill" />} />
                            : <Icon of={<EyeSlash weight="fill" />} />
                    }
                </button>
            }
            {
                children ? children : <></>
            }
        </div>
};

export default TextField;