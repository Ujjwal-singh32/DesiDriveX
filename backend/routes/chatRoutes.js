import express from 'express'
import { sendMessage,getMessages } from '../controllers/chatController.js';
//userDetails,workerDetails,getMessages,getTotalWorkers,getTotalUsers
const chatRouter = express.Router();

chatRouter.post('/send' ,sendMessage);
chatRouter.get('/messages/:bookingId/:senderId/:receiverId', getMessages);
// chatRouter.get('/workers',workerDetails);
// chatRouter.get('/get/:senderId/:receiverId', getMessages);

export default chatRouter;