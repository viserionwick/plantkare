"use client"

// Essentials
import { useEffect, useState } from "react";
import { NextPage } from "next";
import axios from "axios";

// Contexts
import { useAuthContext } from "@/contexts/Auth";

// Models
import { Plant } from "@/models/Plant";
import { UserSession } from "@/models/User";

// Components
import Headline from "@/components/pages/Headline/Headline";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { ArrowLeft, Drop, Leaf, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import PlantDialog from "@/components/dialogs/Plant/PlantDialog";
import { PROPS as PlantDialogProps } from "@/components/dialogs/Plant/PlantDialog";

// Utils
import formatTimestamp from "../../../utils/formatTimestamp";
import VerifyDialog from "@/components/dialogs/Verify/VerifyDialog";
import { useRouter } from "next/navigation";

interface PROPS {
  userSession: UserSession | "bot";
  slug: string;
}

const CONTENT: NextPage<PROPS> = ({ slug }) => {
  const router = useRouter();
  const { getIdToken, currentUser } = useAuthContext();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantLoading, setPlantLoading] = useState(true);
  const [plantUpdate, setPlantUpdate] = useState(false);
  const [plantDelete, setPlantDelete] = useState(false);
  const [plantDeleting, setPlantDeleting] = useState(false);

  const onFetchPlant = async () => {
    try {
      setPlantLoading(true);
      const response = await axios.post("/api/plants/getOne", {
        idToken: await getIdToken(),
        plantID: slug
      });
      if (response.status === 200) {
        const fetchedPlant = response.data.plant;

        setPlant(fetchedPlant);
        setPlantLoading(false);
        console.log("fetchedPlant: ", fetchedPlant);
      }
    } catch (error: any) {
      setPlantLoading(false);
      console.log("error: ", error);
    }
  }

  const onDeletePlant = async (plantID: string) => {
    try {
      setPlantDeleting(true);
      const response = await axios.post("/api/plants/delete", {
        idToken: await getIdToken(),
        plantID
      });
      if (response.status === 200) {
        router.push("/plants");
      }
    } catch (error: any) {
      setPlantDeleting(false);
      console.log("error: ", error);
    }
  }

  useEffect(() => {
    if (currentUser) onFetchPlant();
  }, [currentUser]);

  return (
    <div className="p-Plant">
      {
        !plant || plantLoading ? "loading..." :
          <>
            <Headline>
              <Button href="/plants" inverted>
                <Icon of={<ArrowLeft />} />
              </Button>
              {plant.name}
            </Headline>
            <PlantDialog
              open={plantUpdate}
              onOpenChange={setPlantUpdate}
              plantToUpdate={{
                plantID: plant.id!,
                name: plant.name,
                type: plant.type,
                weeklyWaterNeed: plant.metadata[plant.metadata.length - 1].weeklyWaterNeed,
                expectedHumidity: plant.metadata[plant.metadata.length - 1].expectedHumidity
              }}
              onSave={onFetchPlant}
            />
            <VerifyDialog
              open={plantDelete}
              onOpenChange={setPlantDelete}
              onApprove={onDeletePlant}
              data={plant.id!}
              approveButton="Yes, delete this plant."
              loading={plantDeleting}
              content={"You can not undo plant data deletion. Are you ok with that?"}
            />
            <div className="p-Plant--sections">
              <div className="p-Plant--section">
                <div className="p-Plant--section__header">
                  <h2>Plant Information</h2>
                  <b>Details and metadata</b>
                </div>
                <div className="p-Plant--section__row">
                  <b>Plant Type</b>
                  <p>{plant.type}</p>
                </div>
                <div className="p-Plant--section__row">
                  <b>Water Need</b>
                  <p>
                    <Icon of={<Drop />} className="p-Plant--waterIcon" />
                    {plant.metadata[plant.metadata.length - 1].weeklyWaterNeed} ml per week
                  </p>
                </div>
                <div className="p-Plant--section__row">
                  <b>Expected Humidity</b>
                  <p>
                    <Icon of={<Leaf />} className="p-Plant--leafIcon" />
                    {plant.metadata[plant.metadata.length - 1].expectedHumidity}%
                  </p>
                </div>
                <div className="p-Plant--section__row">
                  <b>Added On</b>
                  <p>{formatTimestamp(plant.createdAt, "M/D/YYYY")}</p>
                </div>
                <div className="p-Plant--section__row--buttons">
                  <Button
                    className="p-Plant--editButton"
                    onClick={setPlantUpdate}
                  >
                    <Icon of={<PencilSimple />} />
                    Edit
                  </Button>
                  <Button
                    className="p-Plant--deleteButton"
                    style="red"
                    onClick={setPlantDelete}
                  >
                    <Icon of={<TrashSimple />} />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-Plant--section">
                <div className="p-Plant--section__header">
                  <h2>Health Status</h2>
                  <b>Current plant health</b>
                </div>
                <div className="p-Plant--section__row">
                  <b>Current Health</b>
                  <p>90%</p>
                </div>
                <div className="p-Plant--section__row">
                  <b>Latest Readings</b>
                  Water 345 ml - Humidity 59%
                </div>
              </div>
            </div>
            <div className="p-Plant--section">
              <div className="p-Plant--section__header spaceBetween">
                <div>
                  <h2>Health History</h2>
                  <b>Track changes over time</b>
                </div>
                <button>Select Range</button>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default CONTENT;