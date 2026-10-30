// import express from "express";
// import { isAuth } from "../middlewares/isAuth.js";
// import { addAddress, deleteAddress, getAllAddress, getSingleAddress } from "../controller/address.js";

// const router = express.Router();
// router.post("/address/new", isAuth, addAddress);
// router.post("/address/all", isAuth, getAllAddress);
// router.get("/address/:id", isAuth, getSingleAddress);
// router.delete("/address/:id", isAuth, deleteAddress);

// export default router;







import express from "express";
import { isAuth } from "../middlewares/isAuth.js";

import {
  addAddress,
  deleteAddress,
  getAllAddress,
  getSingleAddress,
} from "../controller/address.js";

const router = express.Router();

// Add new address
router.post("/address/new", isAuth, addAddress);

// Get all addresses
router.get("/address/all", isAuth, getAllAddress);

// Get single address
router.get("/address/:id", isAuth, getSingleAddress);

// Delete address
router.delete("/address/:id", isAuth, deleteAddress);

export default router;
