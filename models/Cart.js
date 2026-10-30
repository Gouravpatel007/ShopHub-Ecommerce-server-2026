import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    quauntity:{
        type: Number,
        require: Number,
    },

    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

})

// export const Cart = mongoose.model("Cart", cartSchema);

export const Cart =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);