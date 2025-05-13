"use client"

// Essentials
import React, { createContext, useContext, useState, useEffect } from "react";
import Image from "next/image";

export type OverlayContextType = {
    overlay: boolean,
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>,
    overlayMessage: string | null,
    setOverlayMessage: React.Dispatch<React.SetStateAction<string | null>>
};

const OverlayContext = createContext({} as OverlayContextType);
export const useOverlayContext = () => useContext(OverlayContext);
export const OverlayProvider = ({ children }: { children: React.ReactNode }) => {
    // Overlay.
    const [overlay, setOverlay] = useState<boolean>(false);
    const [blanketOverlay/* , setBlanketOverlay */] = useState<boolean>(false);
    const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

    useEffect(() => {
        if (blanketOverlay) {
            document.body.style.overflow = "hidden";
        }
    }, [blanketOverlay]);

    const value: OverlayContextType = {
        overlay, setOverlay,
        overlayMessage, setOverlayMessage
    };

    return (
        <OverlayContext.Provider value={value}>
            {children}
            {
                (overlay || blanketOverlay) &&
                <div className="l-Loading">
                    <div className="l-Loading--content">
                        <Image src="/assets/logo.png" alt="logo" width={60} height={75} priority />
                        {
                            overlayMessage &&
                            <div className="l-Loading--message">
                                {overlayMessage}
                            </div>
                        }
                    </div>
                </div>
            }
        </OverlayContext.Provider>
    );
};
