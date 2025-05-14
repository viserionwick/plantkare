"use client"

type SectionRowProps = {
    children: React.ReactNode;
    className?: string;
    title?: string;
    isButtonsRow?: boolean;
};

const SectionRow: React.FC<SectionRowProps> = ({
    children,
    className,
    title,
    isButtonsRow
}) => {
    return (
        <div
            className={`
                ${!isButtonsRow ? "c-Section--row" : "c-Section--row--buttons"}
                ${className ? className : ""}
            `}
        >
            {
                title
                ? <b>{title}</b>
                : <></>
            }
            {children}
        </div>
    );
};

export default SectionRow;