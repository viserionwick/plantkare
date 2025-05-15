"use client"

type SectionHeaderProps = {
    children?: React.ReactNode;
    title?: string;
    className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
    children,
    title,
    className,
}) => {
    return (
        <div
            className={`
                c-Section--header
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