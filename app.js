import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS,
    credentials: true
}))

app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


// //routes import
 import route from "./src/routes/user.routes.js";
import commentRouter from "./src/routes/comment.routes.js"
import likeRouter from "./src/routes/like.routes.js"
import subRouter from "./src/routes/subscriber.routes.js"
import playRouter from "./src/routes/playlist.orutes.js"
import videoRouter from "./src/routes/video.routes.js";


// //routes declaration
// app.use("/api/v1/healthcheck", healthcheckRouter)
 app.use("/api/v1/users", route);
 app.use("/api/v1/comments",commentRouter);
 app.use("/api/v1/like",likeRouter);
 app.use("/api/v1/like",subRouter);
 app.use("/api/v1/like",playRouter);
 app.use("/api/v1/like",videoRouter);



// // http://localhost:8000/api/v1/users/register

export { app };