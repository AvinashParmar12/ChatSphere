import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary";

// ==============================
// Upload File To Cloudinary
// ==============================
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,
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


// ==============================
// Delete File From Cloudinary
// ==============================
export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "auto",
    }
  );
};