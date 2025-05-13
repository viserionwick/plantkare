// Essentials
import { Metadata } from "next";

// Components
import CONTENT from "./content";

// Utils
import { generateServerSEO } from "@/utils/seo/generateServerSEO";

export async function generateMetadata(): Promise<Metadata> {
  return await generateServerSEO({
    title: "Sign Up",
    description: "Sign up to PlantKare",
    keywords: ["sign up"],
    route: "/auth/signup",
  });
}

const SIGNUP = async () => {
  return <CONTENT />
}

export default SIGNUP;