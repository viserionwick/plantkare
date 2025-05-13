"use client"

// Essentials
import React from "react";
import Link from "next/link";

// Components
import LoadingIcon from "../LoadingIcon/LoadingIcon";

type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset" | undefined;
    inline?: boolean;
    className?: string;
    id?: string;
    inverted?: boolean;
    name?: string;
    onClick?: (e?: any) => void;
    href?: string;
    target?: string;
    disabled?: boolean;
    loading?: boolean;
    keepSizeOnLoading?: boolean;
    style?: "primary" | "regular" | "red" | "platform";
};

const Button: React.FC<ButtonProps> = ({
    children,
    className,
    id,
    inverted,
    type = "button",
    style = "primary",
    inline = false,
    name,
    onClick = undefined,
    href,
    target,
    disabled,
    loading,
    keepSizeOnLoading,
}) => {
    return (
        <>
            {
                !href ?
                    <button
                        type={type}
                        name={name}
                        className={`
                            c-Button
                            ${className ? className : ""}
                            ${inline ? "inline" : ""}
                            ${inverted ? "inverted" : ""}
                            ${style ? style : ""}
                            ${loading ? "loading" : ""}
                        `}
                        id={id}
                        onClick={onClick}
                        disabled={disabled}
                    >
                        {
                            !loading
                                ? children
                                : keepSizeOnLoading ?
                                    <React.Fragment>
                                        <div className="c-Button--loadingContent">
                                            {children}
                                        </div>
                                        <div className="c-Button--loadingOverlay">
                                            <LoadingIcon />
                                        </div>
                                    </React.Fragment>
                                    : <LoadingIcon />
                        }
                    </button>
                    :
                    <Link
                        className={`
                            c-Button
                            ${className ? className : ""}
                            ${inline ? "inline" : ""}
                            ${inverted ? "inverted" : ""}
                            ${disabled ? "disabled" : ""}
                            ${style ? style : ""}
                            ${loading ? "loading" : ""}
                        `}
                        id={id}
                        href={href!}
                        target={target}
                        onClick={onClick}
                    >
                        {
                            !loading
                                ? children
                                : keepSizeOnLoading ?
                                    <React.Fragment>
                                        <div className="c-Button--loadingContent">
                                            {children}
                                        </div>
                                        <div className="c-Button--loadingOverlay">
                                            <LoadingIcon />
                                        </div>
                                    </React.Fragment>
                                    : <LoadingIcon />
                        }
                    </Link>
            }
        </>
    );
};

export default Button;