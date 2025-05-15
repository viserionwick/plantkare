"use client"

// Essentials
import { NextPage } from "next";

// Components
import Icon from "@/components/ui/Icon/Icon";
import { PottedPlant } from "@phosphor-icons/react";
import Button from "@/components/ui/Button/Button";

const NOT_FOUND: NextPage = () => {
    return (
        <div className="p-Plant--notFound">
            <h2>Plant not found!</h2>
            <Icon of={<PottedPlant />} />
            <Button href="/plants">
                See All Plants
            </Button>
        </div>
    )
}

export default NOT_FOUND;