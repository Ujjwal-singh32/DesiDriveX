import express from "express";
import { deleteCar, getCarDetails, registerCar,totalBookings,totalCars, totalCarsToDisplay, totalRevenue, updateCar } from "../controllers/carController.js";
import upload from "../middleware/multer.js";

const carRouter = express.Router();

// api endpoints for the car
carRouter.post("/register", upload.fields([{name:'image1' , maxCount:1},{name:'image2' , maxCount:1},{name:'image3' , maxCount:1},{name:'image4' , maxCount:1},{name:'image5' , maxCount:1},{name:'image6' , maxCount:1}]), registerCar);
carRouter.get("/total-cars/:ownerId",totalCars)
carRouter.put("/update-car/:carId",upload.fields([{name:'image1' , maxCount:1},{name:'image2' , maxCount:1},{name:'image3' , maxCount:1},{name:'image4' , maxCount:1},{name:'image5' , maxCount:1},{name:'image6' , maxCount:1}]),updateCar)
carRouter.get("/details/:carId",getCarDetails)
carRouter.delete("/delete/:carId", deleteCar)
carRouter.get("/total-cars-model" , totalCarsToDisplay)
carRouter.get("/total-bookings/:carId" , totalBookings);
carRouter.get("/total-revenue/:carId", totalRevenue);
export default carRouter;
