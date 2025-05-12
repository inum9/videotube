// routes/comment.routes.js
import express from "express";
import { getVideoComments,addComment,updateComment,deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.get("/video/:videoId", getVideoComments);
router.post("/video/:videoId", verifyJWT, addComment);
router.put("/:commentId", verifyJWT, updateComment);
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;
