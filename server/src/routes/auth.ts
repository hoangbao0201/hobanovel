import express from "express"
const router = express.Router()

import { loginUser, registerUser } from "../controllers/AuthController";


router.post("/register", registerUser);

router.post("/login", loginUser);



export default router;