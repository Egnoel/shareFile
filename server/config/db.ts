import mongoose, { ConnectOptions } from "mongoose";


const connectDB = async()=>{
try {
   await mongoose.connect(process.env.MONGO_URL!)
} catch (error) {
    console.log("db connection error", error);
}
const connection = mongoose.connection;
if(connection.readyState>=1){
    console.log("connected to database");
    return;
}
connection.on("error",()=>console.log("connection failed"));

}

export default connectDB;