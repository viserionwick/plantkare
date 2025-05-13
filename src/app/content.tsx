"use client"

// Essentials
import { NextPage } from "next";

// Models
import { UserSession } from "@/models/User";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = ({ userSession }) => {
  return (
    <div className="p-Home">
      PlantKare
    </div>
  )
}

export default CONTENT;