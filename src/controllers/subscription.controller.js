import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");

  if (userId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Unsubscribed from channel"));
  }

  const newSubscription = await Subscription.create({
    channel: channelId,
    subscriber: userId,
  });

  res.status(201).json(new ApiResponse(201, newSubscription, "Subscribed to channel"));
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(401,"CHANNEL IS NOT CORRECT ");
    }

             const subscriber=   await Subscription.findById(channelId).populate("subscriber");
             if(!subscriber){
                throw new ApiError(401,"SUBSCRIBER ARE NOT AVAILABLE .");
             }
             res.status(200).json(new ApiResponse(200,subscriber,"channel subscriber fetched !!"));
})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber ID");

  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "username email"); // adjust fields as needed

  res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched"));
});

});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}