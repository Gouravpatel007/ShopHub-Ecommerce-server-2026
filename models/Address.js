// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({

//     address:{
//         type: String,
//         required:true,
//     },

//     phone:{
//         type: Number,
//         required:true,
//     },

//     user:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
// })


// export const Address = mongoose.model("Address",addressSchema);











import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model("Address", addressSchema);
