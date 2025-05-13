"use client"

// Essentials
import { useEffect, useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import { Timestamp } from "firebase/firestore";

// Contexts
import { useAuthContext } from "@/contexts/Auth";

// Models
import { UserSession } from "@/models/User";
import { Plant } from "@/models/Plant";

// Components
import Headline from "@/components/pages/Headline/Headline";
import Button from "@/components/ui/Button/Button";
import PlantCard from "@/components/pages/PlantCard/PlantCard";
import PlantDialog from "@/components/dialogs/Plant/PlantDialog";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = (/* { userSession } */) => {
  const { getIdToken } = useAuthContext();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantsTotalAmount, setPlantsTotalAmount] = useState(0);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsHasMore, setPlantsHasMore] = useState(false);
  const [plantsMoreLoading, setPlantsMoreLoading] = useState(false);
  const [plantsNextCursor, setPlantsNextCursor] = useState<Timestamp | null>(null);

  const [newPlant, setNewPlant] = useState(false);

  const onFetchPlants = async (nextCursor: Timestamp | null = null) => {
    try {
      if (nextCursor) {
        setPlantsMoreLoading(true);
      } else {
        setPlantsLoading(true);
      }

      const response = await axios.post("/api/plants/getAll", {
        idToken: await getIdToken(),
        limit: 6,
        nextCursor
      });
      if (response.status === 200) {
        const fetchedPlants = response.data.plants;
        const fetchedTotalAmount = response.data.totalPlantsAmount;
        const fetchedNextCursor = response.data.nextCursor;
        const fetchedHasMore = response.data.hasMore;

        setPlants(prev =>
          nextCursor ? [...prev, ...fetchedPlants] : fetchedPlants
        );
        setPlantsHasMore(fetchedHasMore);
        setPlantsNextCursor(fetchedNextCursor);
        if (!nextCursor) setPlantsTotalAmount(fetchedTotalAmount);

        setPlantsLoading(false);
        setPlantsMoreLoading(false);

        console.log("response.data:", response.data);
      }
    } catch (error: any) {

    }
  }

  useEffect(() => {
    onFetchPlants();
  }, []);

  return (
    <div className="p-Plants">
      <Headline>
        All Plants ({plantsTotalAmount})
        <Button onClick={setNewPlant}>
          New Plant
        </Button>
        <PlantDialog
          open={newPlant}
          onOpenChange={setNewPlant}
          onSave={onFetchPlants}
        />
      </Headline>
      <div className="p-Plants--list">
        {
          plants.length && !plantsLoading
            ? plants.map((plant, i) => (
              <PlantCard
                key={i}
                id={plant.id!}
                name={plant.name}
                type={plant.type}
                expectedHumidity={plant.metadata[0].expectedHumidity}
                weeklyWaterNeed={plant.metadata[0].weeklyWaterNeed}
                healthPercentage={80}
              />
            ))
            : "Loading..."
        }
      </div>
      {
        !plantsHasMore ? <></> :
          <Button
            className="p-Plants--loadMore"
            onClick={() => onFetchPlants(plantsNextCursor)}
            loading={plantsMoreLoading}
            disabled={plantsMoreLoading}
            keepSizeOnLoading
          >
            Load More
          </Button>
      }
    </div>
  )
}

export default CONTENT;