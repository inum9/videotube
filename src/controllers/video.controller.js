
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }
    if (userId) {
        filter.user = userId;
    }

    const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

    const videos = await Video.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Video.countDocuments(filter);

    res.json(new ApiResponse(200, {
        videos,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
    }));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description || !req.files?.video) {
        throw new ApiError(400, "Title, description and video file are required");
    }

    const videoLocalPath = req.files.video[0].path;
    const videoUploadResult = await uploadOnCloudinary(videoLocalPath, "video");

    if (!videoUploadResult?.secure_url) {
        throw new ApiError(500, "Video upload failed on Cloudinary");
    }

    let thumbnailUploadResult = null;
    if (req.files?.thumbnail) {
        const thumbnailLocalPath = req.files.thumbnail[0].path;
        thumbnailUploadResult = await uploadOnCloudinary(thumbnailLocalPath);
    }

    const videoDoc = await Video.create({
        title,
        description,
        videoUrl: videoUploadResult.secure_url,
        thumbnail: thumbnailUploadResult?.secure_url || "",
        user: req.user._id
    });

    res.status(201).json(
        new ApiResponse(201, videoDoc, "Video uploaded and published successfully")
    );
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("user", "username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(200, video));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Optional: check ownership
    if (video.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own videos");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    if (req.files?.thumbnail) {
        const thumbnailPath = req.files.thumbnail[0].path;
        const thumbnailUploadResult = await uploadOnCloudinary(thumbnailPath);
        video.thumbnail = thumbnailUploadResult.secure_url;
    }

    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Optional: check ownership
    if (video.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own videos");
    }

    await video.deleteOne();

    res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Optional: check ownership
    if (video.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own videos");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(
        new ApiResponse(200, { isPublished: video.isPublished }, "Publish status toggled")
    );
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}