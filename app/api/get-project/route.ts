import { API } from "@/lib/constants";
import { Project } from "../../../lib/models/project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("id");

  if (!projectId) {
    return NextResponse.json(
      { error: "Project id is required" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${API}/projects/${projectId}`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return response;
    }

    const data: Project = await response.json();

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
