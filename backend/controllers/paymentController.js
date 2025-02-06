import express from "express";
import validator from "validator";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto"; 

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "Your Order",
            },
            unit_amount: Math.round(amount * 100), // Convert ₹ to paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.VITE_FRONTEND_URL}/payment-failed`,
    });

    res.json({ sessionUrl: session.url }); // Return session URL
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};


const razorpayPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency: currency || "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
      payment_capture: 1, // Auto-capture the payment
    };

    const order = await razorpayInstance.orders.create(options);

    // Respond with the order ID and other relevant info
    res.json({ 
      orderId: order.id,
      currency: order.currency,
      amount: order.amount / 100, // In INR, for display purposes
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};


const verifyRazorpay = async(req,res) =>{
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET; 

    // 1️⃣ Generate the HMAC SHA256 hash
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 2️⃣ Compare generated signature with received signature
    if (generated_signature === razorpay_signature) {
      //console.log("Razorpay Payment Verified Successfully!");
      return res.status(200).json({ success: true, message: "Payment Verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Payment Signature" });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return res.status(500).json({ success: false, message: "Payment Verification Failed" });
  }
}
export { stripePayment, razorpayPayment,verifyRazorpay };
