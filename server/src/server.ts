require("dotenv").config()
import express, { Request, Response } from 'express'
import cors from "cors"

import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import novelRouter from "./routes/novel"
import testRouter from "./routes/test"
import chapterRouter from "./routes/chapter"
import reviewRouter from "./routes/review"
import commentRouter from "./routes/comment"
import bannerRouter from "./routes/banner"
import updateRouter from "./routes/update"
import followRouter from "./routes/follow"


const app = express()
const PORT = process.env.PORT || 4000
app.use(cors())


import http from "http"
// import { Server } from "socket.io"
const server = http.createServer(app);

// const io = new Server(server, { 
//     cors: {
//         origin: [
//             "http://localhost:3000",
//         ],
//     },
// });

// io.on("connection" , (socket) => {
    
//     socket.on("send_message", (message) => {
//         socket.broadcast.emit("comment_receive", message)
//     });
// })

// ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const main = async () => {


    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/novels", novelRouter);
    app.use("/api/chapters", chapterRouter);
    app.use("/api/reviews", reviewRouter);
    app.use("/api/comments", commentRouter);
    app.use("/api/banners", bannerRouter);
    app.use("/api/update", updateRouter);
    app.use("/api/follows", followRouter);
    
    app.use("/api/tests", testRouter);

    
    app.get("/", async (_req : Request, res : Response) => {
        res.send("BY HOANGBAO")
    }) 

    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}


main().catch((error) => console.log(error)) 



// var conn = mysql.createConnection({
//     host: "hobanovel-db.mysql.database.azure.com",
//     user:"hoangbao0201",
//     password:"{your_password}"
//     database:"{your_database}",
//     port:3306,
//     ssl: {
//         ca: fs.readFileSync("{ca-cert filename}")
//     }
// });