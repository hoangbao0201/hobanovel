import express from "express"
const router = express.Router()

import { verifyToken } from "../middleware/verifyToken";
import { checkExistUserByAccout, connectUser, getUserById, updatePasswordUser } from "../controllers/UserController";





router.post("/exist", checkExistUserByAccout);

router.get("/id/:id", getUserById);

router.post("/update/password", verifyToken, updatePasswordUser);

router.get("/", verifyToken, connectUser);



export default router;