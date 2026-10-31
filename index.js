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
import dns from "node:dns";
import cloudinary from "cloudinary";
import cors from "cors";
import axios from "axios";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config({ quiet: true });

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

// CORS configuration for Vercel frontend
const corsOptions = {
  origin: "https://shop-hub-2026-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json());

// Health check route for auto-ping
app.get("/health", (req, res) => {
  res.status(200).send("ShopHub Backend is Running");
});

// Auto-ping every 30 seconds
const url = "https://shophub-ecommerce-server-2026.onrender.com/health";
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then(() => {
      console.log("Website reloaded successfully");
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);

// Import routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";

// Use routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
