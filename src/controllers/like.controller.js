import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.user._id;
  if (!videoId) {
    throw new ApiError(
      401,
      "VIDEO IS NOT AVAILABLE TO SEE IF IT IS LIKED OR NOT !!"
    );
  }

  const existingLike = await Like.findOne({ user: userId, video: videoId });
  if (existingLike) {
    const unliked = await Like.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Video unliked"));
  }

  const like = await Like.create({ videoId, userId });
  if (!like) {
    throw new ApiError(401, "LIKE IS NOT CREATED !!");
  }
  res.status(200).json(new ApiResponse(200, like, "USER LIKED SUCCESFULLY!!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const {userId}=req.user._id;
  if (!commentId)
  {
    throw new ApiError(401,"COMMENT IS NOT AVAILABLE !!");

  }

 const ifLikedComment= await Like.findOne(commentId,userId);
 if(ifLikedComment){
    const deleteLiek=await Like.deleteOne();
    return res.status(200).json(new ApiResponse(200,{},"COMMENT UNLIKED"));
 }

 const likeComment= await Like.create(commentId);
 if(!likeComment){
    throw new ApiError(401,"COMMENT IS NOT AVAILABLE !!!" )
 }

 res.status(200).json(new ApiResponse(200,likeComment,"COMMENT IS LIKED!"));


});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;
  
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");
  
    const existingLike = await Like.findOne({ user: userId, tweet: tweetId });
  
    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked"));
    }
  
    const like = await Like.create({ user: userId, tweet: tweetId });
    res.status(201).json(new ApiResponse(201, like, "Tweet liked"));
  });
  

  const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    const likes = await Like.find({ user: userId, video: { $exists: true } })
      .populate("video");
  
    res.status(200).json(new ApiResponse(200, likes, "Liked videos retrieved"));
  });

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
