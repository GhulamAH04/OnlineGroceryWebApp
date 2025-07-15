// OnlineGroceryWebApp/backend/src/utils/cloudinary.ts
// cloudinary setelah digabung

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import * as streamifier from 'streamifier';
import { v4 as uuidv4 } from 'uuid';
import { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } from '../config';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY!,
  api_secret: CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/** Upload buffer to Cloudinary (using uuid as filename) */
export const uploadToCloudinary = (buffer: Buffer, folder = 'products'): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uuidv4(),
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/** Upload via Multer file directly (streamifier) */
export const cloudinaryUploadMulter = (file: Express.Multer.File): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((err, res) => {
      if (err) return reject(err);
      resolve(res!);
    });

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

/** Extract Public ID from secure_url (for delete usage) */
export const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const publicId = parts[parts.length - 1].split('.')[0];
  return publicId;
};

/** Delete image from Cloudinary */
export const cloudinaryRemove = async (secure_url: string) => {
  const publicId = extractPublicIdFromUrl(secure_url);
  return await cloudinary.uploader.destroy(publicId);
};
