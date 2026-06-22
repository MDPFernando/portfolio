import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("Cloudinary environment variables are missing.");
}

cloudinary.config({
  cloud_name: cloudName || "",
  api_key: apiKey || "",
  api_secret: apiSecret || "",
  secure: true,
});

export default cloudinary;

/**
 * Uploads a base64 or file buffer to Cloudinary media storage.
 * @param fileUri base64 string or file buffer/path
 * @param folder folder name in Cloudinary catalog
 */
export async function uploadToCloudinary(fileUri: string, folder: string): Promise<string> {
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      folder: `portfolio/${folder}`,
      resource_type: "auto",
    });
    return res.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}
