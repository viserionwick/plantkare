"use client"

// Essentials
import NextLink from "next/link";

type LinkProps = {
    children: React.ReactNode;
    className?: string;
    href: string;
    activePath?: string;
    disabled?: boolean;
    onClick?: (e?: any) => void;
    target?: string;
};

const Link: React.FC<LinkProps> = ({
    children,
    className,
    href,
    activePath,
    disabled,
    onClick = undefined,
    target,
}) => {
    return (
        <>{
            !disabled ?
                <NextLink
                    href={href}
                    target={target}
                    className={`
                        c-Link
                        ${className ? className : ""}
                        ${(activePath && activePath === href) ? "isActive" : ""}
                    `}
                    onClick={onClick}
                >
                    {children}
                </NextLink>
                :
                <button
                    className={`
                        c-Link
                        ${className ? className : ""}
                        disabled
                    `}
                        onClick={onClick}
                    >
                    {children}
                </button>
        }</>
    );
};

export default Link;