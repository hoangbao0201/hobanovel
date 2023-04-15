import express from "express"
const router = express.Router()

import { addReviewByDataNovel, destroyReviewByNovel, getReviewByLatest, getReviewByNovel } from "../controllers/ReviewController";
import { verifyToken } from "../middleware/verifyToken";



router.post("/add/:novelId", verifyToken, addReviewByDataNovel)

router.get("/search-by-novel/:novelId", getReviewByNovel)

router.get("/search-by-latest/:page", getReviewByLatest)

router.delete("/destroy/:reviewId", verifyToken, destroyReviewByNovel)


export default router;