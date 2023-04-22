import express from "express"
const router = express.Router()

import { addReplyComment, addCommentByNovel, destroyReplyCommentByNovel, destroyCommentByNovel, getReplyComment, getCommentByLatest, getCommentByNovel,  } from "../controllers/CommentController";
import { verifyToken } from "../middleware/verifyToken";


router.post("/add-reply-comment/:novelId/:commentId", verifyToken, addReplyComment)

router.post("/add/:novelId", verifyToken, addCommentByNovel)

router.get("/get/:novelId?", getCommentByNovel)
router.get("/search-by-comment/:commentId", getReplyComment)

router.delete("/destroy-comment/:commentId", verifyToken, destroyCommentByNovel)
router.delete("/destroy-replycomment/:commentId", verifyToken, destroyReplyCommentByNovel)


export default router;