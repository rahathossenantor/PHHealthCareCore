import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../config";
import fs from "fs";
import { TFile } from "../types/global.types";

type TCloudinaryRes = {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
    original_filename: string;
    api_key: string;
};

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});

// initialze storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });

// upload to cloudinary
const uploadImage = (file: TFile): Promise<TCloudinaryRes> => {
    console.log(file);
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (err: Error, res: TCloudinaryRes) => {
            if (err) {
                reject(err);
            };
            resolve(res);

            // delete image
            fs.unlink(file.path, (err) => reject(err));
        });
    });
};

export default uploadImage;
