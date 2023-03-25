import express from "express"
const router = express.Router()

import { verifyToken } from "../middleware/verifyToken";
import { createNovelByData, createNovelByUrl, getChaptersNovelBySlug, getNovelsByPage, getNovelBySlug, getNovelByTitle, getNovelsByUserId } from "../controllers/NovelController";



router.post("/create/data", verifyToken, createNovelByData);
router.post("/create/url", verifyToken, createNovelByUrl);

router.get("/search-by-page/:page", getNovelsByPage);
router.get("/search-by-title/:title", getNovelByTitle);
router.get("/search-by-slug/:slug", getNovelBySlug);
router.get("/search-by-userId/:userId", verifyToken, getNovelsByUserId);


router.get("/:slug/chapters", getChaptersNovelBySlug)


export default router;