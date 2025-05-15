"use client"

// Essentials
import { ReactNode, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";

// Contexts
import { useAuthContext } from "@/contexts/Auth";

// Components
import Link from "@/components/ui/Link/Link";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { X, List, SignOut } from "@phosphor-icons/react";

const Layout: any = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    const {
        logoutUser,
    } = useAuthContext();

    const navRef = useRef<HTMLDivElement>(null);

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleMenu = (disabled?: boolean, from?: string) => {
        if (!disabled && from !== "logo") {
            setIsMenuOpen(prev => !prev);
            if (navRef.current) {
                navRef.current.scrollTo({
                    top: 0,
                });
            }
        }

        if (from === "logo" && isMenuOpen) {
            toggleMenu();
        }
    };

    const logoutFunc = async () => {
        try {
            await logoutUser();
        } catch (error: any) {
            console.error(error);
        }
    }

    return (
        <div className="l-App">
            <div
                className={`
                    l-App--nav
                    ${isMenuOpen ? "open" : ""}
                `}
                ref={navRef}
            >
                <div className="l-App--nav__content">
                    <div className="l-App--header">
                        <NextLink href="/" onClick={() => toggleMenu(false, "logo")}>
                            <Image src="/assets/logo.png" alt="logo" width={36} height={45} priority />
                        </NextLink>
                        <div className="l-App--header__menu">
                            {
                                isMenuOpen
                                    ? <button className="l-App--header__menu__item" onClick={() => toggleMenu()}><Icon of={<X weight="bold" />} /></button>
                                    : <div className="l-App--header__menu__items">
                                        <button className="l-App--header__menu__item" onClick={() => toggleMenu()}>
                                            <Icon of={<List weight="bold" />} />
                                        </button>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className="l-App--menu">
                        <Link className="l-App--menu__item" onClick={() => toggleMenu()} activePath={pathname} href="/">
                            Garden
                        </Link>
                        <Link className="l-App--menu__item" onClick={() => toggleMenu()} activePath={pathname} href="/plants">
                            Plants
                        </Link>
                    </div>
                    <div className="l-App--user">
                        <Button
                            inline
                            onClick={logoutFunc}
                        >
                            <SignOut />
                        </Button>
                    </div>
                </div>
            </div>
            <main className="l-App--content">
                {children}
            </main>
        </div>
    )
}

const AppLayout: any = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const layoutBlacklist = [
        "/auth"
    ];
    const isBlacklistedRoute = layoutBlacklist.some(blackListPath => pathname.startsWith(blackListPath));
    if (isBlacklistedRoute) {
        return children
    } else {
        return <Layout>
            {children}
        </Layout>
    }
}

export default AppLayout;