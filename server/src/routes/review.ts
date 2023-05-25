import express from "express"
const router = express.Router()

import { addReplyReview, addReviewByDataNovel, destroyReplyReviewByNovel, destroyReviewByNovel, getReplyReview, getReviewsByNovel,  } from "../controllers/ReviewController";
import { verifyToken } from "../middleware/verifyToken";
import { checkReview } from "../middleware/checkReview";


router.post("/add/reply/:novelId/:reviewId", verifyToken, addReplyReview)

router.post("/add/:novelId", verifyToken, checkReview, addReviewByDataNovel)

router.get("/get/:novelId?", getReviewsByNovel)

// router.get("/search-by-novel/:novelId", getReviewByNovel)
// router.get("/search-by-latest/:page", getReviewByLatest)
router.get("/search-by-review/:reviewId", getReplyReview)

router.delete("/destroy-review/:reviewId", verifyToken, destroyReviewByNovel)
router.delete("/destroy-replyreview/:reviewId", verifyToken, destroyReplyReviewByNovel)


export default router;