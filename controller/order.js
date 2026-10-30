// import { Cart } from "../models/cart.js";
// import { Order } from "../models/Order.js";
// import { Product } from "../models/Product.js";
// import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
// import TryCatch from "../utils/TryCatch.js";
// import Stripe from "stripe";

// export const newOrderCod = TryCatch(async (req,res) => {

//     const { method, phone, address } = req.body;
    
//     const cart = await Cart.find({user: req.user._id}).populate({
//         path: "product",
//         select: "title price",
//     });


//     if(!cart.length) return res.status(400).json({
//         message: "Cart is empty"
//     });

//     let subTotal = 0;

//     const items = cart.map((i) => {
//         const itemSubtotal = i.product.price * i.quauntity;

//         subTotal += itemSubtotal;

//         return {
//             product: i.product._id,
//             name: i.product.title,
//             price: i.product.price,
//             quauntity: i.quauntity,
//         };
//     });

//     const order = await Order.create({
//         items,
//         method,
//         user: req.user._id,
//         phone,
//         address,
//         SubTotal: subTotal,
//     });

//     for(let i of order.items){
//         const product = await Product.findById(i.product)

//         if(product){
//             product.stock -= i.quauntity;
//             product.sold += i.quauntity;

//             await product.save();
//         }
//     }

//     await Cart.deleteMany({user: req.user._id});

//     await sendOrderConfirmation({
//         email: req.user.email,
//         subject: "Order Confirmation",
//         orderId: order._id,
//         products: items,
//         totalAmount: subTotal,
//     })

//     res.json({
//         message: "Order created successfully",
//         order,
//     });
// });

// export const getAllOrders = TryCatch(async (req,res) => {
//     const orders = await Order.find({user: req.user._id})

//     res.json({orders: orders.reverse() });
// });


// export const getAlllOrdersAdmin = TryCatch(async (req,res) => {

//     if(req.user.role !== "admin") 
//         return res.status(403).json({
//           message: "UnAuthorized user",
//     });

//     const orders = await Order.find().populate("user").sort({ createdAt:-1 });

//     res.json(orders);

// });


// export const getMyOrder = TryCatch(async (req,res) => {
//     const order = await Order.findById(req.params.id)
//     .populate("items.product")
//     .populate("user");

//     res.json(order);
// });


// export const updateStatus = TryCatch(async (req, res) => {

//     if(req.user.role !== "admin"){ 
//         return res.status(403).json({
//           message: "UnAuthorized user",
//         });
//     }

//     const order = await Order.findById(req.params.id);

//     const { status } = req.body;

//     order.status = status;

//     await order.save();

//     res.json({
//         message: "order status updated",
//         order,
//     });
// });


// export const getStats = TryCatch(async (req,res) => {

//     if(req.user.role !== "admin"){ 
//         return res.status(403).json({
//           message: "UnAuthorized user",
//         });
//     }

//     const cod = await Order.find({method:"cod"}).countDocuments();
//     const online = await Order.find({method:"online"}).countDocuments();

//     const products = await Product.find();

//     const data = products.map((prod) => ({
//         name: prod.title,
//         sold: prod.sold,  
//     }));

//     res.json({
//         cod,
//         online,
//         data,
//     });
// });


// import dotenv from "dotenv";

// dotenv.config();

// const stripe =  new Stripe(process.env.Stripe_Secret_Key);

// export const newOrderOnline = async(req, res) => {
     
//     try {

//         const {method, phone, address} = req.body;

//         const cart = await Cart.find({user: req.user._id}).populate("products");

//         if(!cart.length){
//             return res.status(400).json({
//                 message: "Cart is empty",
//             });
//         }

//         const subTotal = cart.reduce(
//             (total, item) => total + item.product.price * item.quauntity,
//             0
//         );

//         const lineItems = cart.map((item) => ({
//             price_data: {
//                 currency: "inr",
//             product_data: {
//                 name: item.product.title,
//                 images: [item.product.images[0].url],
//             },
//             unit_amount: Math.round(item.product.price * 100),
//             },

//             quantity: item.quauntity,
//         }));

//         const sesssion = await stripe.checkout.session.create({
//            payment_method_types:["card"],
//            line_items: lineItems,
//            mode:"payment",
//            success_url:`${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
//            cancel_url: `${process.env.Frontend_Url}/cart`,
//            metaData:{
//             userId: req.user._id.toString(),
//             method,
//             phone,
//             address,
//             subTotal,
//            },
//         });

//         res.json({
//             url: sesssion.url,
//         });

//     } catch (error) {
//         console.log()
//     }
// };

























// import dotenv from "dotenv";
// dotenv.config();

// import TryCatch from "../utils/TryCatch.js";
// import { Cart } from "../models/Cart.js";
// import { Order } from "../models/Order.js";
// import { Product } from "../models/Product.js";
// import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.Stripe_Secret_Key);

// // ==========================================
// // 1. CREATE NEW ORDER - CASH ON DELIVERY
// // ==========================================

// export const newOrderCod = TryCatch(async (req, res) => {
//   const { method, phone, address } = req.body;

//   const cart = await Cart.find({
//     user: req.user._id,
//   }).populate({
//     path: "product",
//     select: "title price",
//   });

//   if (!cart.length) {
//     return res.status(400).json({
//       message: "Cart is empty",
//     });
//   }

//   let subTotal = 0;

//   const items = cart.map((item) => {
//     const quantity = item.quauntity;
//     const itemSubtotal = item.product.price * quantity;

//     subTotal += itemSubtotal;

//     return {
//       product: item.product._id,
//       name: item.product.title,
//       price: item.product.price,
//       quantity,
//     };
//   });

//   const order = await Order.create({
//     items,
//     method,
//     user: req.user._id,
//     phone,
//     address,
//     subTotal,
//   });

//   for (const item of order.items) {
//     const product = await Product.findById(item.product);

//     if (product) {
//       product.stock -= item.quantity;
//       product.sold += item.quantity;

//       await product.save();
//     }
//   }

//   await Cart.deleteMany({
//     user: req.user._id,
//   });

