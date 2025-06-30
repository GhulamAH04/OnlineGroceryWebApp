// File: src/utils/uploadToCloudinary.ts

import cloudinary from './cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer: Buffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uuidv4(), // nama file unik
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};
