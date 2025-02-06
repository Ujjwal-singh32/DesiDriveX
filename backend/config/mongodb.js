import mongoose from "mongoose";
// we used the mongo db connection string to connect to the MongoDb and when Connected then we will 
// console log
const connectDB = async()=>{
    mongoose.connection.on('connected',()=>{
        console.log('DB Connected')
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/DesiDriveX`)
}

export default connectDB;