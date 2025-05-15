"use client"

type SectionDataProps = {
    children?: React.ReactNode;
    className?: string;
};

const SectionData: React.FC<SectionDataProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={`
                c-Section--row--data
                ${className ? className : ""}
            `}
        >
            {children}
        </div>
    );
};

export default SectionData;