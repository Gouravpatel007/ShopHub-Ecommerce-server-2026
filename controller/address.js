// import { Address } from "../models/Address.js";
// import TryCatch from "../utils/TryCatch.js";

// export const addAddress = TryCatch(async(req,res)=>{

//     const {address, phone} = req.body;

//     await Address.create({
//         address,
//         phone,
//         user: req.user._id,
//     });

//     res.status(201).json({
//         message: "Address created"
//     });
// });


// export const getAllAddress = TryCatch(async(req,res)=>{
//     const allAddress = await Address.find({ user: req.user._id });

//     res.json(allAddress);

// });

// export const getSingleAddress = TryCatch(async(req,res)=>{

//     const address = await Address.findById(req.params.id); 

//     res.json(address);

// });


// export const deleteAddress = TryCatch(async(req,res)=>{

//     const address = await Address.findOne({
//         _id: req.params.id,
//         user: req.user._id,
//     });

//     await address.deleteOne();

//     res.json({
//         message:"address Deleted",
//     });
// });
















import { Address } from "../models/Address.js";
import TryCatch from "../utils/TryCatch.js";

// ==========================================
// ADD NEW ADDRESS
// ==========================================

export const addAddress = TryCatch(async (req, res) => {
  const { address, phone } = req.body;

  if (!address || !phone) {
    return res.status(400).json({
      success: false,
      message: "Address and phone number are required",
    });
  }

  const cleanAddress = String(address).trim();
  const cleanPhone = String(phone).trim();

  if (!cleanAddress || !cleanPhone) {
    return res.status(400).json({
      success: false,
      message: "Address and phone number cannot be empty",
    });
  }

  if (!/^\d{10}$/.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 10-digit phone number",
    });
  }

  const newAddress = await Address.create({
    address: cleanAddress,
    phone: cleanPhone,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Address created successfully",
    address: newAddress,
  });
});

// ==========================================
// GET ALL ADDRESSES OF LOGGED-IN USER
// ==========================================

export const getAllAddress = TryCatch(async (req, res) => {
  const allAddress = await Address.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    addresses: allAddress,
  });
});

// ==========================================
// GET SINGLE ADDRESS
// ==========================================

export const getSingleAddress = TryCatch(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  res.status(200).json({
    success: true,
    address,
  });
});

// ==========================================
// DELETE ADDRESS
// ==========================================

export const deleteAddress = TryCatch(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  await address.deleteOne();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
