import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/verifyToken";
import {
    createNovelByData,
    createNovelByUrl,
    getChaptersNovelBySlug,
    getNovelsByPage,
    getNovelBySlug,
    getNovelByTitle,
    getNovelsByUserId,
    getBannerNovel,
    getNovelsByData,
    getNovelsByOutstanding,
    getNovelsByHighlyRated,
    readingNovel,
    getReadingNovel,
    followNovel,
    unfollowNovel,
} from "../controllers/NovelController";


// Create Novel
router.post("/create/data", verifyToken, createNovelByData);
router.post("/create/url", verifyToken, createNovelByUrl);

// Follow Novel
router.post("/follow/:novelId", verifyToken, followNovel);
router.post("/unfollow/:novelId", verifyToken, unfollowNovel);

// Get Novel
router.get("/get/outstanding", getNovelsByOutstanding)
router.get("/get/highlyrated", getNovelsByHighlyRated)

router.get("/search-by-page/:page", getNovelsByPage);
router.get("/search-by-title/:title", getNovelByTitle);
router.get("/search-by-slug/:slug", getNovelBySlug);
router.get("/search-by-userId/:userId", verifyToken, getNovelsByUserId);
router.get("/get/:novelId?", getNovelsByData);

// Reading Novel
router.post("/reading/:novelId/:chapterRead", verifyToken, readingNovel)
router.get("/reading", verifyToken, getReadingNovel)

// Banners Novel
router.get("/:slug/chapters", getChaptersNovelBySlug);
router.get("/banner", getBannerNovel);

export default router;
