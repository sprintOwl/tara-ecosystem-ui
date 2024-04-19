import { toast } from "../components/ui/use-toast";

export const onFileUpload = async (file: File | null) => {
  if (!file) {
    toast({
      title: "No image selected",
      description: "Please select an image to upload.",
    });
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
      // Do not set Content-Type header, let the browser set it
    });

    if (!response.ok) {
      toast({
        title: "Upload failed",
        description: "The server responded with an error.",
      });
    }
    return response.json();
  } catch (error) {
    toast({
      title: "Upload error",
      description: "There was an error uploading the image.",
    });
    console.error("Upload error:", error);
  }
};
