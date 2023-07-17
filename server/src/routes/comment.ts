import express from "express"
const router = express.Router()

import { addReplyComment, addCommentByNovel, destroyReplyCommentByNovel, destroyCommentByNovel, getReplyComment, getComments, getCommentNotify, getCommentNotifyRead,  } from "../controllers/CommentController";
import { verifyToken } from "../middleware/verifyToken";


router.post("/add/reply", verifyToken, addReplyComment)
router.post("/add", verifyToken, addCommentByNovel)

router.get("/get/reply/:commentId", getReplyComment)
router.get("/get", getComments)

router.get("/get/notify/read", verifyToken, getCommentNotifyRead)
router.get("/get/notify", verifyToken, getCommentNotify)

router.delete("/destroy/:commentId", verifyToken, destroyCommentByNovel)
router.delete("/destroy/reply/:commentId", verifyToken, destroyReplyCommentByNovel)


export default router;