"use client"

// Essentials
import { useState } from "react";
import { NextPage } from "next";

// Models
import { UserSession } from "@/models/User";

// Components
import Headline from "@/components/pages/Headline/Headline";
import Button from "@/components/ui/Button/Button";
import NewPlantDialog from "@/components/dialogs/NewPlant/NewPlantDialog";
import PlantCard from "@/components/pages/PlantCard/PlantCard";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = (/* { userSession } */) => {
  const [newPlant, setNewPlant] = useState(false);

  return (
    <div className="p-Plants">
      <Headline>
        All Plants
        <Button onClick={setNewPlant}>
          New Plant
        </Button>
        <NewPlantDialog
          open={newPlant}
          onOpenChange={setNewPlant}
        />
      </Headline>
      <div className="p-Plants--list">
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
        <PlantCard
          id={"xxx"}
          name="Test"
          type="Bruh"
          expectedHumidity={10}
          weeklyWaterNeed={10}
          healthPercentage={80}
        />
      </div>
    </div>
  )
}

export default CONTENT;