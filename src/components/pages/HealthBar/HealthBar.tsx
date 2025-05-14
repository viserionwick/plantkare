"use client"

// Essentials
import React from "react";

type HealthBarProps = {
    className?: string;
    percentage: number;
};

const HealthBar: React.FC<HealthBarProps> = ({
    className,
    percentage
}) => {
    const healthDisplay =
        percentage < 40
            ? "danger"
            : percentage > 60
                ? "healthy"
                : "moderate"

    return (
        <div
            className={`
                c-HealthBar
                ${className ? className : ""}
            `}
        >
            <div className="c-HealthBar--bar">
                <div
                    className={`
                            c-HealthBar--fill
                            ${healthDisplay}
                        `}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div
                className={`
                        c-HealthBar--data
                        ${healthDisplay}
                    `}
            >
                <div className="c-HealthBar--data__text">
                    {healthDisplay}
                </div>
                <div className="c-HealthBar--data__percentage">
                    {percentage}%
                </div>
            </div>
        </div>
    );
};

export default HealthBar;