"use client"

// Essentials
import { NextPage } from "next";

// Models
import { UserSession } from "@/models/User";

// Components
import Headline from "@/components/pages/Headline/Headline";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = ({ userSession }) => {
  return (
    <div className="p-Home">
      <Headline>Your Virtual Garden</Headline>
    </div>
  )
}

export default CONTENT;