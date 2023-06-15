import express from "express"
const router = express.Router()

import { verifyToken } from "../middleware/verifyToken";
import { checkFollowNovel } from "../controllers/FollowController";
import { followNovel, getFollowsNovel, unfollowNovel } from "../controllers/NovelController";





router.get("/check/:novelId", checkFollowNovel);


router.get("/get", verifyToken, getFollowsNovel);
router.post("/add/:novelId", verifyToken, followNovel);
router.delete("/delete/:novelId", verifyToken, unfollowNovel);



export default router;