//   try {
//     await sendOrderConfirmation({
//       email: req.user.email,
//       subject: "Order Confirmation",
//       orderId: order._id,
//       products: items,
//       totalAmount: subTotal,
//     });
//   } catch (emailError) {
//     console.error("COD confirmation email failed:", emailError.message);
//   }

//   return res.status(201).json({
//     message: "Order created successfully",
//     order,
//   });
// });

// // ==========================================
// // 2. GET ALL ORDERS OF LOGGED-IN USER
// // ==========================================

// export const getAllOrders = TryCatch(async (req, res) => {
//   const orders = await Order.find({
//     user: req.user._id,
//   }).sort({ createdAt: -1 });

//   return res.json({
//     orders,
//   });
// });

// // ==========================================
// // 3. GET ALL ORDERS - ADMIN
// // ==========================================

// export const getAllOrdersAdmin = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const orders = await Order.find()
//     .populate("user")
//     .sort({ createdAt: -1 });

//   return res.json(orders);
// });

// // ==========================================
// // 4. GET SINGLE ORDER
// // ==========================================

// export const getMyOrder = TryCatch(async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate("items.product")
//     .populate("user");

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   // Users can only view their own orders.
//   if (
//     req.user.role !== "admin" &&
//     order.user._id.toString() !== req.user._id.toString()
//   ) {
//     return res.status(403).json({
//       message: "You are not authorized to view this order",
//     });
//   }

//   return res.json(order);
// });

// // ==========================================
// // 5. UPDATE ORDER STATUS - ADMIN
// // ==========================================

// export const updateStatus = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({
//       message: "Please provide an order status",
//     });
//   }

//   order.status = status;

//   await order.save();

//   return res.json({
//     message: "Order status updated",
//     order,
//   });
// });

// // ==========================================
// // 6. GET DASHBOARD STATISTICS - ADMIN
// // ==========================================

// export const getStats = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const cod = await Order.countDocuments({
//     method: "cod",
//   });

//   const online = await Order.countDocuments({
//     method: "online",
//   });

//   const products = await Product.find();

//   const data = products.map((product) => ({
//     name: product.title,
//     sold: product.sold,
//   }));

//   return res.json({
//     cod,
//     online,
//     data,
//   });
// });

// // ==========================================
// // 7. CREATE STRIPE CHECKOUT SESSION
// // ==========================================

// export const newOrderOnline = async (req, res) => {
//   try {
//     const { method, phone, address } = req.body;

//     if (method !== "online") {
//       return res.status(400).json({
//         message: "Invalid payment method",
//       });
//     }

//     if (!process.env.Frontend_Url) {
//       return res.status(500).json({
//         message: "Frontend_Url is missing from server .env",
//       });
//     }

//     const cart = await Cart.find({
//       user: req.user._id,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty",
//       });
//     }

//     let subTotal = 0;

//     const lineItems = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       const quantity = Number(item.quauntity);
//       const price = Number(item.product.price);

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1 ||
//         !Number.isFinite(price) ||
//         price <= 0
//       ) {
//         throw new Error("Invalid product price or quantity");
//       }

//       subTotal += price * quantity;

//       return {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: item.product.title,
//           },
//           unit_amount: Math.round(price * 100),
//         },
//         quantity,
//       };
//     });

//     // Create Stripe Checkout Session.
//     // payment_method_types is intentionally omitted.
//     const session = await stripe.checkout.sessions.create({
//       line_items: lineItems,
//       mode: "payment",

//       success_url: `${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,

//       cancel_url: `${process.env.Frontend_Url}/cart`,

//       metadata: {
//         userId: req.user._id.toString(),
//         method: "online",
//         phone: String(phone || ""),
//         address: String(address || ""),
//         subTotal: String(subTotal),
//       },
//     });

//     return res.status(200).json({
//       url: session.url,
//     });
//   } catch (error) {
//     console.error("Error creating Stripe session:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to create payment session",
//     });
//   }
// };

// // ==========================================
// // 8. VERIFY STRIPE PAYMENT AND CREATE ORDER
// // ==========================================

// export const verifyPayment = async (req, res) => {
//   try {
//     const { sessionId } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({
//         message: "Stripe session ID is required",
//       });
//     }

