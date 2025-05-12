import { Router } from "express";
import { verifyJWT } from "../middleware/authorization.middleware.js";
import { toggleCommentLike,toggleTweetLike,toggleVideoLike, getLikedVideos  } from "../controllers/like.controller.js";
const likeRouter=Router();
likeRouter.post("/video/:videoId", verifyJWT, toggleVideoLike);
likeRouter.post("/comment/:commentId", verifyJWT, toggleCommentLike);
likeRouter.post("/tweet/:tweetId", verifyJWT, toggleTweetLike);
likeRouter.get("/liked-videos", verifyJWT, getLikedVideos);



export default likeRouter;