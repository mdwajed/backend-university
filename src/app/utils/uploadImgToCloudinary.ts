import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import multer from "multer";
// Configuration
cloudinary.config({
  cloud_name: "dldvtyudl",
  api_key: "953119324629868",
  api_secret: "sB6EVREvy_UL8tBW9MCwFATYy6E", // Click 'View API Keys' above to copy your API secret
});
export const uploadImgToCloudinary = async (imgName: string, path: string) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader.upload(path, {
    public_id: imgName,
  });
  await fs.unlink(path);
  return uploadResult;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/upload/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
