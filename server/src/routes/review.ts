import express from "express"
const router = express.Router()

import { addReplyReview, addReviewByDataNovel, destroyReplyReviewByNovel, destroyReviewByNovel, getReplyReview, getReviewByLatest, getReviewByNovel,  } from "../controllers/ReviewController";
import { verifyToken } from "../middleware/verifyToken";


router.post("/add-reply-review/:novelId/:reviewId", verifyToken, addReplyReview)

router.post("/add/:novelId", verifyToken, addReviewByDataNovel)

router.get("/search-by-novel/:novelId", getReviewByNovel)
router.get("/search-by-latest/:page", getReviewByLatest)
router.get("/search-by-review/:reviewId", getReplyReview)

router.delete("/destroy-review/:reviewId", verifyToken, destroyReviewByNovel)
router.delete("/destroy-replyreview/:reviewId", verifyToken, destroyReplyReviewByNovel)


export default router;