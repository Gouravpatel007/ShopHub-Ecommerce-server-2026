// import express, { response } from "express";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import dns from "node:dns";
// import cloudinary from "cloudinary"; 
// import cors from "cors";
// import axios from "axios";

// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// dotenv.config({quiet:true});

// cloudinary.v2.config({
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_API_KEY, 
//     api_secret: process.env.CLOUD_API_SECRET,
// });


// const app = express();


// // This is for to make the  website faster we are using the free function code to make the website faster website can reload can call the reload website in 30sec


// const url = `https://shophub-ecommerce-server-2026.onrender.com`;
// const interval = 30000;

// function reloadWebsite() {
//   axios
//     .get(url)
//     .then((response) => {
//       console.log("website reloded");
//     })
//     .catch((error) => {
//       console.error(`Error : ${error.message}`);
//     });
// }

// setInterval(reloadWebsite, interval);


// ////      upto this for 



// app.use(express.json());
// app.use(cors());


// const port = process.env.PORT;

// // importing routes
// import userRoutes from './routes/user.js';
// import productRoutes from './routes/product.js';
// import cartRooutes from "./routes/cart.js";
// import addressRoutes from "./routes/address.js"
// import orderRoutes from "./routes/order.js"

// // using routes
// app.use("/api", userRoutes);
// app.use("/api", productRoutes);
// app.use("/api", cartRooutes);
// app.use("/api", addressRoutes);
// app.use("/api", orderRoutes);

// app.listen(port, ()=>{
//     console.log(`server is running on http://localhost:${port}`);
//     connectDB();
// });






































import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cloudinary from "cloudinary";
import cors from "cors";

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";

dotenv.config({ quiet: true });

const app = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// Health check
app.get("/", (req, res) => {
  res.status(200).send("ShopHub API is running");
});

// API routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();