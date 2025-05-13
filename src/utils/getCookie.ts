// Essentials
import { headers } from "next/headers";

export async function getCookie(cookieName: string): Promise<string | null> {
  const headersList = await headers();  // Get request headers
  const cookies = headersList.get("cookie");  // Get the cookie string

  if (!cookies) return null;

  // Split cookies into an array and look for the specific cookie
  const cookiesArray = cookies.split("; ");
  for (const cookie of cookiesArray) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return value;  // Return the value of the cookie
    }
  }

  return null;  // Return null if the cookie is not found
}