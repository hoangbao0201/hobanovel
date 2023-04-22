require("dotenv").config()
import express from 'express'
import cors from "cors"
// import path from "path"

import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import novelRouter from "./routes/novel"
import testRouter from "./routes/test"
import chapterRouter from "./routes/chapter"
import reviewRouter from "./routes/review"
import commentRouter from "./routes/comment"


const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'src/public'))); 

const main = async () => {

    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/novels", novelRouter);
    app.use("/api/tests", testRouter);
    app.use("/api/chapters", chapterRouter);
    app.use("/api/reviews", reviewRouter);
    app.use("/api/comments", commentRouter);

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })

}

main().catch((error) => console.log(error)) 