//     // Retrieve session directly from Stripe.
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return res.status(400).json({
//         message: "Payment has not been completed",
//       });
//     }

//     const metadata = session.metadata || {};
//     const userId = metadata.userId;

//     if (!userId || userId !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You are not authorized to verify this payment",
//       });
//     }

//     // Prevent duplicate orders for the same Stripe session.
//     const existingOrder = await Order.findOne({
//       paymentInfo: session.id,
//     });

//     if (existingOrder) {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already verified",
//         order: existingOrder,
//       });
//     }

//     const cart = await Cart.find({
//       user: userId,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty. Please contact support if payment was charged.",
//       });
//     }

//     const items = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       return {
//         product: item.product._id,
//         name: item.product.title,
//         price: item.product.price,
//         quantity: item.quauntity,
//       };
//     });

//     const subTotal = Number(metadata.subTotal);

//     if (!Number.isFinite(subTotal) || subTotal <= 0) {
//       return res.status(400).json({
//         message: "Invalid order total in payment session",
//       });
//     }

//     // Confirm that the Stripe total matches the order total.
//     if (session.amount_total !== Math.round(subTotal * 100)) {
//       return res.status(400).json({
//         message: "Payment amount does not match the order total",
//       });
//     }

//     const order = await Order.create({
//       items,
//       method: "online",
//       user: userId,
//       phone: metadata.phone,
//       address: metadata.address,
//       subTotal,
//       paidAt: new Date(),
//       paymentInfo: session.id,
//     });

//     for (const item of order.items) {
//       const product = await Product.findById(item.product);

//       if (product) {
//         product.stock -= item.quantity;
//         product.sold += item.quantity;

//         await product.save();
//       }
//     }

//     await Cart.deleteMany({
//       user: userId,
//     });

//     try {
//       await sendOrderConfirmation({
//         email: req.user.email,
//         subject: "Order Confirmation",
//         orderId: order._id,
//         products: items,
//         totalAmount: subTotal,
//       });
//     } catch (emailError) {
//       console.error(
//         "Online order confirmation email failed:",
//         emailError.message
//       );
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Payment verified and order created successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to verify payment",
//     });
//   }
// };























// import dotenv from "dotenv";
// dotenv.config();

// import TryCatch from "../utils/TryCatch.js";
// import { Cart } from "../models/Cart.js";
// import { Order } from "../models/Order.js";
// import { Product } from "../models/Product.js";
// import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.Stripe_Secret_Key);

// // ==========================================
// // 1. CREATE NEW ORDER - CASH ON DELIVERY
// // ==========================================

// export const newOrderCod = TryCatch(async (req, res) => {
//   const { method, phone, address } = req.body;

//   if (method !== "cod") {
//     return res.status(400).json({
//       message: "Invalid payment method",
//     });
//   }

//   if (!phone || !address) {
//     return res.status(400).json({
//       message: "Phone and delivery address are required",
//     });
//   }

//   const cart = await Cart.find({
//     user: req.user._id,
//   }).populate({
//     path: "product",
//     select: "title price",
//   });

//   if (!cart.length) {
//     return res.status(400).json({
//       message: "Cart is empty",
//     });
//   }

//   let subTotal = 0;

//   const items = cart.map((item) => {
//     if (!item.product) {
//       throw new Error("A product in your cart no longer exists");
//     }

//     const quantity = Number(item.quauntity);
//     const price = Number(item.product.price);

//     if (
//       !Number.isInteger(quantity) ||
//       quantity < 1 ||
//       !Number.isFinite(price) ||
//       price <= 0
//     ) {
//       throw new Error("Invalid product price or quantity");
//     }

//     subTotal += price * quantity;

//     return {
//       product: item.product._id,
//       name: item.product.title,
//       price,
//       quauntity: quantity,
//     };
//   });

//   const order = await Order.create({
//     items,
//     method: "cod",
//     user: req.user._id,
//     phone,
//     address,
//     SubTotal: subTotal,
//   });

//   // Update product stock
//   for (const item of order.items) {
//     const product = await Product.findById(item.product);

//     if (product) {
//       product.stock -= item.quauntity;
//       product.sold += item.quauntity;

//       await product.save();
//     }
//   }

//   // Clear cart
//   await Cart.deleteMany({
//     user: req.user._id,
//   });

//   // Send confirmation email
//   try {
//     await sendOrderConfirmation({
//       email: req.user.email,
//       subject: "Order Confirmation",
//       orderId: order._id,
//       products: items,
//       totalAmount: subTotal,
//     });
//   } catch (emailError) {
//     console.error(
//       "COD confirmation email failed:",
//       emailError.message
//     );
//   }

//   return res.status(201).json({
//     success: true,
//     message: "Order created successfully",
//     order,
//   });
// });

// // ==========================================
// // 2. GET ALL ORDERS OF LOGGED-IN USER
// // ==========================================

// export const getAllOrders = TryCatch(async (req, res) => {
//   const orders = await Order.find({
//     user: req.user._id,
//   }).sort({ createdAt: -1 });

//   return res.json({
//     orders,
//   });
// });

// // ==========================================
// // 3. GET ALL ORDERS - ADMIN
// // ==========================================

// export const getAllOrdersAdmin = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const orders = await Order.find()
//     .populate("user")
//     .sort({ createdAt: -1 });

//   return res.json(orders);
// });

// // ==========================================
// // 4. GET SINGLE ORDER
// // ==========================================

// export const getMyOrder = TryCatch(async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate("items.product")
//     .populate("user");

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   if (
//     req.user.role !== "admin" &&
//     order.user._id.toString() !== req.user._id.toString()
//   ) {
//     return res.status(403).json({
//       message: "You are not authorized to view this order",
//     });
//   }

//   return res.json(order);
// });

// // ==========================================
// // 5. UPDATE ORDER STATUS - ADMIN
// // ==========================================

// export const updateStatus = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({
//       message: "Please provide an order status",
//     });
//   }

//   order.status = status;

//   await order.save();

//   return res.json({
//     message: "Order status updated",
//     order,
//   });
// });

// // ==========================================
// // 6. GET DASHBOARD STATISTICS - ADMIN
// // ==========================================

// export const getStats = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const cod = await Order.countDocuments({
//     method: "cod",
//   });

//   const online = await Order.countDocuments({
//     method: "online",
//   });

//   const products = await Product.find();

//   const data = products.map((product) => ({
//     name: product.title,
//     sold: product.sold,
//   }));

//   return res.json({
//     cod,
//     online,
//     data,
//   });
// });

// // ==========================================
// // 7. CREATE STRIPE CHECKOUT SESSION
// // ==========================================

// export const newOrderOnline = async (req, res) => {
//   try {
//     const { method, phone, address } = req.body;

//     if (method !== "online") {
//       return res.status(400).json({
//         message: "Invalid payment method",
//       });
//     }

//     if (!phone || !String(phone).trim() || !address || !String(address).trim()) {
//       return res.status(400).json({
//         message: "Phone and delivery address are required",
//       });
//     }

//     if (!process.env.Frontend_Url) {
//       return res.status(500).json({
//         message: "Frontend_Url is missing from server .env",
//       });
//     }

//     const cart = await Cart.find({
//       user: req.user._id,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty",
//       });
//     }

//     let subTotal = 0;

//     const lineItems = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       const quantity = Number(item.quauntity);
//       const price = Number(item.product.price);

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1 ||
//         !Number.isFinite(price) ||
//         price <= 0
//       ) {
//         throw new Error("Invalid product price or quantity");
//       }

//       subTotal += price * quantity;

//       return {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: item.product.title,
//           },
//           unit_amount: Math.round(price * 100),
//         },
//         quantity,
//       };
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items: lineItems,
//       mode: "payment",

//       success_url: `${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,

//       cancel_url: `${process.env.Frontend_Url}/cart`,

//       metadata: {
//         userId: req.user._id.toString(),
//         method: "online",
//         phone: String(phone).trim(),
//         address: String(address).trim(),
//         subTotal: String(subTotal),
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       url: session.url,
//     });
//   } catch (error) {
//     console.error("Error creating Stripe session:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to create payment session",
//     });
//   }
// };

// // ==========================================
// // 8. VERIFY STRIPE PAYMENT AND CREATE ORDER
// // ==========================================

// export const verifyPayment = async (req, res) => {
//   try {
//     const { sessionId } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({
//         message: "Stripe session ID is required",
//       });
//     }

//     // Retrieve Stripe session
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return res.status(400).json({
//         message: "Payment has not been completed",
//       });
//     }

//     const metadata = session.metadata || {};
//     const userId = metadata.userId;

//     // Verify logged-in user
//     if (!userId || userId !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You are not authorized to verify this payment",
//       });
//     }

//     // Prevent duplicate orders
//     const existingOrder = await Order.findOne({
//       paymentInfo: session.id,
//     });

//     if (existingOrder) {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already verified",
//         order: existingOrder,
//       });
//     }

//     // Validate metadata
//     if (!metadata.phone || !metadata.address) {
//       return res.status(400).json({
//         message: "Delivery phone or address is missing from payment session",
//       });
//     }

//     const subTotal = Number(metadata.subTotal);

//     if (!Number.isFinite(subTotal) || subTotal <= 0) {
//       return res.status(400).json({
//         message: "Invalid order total in payment session",
//       });
//     }

//     if (session.amount_total !== Math.round(subTotal * 100)) {
//       return res.status(400).json({
//         message: "Payment amount does not match the order total",
//       });
//     }

//     const cart = await Cart.find({
//       user: userId,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty. Please contact support if payment was charged.",
//       });
//     }

//     const items = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       return {
//         product: item.product._id,
//         name: item.product.title,
//         price: item.product.price,
//         quauntity: item.quauntity,
//       };
//     });

//     // Create order with exact schema field names
//     const order = await Order.create({
//       items,
//       method: "online",
//       user: userId,
//       phone: metadata.phone,
//       address: metadata.address,
//       SubTotal: subTotal,
//       paidAt: new Date(),
//       paymentInfo: session.id,
//     });

//     // Update stock
//     for (const item of order.items) {
//       const product = await Product.findById(item.product);

//       if (product) {
//         product.stock -= item.quauntity;
//         product.sold += item.quauntity;

//         await product.save();
//       }
//     }

//     // Clear cart
//     await Cart.deleteMany({
//       user: userId,
//     });

//     // Send confirmation email
//     try {
//       await sendOrderConfirmation({
//         email: req.user.email,
//         subject: "Order Confirmation",
//         orderId: order._id,
//         products: items,
//         totalAmount: subTotal,
//       });
//     } catch (emailError) {
//       console.error(
//         "Online order confirmation email failed:",
//         emailError.message
//       );
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Payment verified and order created successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to verify payment",
//     });
//   }
// };










// import dotenv from "dotenv";
// dotenv.config();

// import TryCatch from "../utils/TryCatch.js";
// import { Cart } from "../models/Cart.js";
// import { Order } from "../models/Order.js";
// import { Product } from "../models/Product.js";
// import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.Stripe_Secret_Key);

// // ==========================================
// // SEND ORDER EMAIL IN BACKGROUND
// // ==========================================

// const sendOrderEmailInBackground = ({
//   email,
//   orderId,
//   products,
//   totalAmount,
// }) => {
//   sendOrderConfirmation({
//     email,
//     subject: "Order Confirmation",
//     orderId,
//     products,
//     totalAmount,
//   }).catch((error) => {
//     console.error(
//       "Order confirmation email failed:",
//       error.message
//     );
//   });
// };

// // ==========================================
// // 1. CREATE NEW ORDER - CASH ON DELIVERY
// // ==========================================

// export const newOrderCod = TryCatch(async (req, res) => {
//   const { method, phone, address } = req.body;

//   if (method !== "cod") {
//     return res.status(400).json({
//       message: "Invalid payment method",
//     });
//   }

//   if (!phone || !address) {
//     return res.status(400).json({
//       message: "Phone and delivery address are required",
//     });
//   }

//   const cart = await Cart.find({
//     user: req.user._id,
//   }).populate({
//     path: "product",
//     select: "title price",
//   });

//   if (!cart.length) {
//     return res.status(400).json({
//       message: "Cart is empty",
//     });
//   }

//   let subTotal = 0;

//   const items = cart.map((item) => {
//     if (!item.product) {
//       throw new Error("A product in your cart no longer exists");
//     }

//     const quantity = Number(item.quauntity);
//     const price = Number(item.product.price);

//     if (
//       !Number.isInteger(quantity) ||
//       quantity < 1 ||
//       !Number.isFinite(price) ||
//       price <= 0
//     ) {
//       throw new Error("Invalid product price or quantity");
//     }

//     subTotal += price * quantity;

//     return {
//       product: item.product._id,
//       name: item.product.title,
//       price,
//       quauntity: quantity,
//     };
//   });

//   const order = await Order.create({
//     items,
//     method: "cod",
//     user: req.user._id,
//     phone,
//     address,
//     SubTotal: subTotal,
//   });

//   // Update stock
//   await Promise.all(
//     order.items.map((item) =>
//       Product.findByIdAndUpdate(item.product, {
//         $inc: {
//           stock: -item.quauntity,
//           sold: item.quauntity,
//         },
//       })
//     )
//   );

//   // Clear cart
//   await Cart.deleteMany({
//     user: req.user._id,
//   });

//   // Send email without delaying API response
//   sendOrderEmailInBackground({
//     email: req.user.email,
//     orderId: order._id,
//     products: items,
//     totalAmount: subTotal,
//   });

//   return res.status(201).json({
//     success: true,
//     message: "Order created successfully",
//     order,
//   });
// });

// // ==========================================
// // 2. GET ALL ORDERS OF LOGGED-IN USER
// // ==========================================

// export const getAllOrders = TryCatch(async (req, res) => {
//   const orders = await Order.find({
//     user: req.user._id,
//   }).sort({ createdAt: -1 });

//   return res.json({
//     success: true,
//     orders,
//   });
// });

// // ==========================================
// // 3. GET ALL ORDERS - ADMIN
// // ==========================================

// // export const getAllOrdersAdmin = TryCatch(async (req, res) => {
// //   if (req.user.role !== "admin") {
// //     return res.status(403).json({
// //       message: "You are not admin",
// //     });
// //   }

// //   const orders = await Order.find()
// //     .populate("user")
// //     .sort({ createdAt: -1 });

// //   return res.json(orders);
// // });







// const getAllOrdersAdmin = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };





// // ==========================================
// // 4. GET SINGLE ORDER
// // ==========================================

// export const getMyOrder = TryCatch(async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate("items.product")
//     .populate("user");

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   if (
//     req.user.role !== "admin" &&
//     order.user._id.toString() !== req.user._id.toString()
//   ) {
//     return res.status(403).json({
//       message: "You are not authorized to view this order",
//     });
//   }

//   return res.json(order);
// });

// // ==========================================
// // 5. UPDATE ORDER STATUS - ADMIN
// // ==========================================

// export const updateStatus = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({
//       message: "Please provide an order status",
//     });
//   }

//   order.status = status;

//   await order.save();

//   return res.json({
//     message: "Order status updated",
//     order,
//   });
// });

// // ==========================================
// // 6. GET DASHBOARD STATISTICS - ADMIN
// // ==========================================

// export const getStats = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const cod = await Order.countDocuments({
//     method: "cod",
//   });

//   const online = await Order.countDocuments({
//     method: "online",
//   });

//   const products = await Product.find();

//   const data = products.map((product) => ({
//     name: product.title,
//     sold: product.sold,
//   }));

//   return res.json({
//     cod,
//     online,
//     data,
//   });
// });

// // ==========================================
// // 7. CREATE STRIPE CHECKOUT SESSION
// // ==========================================

// export const newOrderOnline = async (req, res) => {
//   try {
//     const { method, phone, address } = req.body;

//     if (method !== "online") {
//       return res.status(400).json({
//         message: "Invalid payment method",
//       });
//     }

//     if (
//       !phone ||
//       !String(phone).trim() ||
//       !address ||
//       !String(address).trim()
//     ) {
//       return res.status(400).json({
//         message: "Phone and delivery address are required",
//       });
//     }

//     if (!process.env.Frontend_Url) {
//       return res.status(500).json({
//         message: "Frontend_Url is missing from server .env",
//       });
//     }

//     const cart = await Cart.find({
//       user: req.user._id,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty",
//       });
//     }

//     let subTotal = 0;

//     const lineItems = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       const quantity = Number(item.quauntity);
//       const price = Number(item.product.price);

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1 ||
//         !Number.isFinite(price) ||
//         price <= 0
//       ) {
//         throw new Error("Invalid product price or quantity");
//       }

//       subTotal += price * quantity;

//       return {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: item.product.title,
//           },
//           unit_amount: Math.round(price * 100),
//         },
//         quantity,
//       };
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items: lineItems,
//       mode: "payment",

//       success_url: `${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,

//       cancel_url: `${process.env.Frontend_Url}/cart`,

//       metadata: {
//         userId: req.user._id.toString(),
//         method: "online",
//         phone: String(phone).trim(),
//         address: String(address).trim(),
//         subTotal: String(subTotal),
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       url: session.url,
//     });
//   } catch (error) {
//     console.error("Error creating Stripe session:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to create payment session",
//     });
//   }
// };

// // ==========================================
// // 8. VERIFY STRIPE PAYMENT AND CREATE ORDER
// // ==========================================

// export const verifyPayment = async (req, res) => {
//   try {
//     const { sessionId } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({
//         message: "Stripe session ID is required",
//       });
//     }

//     // Retrieve Stripe session
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return res.status(400).json({
//         message: "Payment has not been completed",
//       });
//     }

//     const metadata = session.metadata || {};
//     const userId = metadata.userId;

//     // Verify logged-in user
//     if (!userId || userId !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You are not authorized to verify this payment",
//       });
//     }

//     // Check whether order already exists
//     const existingOrder = await Order.findOne({
//       paymentInfo: session.id,
//     });

//     if (existingOrder) {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already verified",
//         order: existingOrder,
//       });
//     }

//     // Validate delivery details
//     if (!metadata.phone || !metadata.address) {
//       return res.status(400).json({
//         message: "Delivery phone or address is missing from payment session",
//       });
//     }

//     // Validate order amount
//     const subTotal = Number(metadata.subTotal);

//     if (!Number.isFinite(subTotal) || subTotal <= 0) {
//       return res.status(400).json({
//         message: "Invalid order total in payment session",
//       });
//     }

//     if (session.amount_total !== Math.round(subTotal * 100)) {
//       return res.status(400).json({
//         message: "Payment amount does not match the order total",
//       });
//     }

//     // Get user's cart
//     const cart = await Cart.find({
//       user: userId,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty. Please contact support if payment was charged.",
//       });
//     }

//     let cartTotal = 0;

//     const items = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       const quantity = Number(item.quauntity);
//       const price = Number(item.product.price);

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1 ||
//         !Number.isFinite(price) ||
//         price <= 0
//       ) {
//         throw new Error("Invalid product price or quantity");
//       }

//       cartTotal += price * quantity;

//       return {
//         product: item.product._id,
//         name: item.product.title,
//         price,
//         quauntity: quantity,
//       };
//     });

//     // Make sure cart total still matches the paid amount
//     if (Math.round(cartTotal * 100) !== session.amount_total) {
//       return res.status(400).json({
//         message: "Cart amount has changed. Please contact support.",
//       });
//     }

//     // Create order
//     const order = await Order.create({
//       items,
//       method: "online",
//       user: userId,
//       phone: metadata.phone,
//       address: metadata.address,
//       SubTotal: subTotal,
//       paidAt: new Date(),
//       paymentInfo: session.id,
//     });

//     // Update stock
//     await Promise.all(
//       order.items.map((item) =>
//         Product.findByIdAndUpdate(item.product, {
//           $inc: {
//             stock: -item.quauntity,
//             sold: item.quauntity,
//           },
//         })
//       )
//     );

//     // Clear cart
//     await Cart.deleteMany({
//       user: userId,
//     });

//     // Send confirmation email in background.
//     // API response will not wait for Gmail SMTP.
//     sendOrderEmailInBackground({
//       email: req.user.email,
//       orderId: order._id,
//       products: items,
//       totalAmount: subTotal,
//     });

//     // Return response immediately
//     return res.status(201).json({
//       success: true,
//       message: "Payment verified and order created successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to verify payment",
//     });
//   }
// };














// import dotenv from "dotenv";
// dotenv.config();

// import TryCatch from "../utils/TryCatch.js";
// import { Cart } from "../models/Cart.js";
// import { Order } from "../models/Order.js";
// import { Product } from "../models/Product.js";
// import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.Stripe_Secret_Key);

// // ==========================================
// // SEND ORDER EMAIL IN BACKGROUND
// // ==========================================

// const sendOrderEmailInBackground = ({
//   email,
//   orderId,
//   products,
//   totalAmount,
// }) => {
//   sendOrderConfirmation({
//     email,
//     subject: "Order Confirmation",
//     orderId,
//     products,
//     totalAmount,
//   }).catch((error) => {
//     console.error("Order confirmation email failed:", error.message);
//   });
// };

// // ==========================================
// // 1. CREATE NEW ORDER - CASH ON DELIVERY
// // ==========================================

// export const newOrderCod = TryCatch(async (req, res) => {
//   const { method, phone, address } = req.body;

//   if (method !== "cod") {
//     return res.status(400).json({ message: "Invalid payment method" });
//   }

//   if (!phone || !address) {
//     return res.status(400).json({
//       message: "Phone and delivery address are required",
//     });
//   }

//   const cart = await Cart.find({
//     user: req.user._id,
//   }).populate({
//     path: "product",
//     select: "title price",
//   });

//   if (!cart.length) {
//     return res.status(400).json({ message: "Cart is empty" });
//   }

//   let subTotal = 0;

//   const items = cart.map((item) => {
//     if (!item.product) {
//       throw new Error("A product in your cart no longer exists");
//     }

//     const quantity = Number(item.quauntity);
//     const price = Number(item.product.price);

//     if (
//       !Number.isInteger(quantity) ||
//       quantity < 1 ||
//       !Number.isFinite(price) ||
//       price <= 0
//     ) {
//       throw new Error("Invalid product price or quantity");
//     }

//     subTotal += price * quantity;

//     return {
//       product: item.product._id,
//       name: item.product.title,
//       price,
//       quauntity: quantity,
//     };
//   });

//   const order = await Order.create({
//     items,
//     method: "cod",
//     user: req.user._id,
//     phone,
//     address,
//     SubTotal: subTotal,
//   });

//   // Update stock
//   await Promise.all(
//     order.items.map((item) =>
//       Product.findByIdAndUpdate(item.product, {
//         $inc: {
//           stock: -item.quauntity,
//           sold: item.quauntity,
//         },
//       })
//     )
//   );

//   // Clear cart
//   await Cart.deleteMany({
//     user: req.user._id,
//   });

//   // Send confirmation email
//   sendOrderEmailInBackground({
//     email: req.user.email,
//     orderId: order._id,
//     products: items,
//     totalAmount: subTotal,
//   });

//   return res.status(201).json({
//     success: true,
//     message: "Order created successfully",
//     order,
//   });
// });

// // ==========================================
// // 2. GET ALL ORDERS OF LOGGED-IN USER
// // ==========================================

// export const getAllOrders = TryCatch(async (req, res) => {
//   const orders = await Order.find({
//     user: req.user._id,
//   }).sort({ createdAt: -1 });

//   return res.json({
//     success: true,
//     orders,
//   });
// });

// // ==========================================
// // 3. GET ALL ORDERS - ADMIN
// // ==========================================

// // export const getAllOrdersAdmin = TryCatch(async (req, res) => {
// //   if (req.user.role !== "admin") {
// //     return res.status(403).json({
// //       message: "You are not admin",
// //     });
// //   }

// //   const orders = await Order.find()
// //     .populate("user", "email")
// //     .sort({ createdAt: -1 });

// //   return res.status(200).json({
// //     success: true,
// //     orders,
// //   });
// // });





// export const getAllOrdersAdmin = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const orders = await Order.find()
//     .populate("user", "email")
//     .sort({ createdAt: -1 });

//   console.log(
//     "ORDER EMAILS:",
//     orders.map((order) => ({
//       orderId: order._id,
//       user: order.user,
//       email: order.user?.email,
//     }))
//   );

//   return res.status(200).json({
//     success: true,
//     orders,
//   });
// });


// // ==========================================
// // 4. GET SINGLE ORDER
// // ==========================================

// export const getMyOrder = TryCatch(async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate("items.product")
//     .populate("user");

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   if (
//     req.user.role !== "admin" &&
//     order.user._id.toString() !== req.user._id.toString()
//   ) {
//     return res.status(403).json({
//       message: "You are not authorized to view this order",
//     });
//   }

//   return res.json(order);
// });

// // ==========================================
// // 5. UPDATE ORDER STATUS - ADMIN
// // ==========================================

// export const updateStatus = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return res.status(404).json({
//       message: "Order not found",
//     });
//   }

//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({
//       message: "Please provide an order status",
//     });
//   }

//   order.status = status;
//   await order.save();

//   return res.json({
//     message: "Order status updated",
//     order,
//   });
// });

// // ==========================================
// // 6. GET DASHBOARD STATISTICS - ADMIN
// // ==========================================

// export const getStats = TryCatch(async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       message: "You are not admin",
//     });
//   }

//   const cod = await Order.countDocuments({
//     method: "cod",
//   });

//   const online = await Order.countDocuments({
//     method: "online",
//   });

//   const products = await Product.find();

//   const data = products.map((product) => ({
//     name: product.title,
//     sold: product.sold,
//   }));

//   return res.json({
//     cod,
//     online,
//     data,
//   });
// });

// // ==========================================
// // 7. CREATE STRIPE CHECKOUT SESSION
// // ==========================================

// export const newOrderOnline = async (req, res) => {
//   try {
//     const { method, phone, address } = req.body;

//     if (method !== "online") {
//       return res.status(400).json({
//         message: "Invalid payment method",
//       });
//     }

//     if (
//       !phone ||
//       !String(phone).trim() ||
//       !address ||
//       !String(address).trim()
//     ) {
//       return res.status(400).json({
//         message: "Phone and delivery address are required",
//       });
//     }

//     if (!process.env.Frontend_Url) {
//       return res.status(500).json({
//         message: "Frontend_Url is missing from server .env",
//       });
//     }

//     const cart = await Cart.find({
//       user: req.user._id,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty",
//       });
//     }

//     let subTotal = 0;

//     const lineItems = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       const quantity = Number(item.quauntity);
//       const price = Number(item.product.price);

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1 ||
//         !Number.isFinite(price) ||
//         price <= 0
//       ) {
//         throw new Error("Invalid product price or quantity");
//       }

//       subTotal += price * quantity;

//       return {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: item.product.title,
//           },
//           unit_amount: Math.round(price * 100),
//         },
//         quantity,
//       };
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.Frontend_Url}/cart`,
//       metadata: {
//         userId: req.user._id.toString(),
//         method: "online",
//         phone: String(phone).trim(),
//         address: String(address).trim(),
//         subTotal: String(subTotal),
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       url: session.url,
//     });
//   } catch (error) {
//     console.error("Error creating Stripe session:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to create payment session",
//     });
//   }
// };

// // ==========================================
// // 8. VERIFY STRIPE PAYMENT AND CREATE ORDER
// // ==========================================

// export const verifyPayment = async (req, res) => {
//   try {
//     const { sessionId } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({
//         message: "Stripe session ID is required",
//       });
//     }

//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return res.status(400).json({
//         message: "Payment has not been completed",
//       });
//     }

//     const metadata = session.metadata || {};
//     const userId = metadata.userId;

//     if (!userId || userId !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You are not authorized to verify this payment",
//       });
//     }

//     const existingOrder = await Order.findOne({
//       paymentInfo: session.id,
//     });

//     if (existingOrder) {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already verified",
//         order: existingOrder,
//       });
//     }

//     if (!metadata.phone || !metadata.address) {
//       return res.status(400).json({
//         message: "Delivery phone or address is missing from payment session",
//       });
//     }

//     const subTotal = Number(metadata.subTotal);

//     if (!Number.isFinite(subTotal) || subTotal <= 0) {
//       return res.status(400).json({
//         message: "Invalid order total in payment session",
//       });
//     }

//     if (session.amount_total !== Math.round(subTotal * 100)) {
//       return res.status(400).json({
//         message: "Payment amount does not match the order total",
//       });
//     }

//     const cart = await Cart.find({
//       user: userId,
//     }).populate("product");

//     if (!cart.length) {
//       return res.status(400).json({
//         message: "Cart is empty. Please contact support if payment was charged.",
//       });
//     }

//     let cartTotal = 0;

//     const items = cart.map((item) => {
//       if (!item.product) {
//         throw new Error("A product in your cart no longer exists");
//       }

//       const quantity = Number(item.quauntity);
//       const price = Number(item.product.price);

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1 ||
//         !Number.isFinite(price) ||
//         price <= 0
//       ) {
//         throw new Error("Invalid product price or quantity");
//       }

//       cartTotal += price * quantity;

//       return {
//         product: item.product._id,
//         name: item.product.title,
//         price,
//         quauntity: quantity,
//       };
//     });

//     if (Math.round(cartTotal * 100) !== session.amount_total) {
//       return res.status(400).json({
//         message: "Cart amount has changed. Please contact support.",
//       });
//     }

//     const order = await Order.create({
//       items,
//       method: "online",
//       user: userId,
//       phone: metadata.phone,
//       address: metadata.address,
//       SubTotal: subTotal,
//       paidAt: new Date(),
//       paymentInfo: session.id,
//     });

//     await Promise.all(
//       order.items.map((item) =>
//         Product.findByIdAndUpdate(item.product, {
//           $inc: {
//             stock: -item.quauntity,
//             sold: item.quauntity,
//           },
//         })
//       )
//     );

//     await Cart.deleteMany({
//       user: userId,
//     });

//     sendOrderEmailInBackground({
//       email: req.user.email,
//       orderId: order._id,
//       products: items,
//       totalAmount: subTotal,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Payment verified and order created successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);

//     return res.status(500).json({
//       message: error.message || "Failed to verify payment",
//     });
//   }
// };






















import dotenv from "dotenv";
dotenv.config();

import TryCatch from "../utils/TryCatch.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.Stripe_Secret_Key);

// ==========================================
// SEND ORDER EMAIL IN BACKGROUND
// ==========================================

const sendOrderEmailInBackground = ({
  email,
  orderId,
  products,
  totalAmount,
}) => {
  sendOrderConfirmation({
    email,
    subject: "Order Confirmation",
    orderId,
    products,
    totalAmount,
  }).catch((error) => {
    console.error("Order confirmation email failed:", error.message);
  });
};

// ==========================================
// 1. CREATE NEW ORDER - CASH ON DELIVERY
// ==========================================

export const newOrderCod = TryCatch(async (req, res) => {
  const { method, phone, address } = req.body;

  if (method !== "cod") {
    return res.status(400).json({
      message: "Invalid payment method",
    });
  }

  if (!phone || !address) {
    return res.status(400).json({
      message: "Phone and delivery address are required",
    });
  }

  const cart = await Cart.find({
    user: req.user._id,
  }).populate({
    path: "product",
    select: "title price",
  });

  if (!cart.length) {
    return res.status(400).json({
      message: "Cart is empty",
    });
  }

  let subTotal = 0;

  const items = cart.map((item) => {
    if (!item.product) {
      throw new Error("A product in your cart no longer exists");
    }

    const quantity = Number(item.quauntity);
    const price = Number(item.product.price);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      throw new Error("Invalid product price or quantity");
    }

    subTotal += price * quantity;

    return {
      product: item.product._id,
      name: item.product.title,
      price,
      quauntity: quantity,
    };
  });

  const order = await Order.create({
    items,
    method: "cod",
    user: req.user._id,
    phone,
    address,
    SubTotal: subTotal,
  });

  // Update stock
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quauntity,
          sold: item.quauntity,
        },
      })
    )
  );

  // Clear cart
  await Cart.deleteMany({
    user: req.user._id,
  });

  // Send confirmation email
  sendOrderEmailInBackground({
    email: req.user.email,
    orderId: order._id,
    products: items,
    totalAmount: subTotal,
  });

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

// ==========================================
// 2. GET ALL ORDERS OF LOGGED-IN USER
// ==========================================

export const getAllOrders = TryCatch(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  return res.json({
    success: true,
    orders,
  });
});

// ==========================================
// 3. GET ALL ORDERS - ADMIN
// ==========================================

export const getAllOrdersAdmin = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not admin",
    });
  }

  const orders = await Order.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });

  console.log(
    "ORDER EMAILS:",
    orders.map((order) => ({
      orderId: order._id,
      user: order.user,
      email: order.user?.email,
    }))
  );

  return res.status(200).json({
    success: true,
    orders,
  });
});

// ==========================================
// 4. GET SINGLE ORDER
// ==========================================

export const getMyOrder = TryCatch(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("user");

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  if (
    req.user.role !== "admin" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      message: "You are not authorized to view this order",
    });
  }

  return res.json(order);
});

// ==========================================
// 5. UPDATE ORDER STATUS - ADMIN
// ==========================================

export const updateStatus = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["Pending", "Shipped", "Delivered"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  // Update only status field.
  // This avoids validating unrelated existing order fields.
  const order = await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
      },
    },
    {
      new: true,
    }
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

// ==========================================
// 6. GET DASHBOARD STATISTICS - ADMIN
// ==========================================

export const getStats = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not admin",
    });
  }

  const cod = await Order.countDocuments({
    method: "cod",
  });

  const online = await Order.countDocuments({
    method: "online",
  });

  const products = await Product.find();

  const data = products.map((product) => ({
    name: product.title,
    sold: product.sold,
  }));

  return res.json({
    cod,
    online,
    data,
  });
});

// ==========================================
// 7. CREATE STRIPE CHECKOUT SESSION
// ==========================================

export const newOrderOnline = async (req, res) => {
  try {
    const { method, phone, address } = req.body;

    if (method !== "online") {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    if (
      !phone ||
      !String(phone).trim() ||
      !address ||
      !String(address).trim()
    ) {
      return res.status(400).json({
        message: "Phone and delivery address are required",
      });
    }

    if (!process.env.Frontend_Url) {
      return res.status(500).json({
        message: "Frontend_Url is missing from server .env",
      });
    }

    const cart = await Cart.find({
      user: req.user._id,
    }).populate("product");

    if (!cart.length) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let subTotal = 0;

    const lineItems = cart.map((item) => {
      if (!item.product) {
        throw new Error("A product in your cart no longer exists");
      }

      const quantity = Number(item.quauntity);
      const price = Number(item.product.price);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price <= 0
      ) {
        throw new Error("Invalid product price or quantity");
      }

      subTotal += price * quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.title,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.Frontend_Url}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        method: "online",
        phone: String(phone).trim(),
        address: String(address).trim(),
        subTotal: String(subTotal),
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);

    return res.status(500).json({
      message: error.message || "Failed to create payment session",
    });
  }
};

// ==========================================
// 8. VERIFY STRIPE PAYMENT AND CREATE ORDER
// ==========================================

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        message: "Stripe session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "Payment has not been completed",
      });
    }

    const metadata = session.metadata || {};
    const userId = metadata.userId;

    if (!userId || userId !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to verify this payment",
      });
    }

    const existingOrder = await Order.findOne({
      paymentInfo: session.id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order: existingOrder,
      });
    }

    if (!metadata.phone || !metadata.address) {
      return res.status(400).json({
        message: "Delivery phone or address is missing from payment session",
      });
    }

    const subTotal = Number(metadata.subTotal);

    if (!Number.isFinite(subTotal) || subTotal <= 0) {
      return res.status(400).json({
        message: "Invalid order total in payment session",
      });
    }

    if (session.amount_total !== Math.round(subTotal * 100)) {
      return res.status(400).json({
        message: "Payment amount does not match the order total",
      });
    }

    const cart = await Cart.find({
      user: userId,
    }).populate("product");

    if (!cart.length) {
      return res.status(400).json({
        message:
          "Cart is empty. Please contact support if payment was charged.",
      });
    }

    let cartTotal = 0;

    const items = cart.map((item) => {
      if (!item.product) {
        throw new Error("A product in your cart no longer exists");
      }

      const quantity = Number(item.quauntity);
      const price = Number(item.product.price);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price <= 0
      ) {
        throw new Error("Invalid product price or quantity");
      }

      cartTotal += price * quantity;

      return {
        product: item.product._id,
        name: item.product.title,
        price,
        quauntity: quantity,
      };
    });

    if (Math.round(cartTotal * 100) !== session.amount_total) {
      return res.status(400).json({
        message: "Cart amount has changed. Please contact support.",
      });
    }

    const order = await Order.create({
      items,
      method: "online",
      user: userId,
      phone: metadata.phone,
      address: metadata.address,
      SubTotal: subTotal,
      paidAt: new Date(),
      paymentInfo: session.id,
    });

    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: -item.quauntity,
            sold: item.quauntity,
          },
        })
      )
    );

    await Cart.deleteMany({
      user: userId,
    });

    sendOrderEmailInBackground({
      email: req.user.email,
      orderId: order._id,
      products: items,
      totalAmount: subTotal,
    });

    return res.status(201).json({
      success: true,
      message: "Payment verified and order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);

    return res.status(500).json({
      message: error.message || "Failed to verify payment",
    });
  }
};

