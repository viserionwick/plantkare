"use client"


// Components
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { Drop, Leaf } from "@phosphor-icons/react";
import HealthBar from "../HealthBar/HealthBar";

type PlantCardProps = {
    className?: string;
    id: string;
    name: string;
    type: string;
    weeklyWaterNeed: number;
    expectedHumidity: number;
    healthPercentage: number;
};

const PlantCard: React.FC<PlantCardProps> = ({
    className,
    id,
    name,
    type,
    weeklyWaterNeed,
    expectedHumidity,
    healthPercentage
}) => {
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
                <HealthBar percentage={healthPercentage} />
            </div>
            <div className="c-PlantCard--data">
                <div className="c-PlantCard--data__weeklyWaterNeed">
                    <Icon of={<Drop />} /><span>{weeklyWaterNeed}</span> ml/week
                </div>
                <div className="c-PlantCard--data__expectedHumidity">
                    <Icon of={<Leaf />} /><span>{expectedHumidity}%</span> humidity
                </div>
            </div>
            <Button
                className="c-PlantCard--viewDetails"
                href={"/plants/" + id}
            >
                View Details
            </Button>
        </div>
    );
};

export default PlantCard;