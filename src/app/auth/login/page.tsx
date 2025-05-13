// Essentials
import { Metadata } from "next";

// Components
import CONTENT from "./content";

// Utils
import { generateServerSEO } from "@/utils/seo/generateServerSEO";

export async function generateMetadata(): Promise<Metadata> {
  return await generateServerSEO({
    title: "Login",
    description: "Login to PlantKare",
    keywords: ["login"],
    route: "/auth/login"
  });
}

const LOGIN = async () => {
  return <CONTENT />
}

export default LOGIN;