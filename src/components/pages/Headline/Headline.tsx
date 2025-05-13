"use client"

// Essentials
import React from "react";

type HeadlineProps = {
    children: React.ReactNode;
    className?: string;
};

const Headline: React.FC<HeadlineProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={`
                c-Headline
                ${className ? className : ""}
            `}
        >
            {children}
        </div>
    );
};

export default Headline;