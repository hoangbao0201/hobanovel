import express from "express"
const router = express.Router()

import { checkFollowNovel } from "../controllers/FollowController";





router.get("/check/:novelId", checkFollowNovel);



export default router;