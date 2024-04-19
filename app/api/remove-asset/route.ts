import { API } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const assetId = searchParams.get("id");

  if (!assetId) {
    return NextResponse.json(
      { error: "Asset id is required" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${API}/assets/${assetId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return new NextResponse();
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
