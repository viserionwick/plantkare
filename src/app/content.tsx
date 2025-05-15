"use client"

// Essentials
import { NextPage } from "next";
import { useEffect, useState } from "react";
import axios from "axios";

// Contexts
import { useAuthContext } from "@/contexts/Auth";

// Models
import { UserSession } from "@/models/User";
import { Plant } from "@/models/Plant";

// Components
import Headline from "@/components/pages/Headline/Headline";
import Section from "@/components/pages/Section/Section";
import SectionHeader from "@/components/pages/Section/SectionHeader";
import PlantCard from "@/components/pages/PlantCard/PlantCard";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { PottedPlant } from "@phosphor-icons/react";
import LOADING_PLANTS from "./(loading)/recentlyAddedPlants";
import LOADING_STATUSSECTION from "./(loading)/statusSection";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = (/* { userSession } */) => {
  const { getIdToken, currentUser } = useAuthContext();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantsTotalAmount, setPlantsTotalAmount] = useState(0);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsAverageHealth, setPlantsAverageHealth] = useState(0);

  const onFetchPlants = async () => {
    try {
      const response = await axios.post("/api/plants/getAll", {
        idToken: await getIdToken(),
        limit: 3,
        getAllAverageHealth: true
      });
      if (response.status === 200) {
        const fetchedPlants = response.data.plants;
        const fetchedTotalAmount = response.data.totalPlantsAmount;
        const allAverageHealth = response.data.allAverageHealth;

        setPlants(fetchedPlants);
        setPlantsTotalAmount(fetchedTotalAmount);
        setPlantsAverageHealth(allAverageHealth);
        setPlantsLoading(false);
      }
    } catch (error: any) {
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    if (currentUser) onFetchPlants();
  }, [currentUser]);

  return (
    <div className="p-Home">
      <Headline>Your Virtual Garden</Headline>
      <div className="p-Home--currentData">
        {
          plantsLoading ? <LOADING_STATUSSECTION /> :
            <Section>
              <SectionHeader title={plantsTotalAmount.toString()}>
                <p>Total Plants</p>
              </SectionHeader>
            </Section>
        }
        {
          plantsLoading ? <LOADING_STATUSSECTION /> :
            <Section>
              <SectionHeader title={plantsAverageHealth + "%"}>
                <p>Average Health Today</p>
              </SectionHeader>
            </Section>
        }
      </div>
      <Section className="p-Home--recentPlants">
        <SectionHeader title="Recently Added Plants" />
        {
          plantsLoading ? <LOADING_PLANTS /> :
            <div className="p-Home--recentPlants__list">
              {
                plants.length
                  ? plants.map((plant, i) => (
                    <PlantCard
                      key={i}
                      id={plant.id!}
                      name={plant.name}
                      type={plant.type}
                      expectedHumidity={plant.metadata[plant.metadata.length - 1].expectedHumidity}
                      weeklyWaterNeed={plant.metadata[plant.metadata.length - 1].weeklyWaterNeed}
                      healthPercentage={plant.plantHealthToday?.score || 0}
                    />
                  ))
                  : <div className="p-Home--recentPlants__list__empty">
                    <b>Add a plant first! Recently added plants will be displayed here.</b>
                    <Icon of={<PottedPlant />} />
                  </div>
              }
            </div>
        }
        {
          plantsLoading ? <></> :
            <Button
              className="p-Home--recentPlants__goToPlants"
              href={
                plantsTotalAmount === 0
                  ? "/plants?new=true"
                  : "/plants"
              }
            >
              {
                plantsTotalAmount === 0
                  ? "Add a plant"
                  : "See all plants"
              }
            </Button>
        }
      </Section>
    </div>
  )
}

export default CONTENT;