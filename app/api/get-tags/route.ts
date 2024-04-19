import { API } from "@/lib/constants";
import { Tag } from "@/lib/models/tag";

export async function GET() {
  try {
    const response = await fetch(`${API}/tags`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return response;
    }

    const data: Tag[] = await response.json();

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
