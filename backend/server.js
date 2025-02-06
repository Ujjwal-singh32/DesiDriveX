import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import passwordRouter from "./routes/passwordRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import carRouter from "./routes/carRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
//App config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// middleware
app.use(express.json());
app.use(cors());

// Api endpoints for the app
app.use("/api/users", userRouter);
app.use("/api/passwords", passwordRouter);
app.use("/api/owners", ownerRouter);
app.use("/api/cars", carRouter);
app.use("/api/bookings", bookingRouter);
app.use("/payment-method", paymentRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/chats", chatRouter);
app.use("/api/admin",adminRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server Running On Port ${port}`));
