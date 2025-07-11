import { Router } from 'express';
import { toggleSubscription,getSubscribedChannels,getUserChannelSubscribers } from '../controllers/subscription.controller.js';
import {verifyJWT} from "../middleware/authorization.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router