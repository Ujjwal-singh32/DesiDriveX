import express from 'express'
import { stripePayment,razorpayPayment, verifyRazorpay } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-stripe-session' , stripePayment);
paymentRouter.post('/create-razorpay-order' , razorpayPayment);
paymentRouter.post("/verify-razorpay" , verifyRazorpay)
export default paymentRouter;