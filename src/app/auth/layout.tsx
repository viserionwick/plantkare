"use client"

// Essentials
import React, { ReactNode } from "react";
import Image from "next/image";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="l-Auth">
            <div className="l-Auth--hero">
                <Image src="/assets/logo.png" alt="logo" width={60} height={75} />
            </div>
            <div className="l-Auth--content">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;