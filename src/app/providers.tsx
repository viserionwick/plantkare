"use client"

// Contexts
import { AuthProvider } from "@/contexts/Auth";
import { OverlayProvider } from "@/contexts/Overlay";

// Models
import { UserSession } from "@/models/User";

const AllProviders = ({ children, userSession }: { children: React.ReactNode, userSession: UserSession }) => {
    return (
        <OverlayProvider>
            <AuthProvider userSession={userSession}>
                {children}
            </AuthProvider>
        </OverlayProvider>
    )
}

export default AllProviders;