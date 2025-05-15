"use client"

// Essentials
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import moment from "moment-timezone";

// Contexts
import { useAuthContext } from "@/contexts/Auth";

// Models
import { Plant, PlantStatus } from "@/models/Plant";
import { UserSession } from "@/models/User";
import { PlantHealthHistory, generatePlantHealthHistory } from "@/utils/calc/generatePlantHealthHistory";

// Components
import Headline from "@/components/pages/Headline/Headline";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { ArrowLeft, Drop, Leaf, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import PlantDialog from "@/components/dialogs/Plant/PlantDialog";
import VerifyDialog from "@/components/dialogs/Verify/VerifyDialog";
import HealthBar from "@/components/pages/HealthBar/HealthBar";
import DatePicker from "@/components/ui/DatePicker/DatePicker";
import NOT_FOUND from "./notFound";

// Utils
import formatTimestamp from "../../../utils/formatTimestamp";
import fetchWeatherInfo from "@/utils/fetchWearherInfo";
import Section from "@/components/pages/Section/Section";
import SectionHeader from "@/components/pages/Section/SectionHeader";
import SectionRow from "@/components/pages/Section/SectionRow";
import LOADING from "@/components/pages/Loading/Loading";
import SectionData from "@/components/pages/Section/SectionData";
import SectionHeaderWrapper from "@/components/pages/Section/SectionHeaderWrapper";
/* import LOADING_DATA from "./(loading)/data"; */

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
  const [plantStatus, setPlantStatus] = useState<PlantStatus | null>(null);
  const [plantHistory, setPlantHistory] = useState<PlantHealthHistory | null>(null);
  const [plantNotFound, setPlantNotFound] = useState(false);

  useEffect(() => {
    if (currentUser) onFetchPlant();
  }, [currentUser]);

  const onFetchPlant = async () => {
    try {
      setPlantLoading(true);
      const response = await axios.post("/api/plants/getOne", {
        idToken: await getIdToken(),
        plantID: slug
      });
      if (response.status === 200) {
        const fetchedPlant = response.data.plant;
        const fetchedPlantStatus = response.data.status;
        const fetchedPlantHistory = response.data.status.thisWeek.plantHealth;

        setPlant(fetchedPlant);
        setPlantLoading(false);
        setPlantStatus(fetchedPlantStatus);
        setPlantHistory(fetchedPlantHistory);
      }
    } catch (error: any) {
      setPlantLoading(false);
      if (error.status === 404) { // Plant not found.
        setPlantNotFound(true);
      }
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

  const onFetchPlantHistory = async (dates: { startDate: Date, endDate: Date }) => {
    if (plant) {
      const weatherData = await fetchWeatherInfo(
        {
          startDate: moment(dates.startDate).format("YYYY-MM-DD"),
          endDate: moment(dates.endDate).format("YYYY-MM-DD")
        },
        {
          latitude: plant.location.latitude,
          longitude: plant.location.longitude
        }
      );

      const newPlantHistory = generatePlantHealthHistory(plant!, weatherData);
      setPlantHistory(newPlantHistory);
    }
  }

  const formatHistoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const issues = payload[0].payload.issues as string[];
      const score = payload[0].payload.score;

      return (
        <div className="p-Plant--healthHistoryChart__tooltip">
          <b>{label}</b>
          <div>Health: <b>{score}%</b></div>
          {
            !issues.length ? <></> :
              <div>Issues: <b>{issues.join(", ")}</b></div>
          }
        </div>
      );
    }

    return null;
  };

  if (plantNotFound) return <NOT_FOUND />

  return (
    <div className="p-Plant">
      {
        //!plant || plantLoading ? "loading..." :
        <>
          <Headline>
            <Button href="/plants" inverted>
              <Icon of={<ArrowLeft />} />
            </Button>
            {
              plantLoading ? <LOADING style={{ width: "100%", maxWidth: "115px", height: "25px" }} /> :
                plant!.name
            }
          </Headline>
          {
            !plant ? <></> :
              <>
                <PlantDialog
                  open={plantUpdate}
                  onOpenChange={setPlantUpdate}
                  plantToUpdate={{
                    plantID: plant.id!,
                    name: plant.name,
                    type: plant.type,
                    weeklyWaterNeed: plant.metadata[plant.metadata.length - 1].weeklyWaterNeed,
                    expectedHumidity: plant.metadata[plant.metadata.length - 1].expectedHumidity,
                    locationQuery: plant.locationQuery
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
              </>
          }
          <div className="p-Plant--sections">
            <Section>
              <SectionHeader title="Plant Information">
                <b>Details and metadata</b>
              </SectionHeader>
              <SectionRow title="Plant Type">
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "90px", height: "20px" }} /> :
                    <SectionData>{plant!.type}</SectionData>
                }
              </SectionRow>
              <SectionRow title="Water Need">
                <SectionData>
                  <Icon of={<Drop />} className="p-Plant--waterIcon" />
                  {
                    plantLoading ? <LOADING style={{ width: "100%", maxWidth: "130px", height: "20px" }} /> :
                      <>{plant!.metadata[plant!.metadata.length - 1].weeklyWaterNeed}ml per week</>
                  }
                </SectionData>
              </SectionRow>
              <SectionRow title="Expected Humidity">
                <SectionData>
                  <Icon of={<Leaf />} className="p-Plant--leafIcon" />
                  {
                    plantLoading ? <LOADING style={{ width: "100%", maxWidth: "130px", height: "20px" }} /> :
                      <>{plant!.metadata[plant!.metadata.length - 1].expectedHumidity}%</>
                  }
                </SectionData>
              </SectionRow>
              <SectionRow title="Added On">
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "90px", height: "20px" }} /> :
                    <SectionData>{formatTimestamp(plant!.createdAt, "M/D/YYYY")}</SectionData>
                }
              </SectionRow>
              <SectionRow title="Location">
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "200px", height: "20px" }} /> :
                    <SectionData>{plant!.locationQuery}</SectionData>
                }
              </SectionRow>
              <SectionRow isButtonsRow>
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "60px", height: "29px", borderRadius: "var(--buttonRadius)" }} /> :
                    <Button
                      className="p-Plant--editButton"
                      onClick={setPlantUpdate}
                    >
                      <Icon of={<PencilSimple />} />
                      Edit
                    </Button>
                }
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "73px", height: "29px", borderRadius: "var(--buttonRadius)" }} /> :
                    <Button
                      className="p-Plant--deleteButton"
                      style="red"
                      onClick={setPlantDelete}
                    >
                      <Icon of={<TrashSimple />} />
                      Delete
                    </Button>
                }
              </SectionRow>
            </Section>
            <Section>
              <SectionHeader title="Health Status">
                <b>Current plant health</b>
              </SectionHeader>
              <SectionRow title="Current Health">
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "100%", height: "15px", borderRadius: "999px", marginBottom: "20px", marginTop: "5px" }} /> :
                    <HealthBar percentage={plantStatus!.today.plantHealth.score} />
                }
              </SectionRow>
              <SectionRow title="Issues">
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "130px", height: "20px" }} /> :
                    !plantStatus!.today.plantHealth.issues.length
                      ? "No issues found."
                      : plantStatus!.today.plantHealth.issues.map((issue, i) => <div key={i}>
                        {issue}
                      </div>)
                }
              </SectionRow>
              <SectionRow title="Today's Weather">
                {
                  plantLoading ? <LOADING style={{ width: "100%", maxWidth: "230px", height: "20px" }} /> :
                    <>Rain: {plantStatus!.today.weather.actualRainMl}ml - Humidity: {plantStatus!.today.weather.actualHumidty}%</>
                }
              </SectionRow>
            </Section>
          </div>
          <Section>
            <SectionHeaderWrapper isSpaceBetween>
              <SectionHeader>
                <h2>Health History</h2>
                <b>Health changes over time</b>
              </SectionHeader>
              {
                plantLoading ? <LOADING style={{ width: "100%", maxWidth: "200px", height: "31px", borderRadius: "var(--buttonRadius)" }} /> :
                  <DatePicker
                    className="p-Plant--healthHistoryChart--datePicker"
                    onDateChange={onFetchPlantHistory}
                    startDate={moment().subtract(7, "days").toDate()}
                    endDate={moment().toDate()}
                  />
              }
            </SectionHeaderWrapper>
            {
              plantLoading ? <LOADING style={{ width: "100%", maxWidth: "100%", height: "300px" }} /> :
                <ResponsiveContainer className="p-Plant--healthHistoryChart">
                  <LineChart data={plantHistory!}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      content={formatHistoryTooltip}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Health Percentage" stroke="var(--primaryColor)" />
                  </LineChart>
                </ResponsiveContainer>
            }
          </Section>
        </>
      }
    </div>
  )
}

export default CONTENT;