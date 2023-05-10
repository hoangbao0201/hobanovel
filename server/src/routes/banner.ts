import express from "express"
const router = express.Router()

// ---

import { addBanners, getBanners } from "../controllers/BannersController";
import { checkAdmin } from "../middleware/checkAdmin";
import { storage } from "../library/multer";




router.post("/add/:novelId", checkAdmin, storage.single("file"), addBanners);
router.get("/get/:type?", getBanners);




export default router;