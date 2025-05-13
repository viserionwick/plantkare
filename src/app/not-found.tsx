// Essentials
import { Metadata } from "next";

// Components
import Button from "@/components/ui/Button/Button"

// Utils
import { generateServerSEO } from "@/utils/seo/generateServerSEO";

export async function generateMetadata(): Promise<Metadata> {
  return await generateServerSEO({
    title: "Page Not Found",
    description: "Page not found.",
  });
}

const NOT_FOUND = async () => {
  return (
    <div className="p-NotFound">
      <span className="p-NotFound--sorryFace">
        :/
      </span>
      <h1 className="p-NotFound--text">
        Page Not Found
      </h1>
      <Button
        href="/"
        className="p-NotFound--button"
      >
        Go Home
      </Button>
    </div>
  )
}

export default NOT_FOUND