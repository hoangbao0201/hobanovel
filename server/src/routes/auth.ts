import express from "express"
const router = express.Router()

import { connectUserBySocial, loginUser, registerUser } from "../controllers/AuthController";
// import { verifySignInSocial } from "../middleware/verifySignInSocial";


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/account/verification", connectUserBySocial)



export default router;