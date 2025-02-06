import express from 'express';
import { createBooking,getUserBookings,updateBookingStatus,getOwnerBookings,getBooking} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create' , createBooking) // to create a booking
bookingRouter.get('/user-bookings/:userId',getUserBookings)  // user fetch their bookings
bookingRouter.patch('/:bookingId/status',updateBookingStatus) // to update the status by the worker
bookingRouter.get('/owner-bookings/:ownerId' ,getOwnerBookings) // worker get their bookings
bookingRouter.get('/:bookingId' ,getBooking)// to get the booking


export default bookingRouter;