"use client"

type SectionProps = {
    children: React.ReactNode;
    className?: string;
};

const Section: React.FC<SectionProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={`
                c-Section
                ${className ? className : ""}
            `}
        >
            {children}
        </div>
    );
};

export default Section;