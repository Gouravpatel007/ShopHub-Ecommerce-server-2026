// import mongoose from "mongoose";

// const schema = new mongoose.Schema({

//     items:[
//         {
//           quauntity:{
//               type:Number,
//               required: true,
//           },

//           product:{
//               type: mongoose.Schema.Types.ObjectId,
//               ref:"Product",
//               required: true,
//           }
//         },
//     ],

//     method: {
//         type: String,
//         required:true,
//     },

//     paymentInfo: {
//         type: String,
//     },

//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//     },

//     phone: {
//         type: Number,
//         required: true,
//     },

//     address: {
//         type: String,
//         required: true,
//     },

//     status: {
//         type: String,
//         default: "Pending",
//     },

//     paidAt: {
//         type: String,
//     },

//     SubTotal: {
//         type: Number,
//         required: true,
//     },

//     createdAt: {
//         type: Date,
//         default: Date.now(),
//     },

// });

// export const Order = mongoose.model("Order", schema);

















// import mongoose from "mongoose";

// const schema = new mongoose.Schema(
//   {
//     items: [
//       {
//         quantity: {
//           type: Number,
//           required: true,
//         },

//         // Keep the existing spelling for compatibility
//         // with your controller and existing order data.
//         quauntity: {
//           type: Number,
//           required: true,
//         },

//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },

//         name: {
//           type: String,
//         },

//         price: {
//           type: Number,
//         },
//       },
//     ],

//     method: {
//       type: String,
//       required: true,
//     },

//     paymentInfo: {
//       type: String,
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // FIX: Previously this was "Product"
//       required: true,
//     },

//     phone: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       default: "Pending",
//     },

//     paidAt: {
//       type: Date,
//     },

//     SubTotal: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Order = mongoose.model("Order", schema);










import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    items: [
      {
        quauntity: {
          type: Number,
          required: true,
        },

        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
        },

        price: {
          type: Number,
        },
      },
    ],

    method: {
      type: String,
      required: true,
    },

    paymentInfo: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },

    paidAt: {
      type: Date,
    },

    SubTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", schema);
