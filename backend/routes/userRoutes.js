import express from "express";
import { registerUser ,authenticateToken,loginUser,userDetails,updateProfile,userDetailsById} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// api endpoints for the user
userRouter.post("/register", upload.single("profilePic"), registerUser);
userRouter.post("/login" , loginUser)
userRouter.get("/details" ,authenticateToken, userDetails)
userRouter.get("/detailsbyid/:userId" , userDetailsById)
userRouter.put('/update-profile', authenticateToken,upload.single("profilePic"),updateProfile);
export default userRouter;
