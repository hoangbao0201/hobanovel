require("dotenv").config()
import express from 'express'
import cors from "cors"

import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import novelRouter from "./routes/novel"
import testRouter from "./routes/test"
import chapterRouter from "./routes/chapter"


const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const main = async () => {

    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/novels", novelRouter);
    app.use("/api/tests", testRouter);
    app.use("/api/chapters", chapterRouter);

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })

}

main().catch((error) => console.log(error)) 

