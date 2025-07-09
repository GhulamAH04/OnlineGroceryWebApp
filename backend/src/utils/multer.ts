import multer from "multer";

export function Multer() {
    const storage = multer.memoryStorage()

    return multer({
        storage,
        limits: {
            fileSize: 1 * 1024 * 1024
        }
    })
}