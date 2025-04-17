import axios from "axios";
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

class TiersApiController {
  private static instance: TiersApiController;

  private constructor() {}

  public static getInstance(): TiersApiController {
    if (!TiersApiController.instance) {
      TiersApiController.instance = new TiersApiController();
    }
    return TiersApiController.instance;
  }

  public async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);

      if (response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error("Erreur lors de l'upload Cloudinary");
      }
    } catch (error) {
      console.error("Erreur upload Cloudinary:", error);
      throw error;
    }
  }
}

export const tiersApiController = TiersApiController.getInstance();
