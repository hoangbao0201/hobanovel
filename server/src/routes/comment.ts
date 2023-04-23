import express from "express"
const router = express.Router()

import { addReplyComment, addCommentByNovel, destroyReplyCommentByNovel, destroyCommentByNovel, getReplyComment, getCommentByNovel,  } from "../controllers/CommentController";
import { verifyToken } from "../middleware/verifyToken";


router.post("/add/:novelId?", verifyToken, addCommentByNovel)
router.post("/add/reply/:commentId", verifyToken, addReplyComment)

router.get("/get/:novelId?", getCommentByNovel)
router.get("/get/reply/:commentId", getReplyComment)

router.delete("/destroy/:commentId", verifyToken, destroyCommentByNovel)
router.delete("/destroy/reply/:commentId", verifyToken, destroyReplyCommentByNovel)


export default router;