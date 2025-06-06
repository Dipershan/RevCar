require("dotenv").config();
const express =  require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT
const indexRouter =  require("./routes/index");
const sosRoutes = require("./routes/sos.route");
const carRoutes = require("./routes/car.route");

const cors =  require("cors");

mongoose.connect(
    process.env.DB_URL 
).then(()=>{
    console.log("DataBase Connected Sucessfully");
})
.catch((e)=>{
    console.log("Database Error" ,  e);
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }));
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://192.168.1.8:5173'],
//   credentials: true,
// })); 
app.use("/", indexRouter);
app.use("/api/sos", sosRoutes);
app.use("/api/cars", carRoutes);

 
app.get("/" , (req , res)=>{
    res.json("HelloWorld");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
