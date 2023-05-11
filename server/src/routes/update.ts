import express from "express"
const router = express.Router()

import { updateAllBlurImageBanners, updateBlurImageBanners } from "../controllers/BannersController";
import { updateAllBlurImageNovel, updateBlurImageNovel } from "../controllers/NovelController";
import { checkAdmin } from "../middleware/checkAdmin";




router.put("/image/blur/novel/:id", checkAdmin, updateBlurImageNovel);
router.put("/all/image/blur/novel", checkAdmin, updateAllBlurImageNovel);



router.put("/image/blur/banners/:id", checkAdmin, updateBlurImageBanners);
router.put("/all/image/blur/banners", checkAdmin, updateAllBlurImageBanners);



export default router;