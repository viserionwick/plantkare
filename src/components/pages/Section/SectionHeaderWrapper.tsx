"use client"

type SectionHeaderWrapperProps = {
    children?: React.ReactNode;
    className?: string;
    isSpaceBetween?: boolean;
};

const SectionHeaderWrapper: React.FC<SectionHeaderWrapperProps> = ({
    children,
    className,
    isSpaceBetween
}) => {
    return (
        <div
            className={`
                c-Section--header--wrapper
                ${isSpaceBetween ? "spaceBetween" : ""}
                ${className ? className : ""}
            `}
        >
            {children}
        </div>
    );
};

export default SectionHeaderWrapper;