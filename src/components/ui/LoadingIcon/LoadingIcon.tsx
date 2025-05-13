"use client"

// Components
import { Flower  } from "@phosphor-icons/react";

type LoadingIconProps = {
    className?: string;
};

const LoadingIcon: React.FC<LoadingIconProps> = ({ className }) => {
    return (
        <span
            className={`
                c-LoadingIcon
                ${className ? className : ""}
            `}
        >
            <Flower  weight="bold" />
        </span>
    );
};

export default LoadingIcon;