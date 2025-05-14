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
    description: "Plant",
  });
}

type PROPS = {
  params: Promise<{ slug: string }>
}

const PAGE = async ({ params }: PROPS) => {
  const { slug } = await params;
  const isBot = await checkBot();
  const userSession = await getSessionData() as UserSession;  
  return <CONTENT
    userSession={isBot ? "bot" : userSession!}
    slug={slug[0]}
  />
}

export default PAGE;