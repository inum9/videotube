import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/authorization.middleware.js";
const route=Router();
route.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )
    route.route("/login").post(loginUser);

    //protected routes

    route.route("/logout").post(verifyJWT,logoutUser);
    route.route("/refresh-token").post(refreshAccessToken);

route.route("/change-password").post(verifyJWT, changeCurrentPassword)
route.route("/current-user").get(verifyJWT, getCurrentUser)
route.route("/update-account").patch(verifyJWT, updateAccountDetails)

route.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
route.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

route.route("/c/:username").get(verifyJWT, getUserChannelProfile)
route.route("/history").get(verifyJWT, getWatchHistory)

export default route;