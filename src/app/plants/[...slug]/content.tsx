"use client"

// Essentials
import { NextPage } from "next";

// Models
import { UserSession } from "@/models/User";

// Components
import Headline from "@/components/pages/Headline/Headline";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";
import { ArrowLeft } from "@phosphor-icons/react";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = (/* { userSession } */) => {
  return (
    <div className="p-Plant">
      <Headline>
        <Button href="/plants" inverted>
          <Icon of={<ArrowLeft />} />
        </Button>
        Plant Name
      </Headline>
    </div>
  )
}

export default CONTENT;