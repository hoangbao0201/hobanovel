import express from "express"
const router = express.Router()

import { checkUser, loginUser, registerUser } from "../controllers/AuthController";
// import { verifySignInSocial } from "../middleware/verifySignInSocial";


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/check", checkUser)



export default router;