import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../config";
import fs from "fs";

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
const uploadImage = (file: any) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, { public_id: file.originalname }, (err, res) => {
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
