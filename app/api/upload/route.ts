import { NextResponse } from "next/server";
import { API } from "@/lib/constants";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define the POST handler for the file upload
export const POST = async (req: Request) => {
  // Parse the incoming form data
  const formData = await req.formData();

  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // Convert the file data to a Buffer
  // const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const formData = new FormData();
    formData.append("project", file);

    const response = await fetch(`${API}/assets/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: response.status }
      );
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
