// Essentials
import { Metadata } from "next";

// Components
import CONTENT from "./content";

// Models
import { UserSession } from "@/models/User";

// Utils
import { generateServerSEO } from "@/utils/seo/generateServerSEO";
import getSessionData from "@/utils/auth/getSessionData";
import { checkBot } from "@/utils/checkBot";

export async function generateMetadata(): Promise<Metadata> {
  return await generateServerSEO({
    description: "Kare for your plants.",
    keywords: ["plant analytics, track my plants"],
    route: "/",
  });
}

const ROOT = async () => {
  const isBot = await checkBot();
  const userSession = await getSessionData() as UserSession;
  return <CONTENT userSession={isBot ? "bot" : userSession!} />
}

export default ROOT;