import express from "express"
const router = express.Router()

import { testDemo } from "../controllers/TestController";



router.get("/demo", testDemo);




export default router;