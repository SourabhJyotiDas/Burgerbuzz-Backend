import { createOrder, getMYOrders, getOrderDetails, getAdminOrders, processOrder, placeOrderOnline, paymentVerification } from "../controller/order.js";

import  express  from "express";
import  { isAuthenticated, isAdmin } from "../middlewares/Auth.js";


const router = express.Router();


router.route("/createorder").post(isAuthenticated, createOrder);

router.route("/createorderonline").post(isAuthenticated, placeOrderOnline);

router.route("/paymentverification").post(isAuthenticated, paymentVerification);

router.route("/myorders").get(isAuthenticated, getMYOrders);

router.route("/order/:id").get(isAuthenticated, getOrderDetails);

// add ADMIN  athorised
router.route("/admin/orders").get(isAuthenticated, isAdmin, getAdminOrders);

router.route("/admin/order/:id").get(isAuthenticated, isAdmin, processOrder);



export default router;