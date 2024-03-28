const mongoose = require("mongoose");
//const mongoURI = "mongodb://localhost:27017/inotebook";
const mongoURI=process.env.MONGODB_CONNECT_URL;
const connectToMongo = async () => {
  mongoose.set('strictQuery', true)
  await mongoose
    .connect(mongoURI)
    .then(console.log("database connected"))
    .catch((e) => {
      console.log(e);
    });
};
module.exports = connectToMongo;

// database connection

// const mongoose=require('mongoose');
// const mongoURI="mongodb://localhost:27017/inotebook";
// const connectToMongo= async ()=>{
//     try{
//         await mongoose.connect(mongoURI)
//             console.log("successful connect with mongo");
//     } catch(error){
//         console.log("connection failed due to some error"+ error.message)
//     }
// }
// module.exports=connectToMongo;
