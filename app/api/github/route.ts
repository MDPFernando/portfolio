import { NextResponse } from "next/server";
import { getGitHubData } from "@/lib/github";

export const revalidate = 3600; // Cache on server for 1 hour

/**
 * GET Handler fetches cached statistics for the main layout.
 */
export async function GET() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "MDPFernando";
  
  try {
    const data = await getGitHubData(username);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API error in github route:", error);
    return NextResponse.json(
      { error: "Failed to load GitHub statistics" },
      { status: 500 }
    );
  }
}
