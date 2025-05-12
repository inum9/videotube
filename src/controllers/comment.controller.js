import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId) {
    throw new ApiError(401, "VIDEOID IS NOT AVAILABLE!!");
  }

  const comment = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "username avatar");

  if (!comment) {
    throw new ApiError(401, "COMMENT IS NOT FOUND !!");
  }
  const total = await Comment.countDocuments(videoId);
  if (!total) {
    throw new ApiError(400, "TOTAL COMMENT ARE NOT AVAILABLE");
  }

  res.status(200).json(
    new ApiResponse(200, {
      total,
      comment,
      page,
      totalPges: Math.ceil(total / limit),
    })
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  if (!text) throw new ApiError(400, "Comment text is required");

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    content,
  });
  if (!comment) {
    throw new ApiError(401, "COMMENT IS NOT ADDED!!");
  }

  res.status(201).json(new ApiResponse(201, comment, "Comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { content } = req.body;
  const { commentId } = req.params;
  if (!content) {
    throw new ApiError(401, "COMMENT ID IS REQUIRED !!");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(401, "COMMENT IS NOT FOUND !");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  comment.content = content;
  await comment.save();
  res.status(200).json(new ApiResponse(200, comment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await comment.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
