import { API } from "@/lib/constants";
import { Project } from "../../../lib/models/project";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tagNames = searchParams.get("tagNames");
  const names = tagNames ? tagNames.split(",") : [];

  try {
    const query = new URLSearchParams();
    names.forEach((name) => {
      query.append("tagNames", name);
    });
    const response = await fetch(`${API}/projects?${query.toString()}`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return response;
    }

    const data: Project[] = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch tags:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
