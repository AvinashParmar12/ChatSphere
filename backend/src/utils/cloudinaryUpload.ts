import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary";

// ==============================
// Upload Image To Cloudinary
// ==============================
export const uploadToCloudinary = (
  fileBuffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "chatsphere/avatars",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result as UploadApiResponse);
          }
        );
      Readable.from(fileBuffer).pipe(
        uploadStream
      );
    }
  );
};