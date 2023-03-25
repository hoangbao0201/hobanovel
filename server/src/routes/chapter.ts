import express from "express"
const router = express.Router()

import { createChapterByUrl, getChapterDetailBySlug } from "../controllers/ChapterController";

import { verifyToken } from "../middleware/verifyToken";
import { checkCreateChapter } from "../middleware/checkCreateChapter";



router.post("/create-by-url/:slug/:chapterNumber", verifyToken, checkCreateChapter, createChapterByUrl);

router.get("/chapter-detail/:slug/:chapterNumber", getChapterDetailBySlug);

// router.get("/chapters/increase-view//:slug/:chapterNumber", getChapterDetailBySlug);


export default router;