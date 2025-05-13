"use client"

type IconProps = {
    of: string | React.ReactNode;
    className?: string;
};

const Icon: React.FC<IconProps> = ({ of, className }) => {
    return (
        <span
            className={`
                c-Icon
                ${className ? className : ""}
            `}
        >
            {of}
        </span>
    );
};

export default Icon;