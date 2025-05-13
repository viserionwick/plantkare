// Essentials
import { headers } from "next/headers";

export async function checkBot(): Promise<boolean> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isBot = /bot|crawl|spider|slurp/i.test(userAgent);
  return isBot;
}