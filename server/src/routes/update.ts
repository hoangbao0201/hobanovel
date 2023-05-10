import express from "express"
const router = express.Router()

import { updateBlurImageBanners } from "../controllers/BannersController";
import { updateAllBlurImageNovel, updateBlurImageNovel } from "../controllers/NovelController";
import { checkAdmin } from "../middleware/checkAdmin";




router.put("/image/blur/banners/:id", checkAdmin, updateBlurImageBanners);
router.put("/image/blur/novel/:id", checkAdmin, updateBlurImageNovel);

router.put("/all/image/blur/novel", checkAdmin, updateAllBlurImageNovel);



export default router;