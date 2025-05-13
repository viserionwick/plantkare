"use client"


// Components
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { Drop, Leaf } from "@phosphor-icons/react";

type PlantCardProps = {
    className?: string;
    name: string;
    type: string;
    weeklyWaterNeed: number;
    expectedHumidity: number;
    healthPercentage: number;
};

const PlantCard: React.FC<PlantCardProps> = ({
    className,
    name,
    type,
    weeklyWaterNeed,
    expectedHumidity,
    healthPercentage
}) => {
    const healthDisplay =
        healthPercentage < 40
            ? "danger"
            : healthPercentage > 60
                ? "healthy"
                : "moderate"

    return (
        <div
            className={`
                c-PlantCard
                ${className ? className : ""}
            `}
        >
            <div className="c-PlantCard--name">
                {name}
            </div>
            <div className="c-PlantCard--type">
                {type}
            </div>
            <div className="c-PlantCard--healthStatus">
                <span>Health Status</span>
                <div className="c-PlantCard--healthStatus__bar">
                    <div
                        className={`
                            c-PlantCard--healthStatus__bar--fill
                            ${healthDisplay}
                        `}
                        style={{ width: `${healthPercentage}%` }}
                    />
                </div>
                <div
                    className={`
                        c-PlantCard--healthStatus__data
                        ${healthDisplay}
                    `}
                >
                    <div className="c-PlantCard--healthStatus__data__current">
                        {healthDisplay}
                    </div>
                    <div className="c-PlantCard--healthStatus__data__percentage">
                        {healthPercentage}%
                    </div>
                </div>
            </div>
            <div className="c-PlantCard--data">
                <div className="c-PlantCard--data__weeklyWaterNeed">
                    <Icon of={<Drop />} /><span>{weeklyWaterNeed}</span> ml/week
                </div>
                <div className="c-PlantCard--data__expectedHumidity">
                    <Icon of={<Leaf />} /><span>{expectedHumidity}%</span> humidity
                </div>
            </div>
            <Button className="c-PlantCard--viewDetails">
                View Details
            </Button>
        </div>
    );
};

export default PlantCard;