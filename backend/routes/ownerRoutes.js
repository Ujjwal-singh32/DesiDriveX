import express from "express";
import { registerOwner ,authenticateToken,loginOwner,ownerDetails,updateProfile,findOwnerByphone} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// api endpoints for the user
ownerRouter.post("/register", upload.single("profilePic"), registerOwner);
ownerRouter.post("/login" , loginOwner)
ownerRouter.get("/details" ,authenticateToken, ownerDetails)
ownerRouter.put('/update-profile', authenticateToken,upload.single("profilePic"),updateProfile);
ownerRouter.get('/details-byphone/:phoneNumber', findOwnerByphone);
export default ownerRouter;
