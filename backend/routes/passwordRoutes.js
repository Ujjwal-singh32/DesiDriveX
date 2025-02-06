import express from 'express'
import { forgotUser ,resetUser,forgotOwner,resetOwner} from '../controllers/passwordController.js';

const passwordRouter = express.Router();

passwordRouter.post('/users/forgot-password' , forgotUser);
passwordRouter.patch('/users/reset-password/:token' , resetUser);
passwordRouter.post('/owners/forgot-password' , forgotOwner);
passwordRouter.patch('/owners/reset-password/:token' , resetOwner);

export default passwordRouter;