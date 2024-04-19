import { NextResponse } from "next/server";
import { API } from "@/lib/constants";
import { ProjectCreate } from "@/lib/models/project";

export async function POST(req: Request) {
  const payload: ProjectCreate = (await req.json()) as ProjectCreate;
  if (
    !payload?.name ||
    !payload?.description ||
    !payload?.link ||
    !payload?.tags ||
    !payload?.owner ||
    !payload?.icon ||
    !payload?.banner
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    });

    if (!res.ok) {
      return res;
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
