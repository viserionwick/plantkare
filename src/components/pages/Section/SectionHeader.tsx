"use client"

type SectionHeaderProps = {
    children?: React.ReactNode;
    title?: string;
    className?: string;
    isSpaceBetween?: boolean;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
    children,
    title,
    className,
    isSpaceBetween
}) => {
    return (
        <div
            className={`
                c-Section--header
                ${isSpaceBetween ? "spaceBetween" : ""}
                ${className ? className : ""}
            `}
        >
            {
                title
                    ? <h2>{title}</h2>
                    : <></>
            }
            {
                children
                    ? children
                    : <></>
            }
        </div>
    );
};

export default SectionHeader;