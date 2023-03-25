import multer from "multer";
import path from "path";

export const storage = multer({
    storage: multer.diskStorage({}),
    fileFilter: (_req, file : any, cb : any) => {
        let ext = path.extname(file.originalname);
        if (
            ext !== ".jpg" &&
            ext !== ".JPG" &&
            ext !== ".png" &&
            ext !== ".PNG"
        ) {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});