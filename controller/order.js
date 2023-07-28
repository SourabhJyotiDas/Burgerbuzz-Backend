import Order from "../models/order.js";
import Payment from "../models/Payment.js";
import Razorpay from "razorpay";
const instance = new Razorpay({
   key_id: "rzp_test_hB7LIUIZZnALWu",
   key_secret: "euTYteSUeeq1zvOZEtY4eSGz",
});
import crypto from "crypto";



export const createOrder = async (req, res) => {
   try {
      const {
         shippingInfo,
         orderItems,
         paymentMethod,
         itemsPrice,
         taxPrice,
         shippingCharges,
         totalAmount,
      } = req.body;

      const user = req.user._id;

      const orderOptions = {
         shippingInfo,
         orderItems,
         paymentMethod,
         itemsPrice,
         taxPrice,
         shippingCharges,
         totalAmount,
         user,
      };

      await Order.create(orderOptions);

      res.status(201).json({
         success: true,
         message: "Order Placed Successfully via Cash On Delivery",
      });

   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      })
   }
}


export const placeOrderOnline = async (req, res, next) => {
   try {
      const { shippingInfo, orderItems, paymentMethod, itemsPrice, taxPrice, shippingCharges, totalAmount, } = req.body;

      const user = req.user._id;

      const orderOptions = { shippingInfo, orderItems, paymentMethod, itemsPrice, taxPrice, shippingCharges, totalAmount, user, };

      const options = {
         amount: Number(totalAmount) * 100,
         currency: "INR",
      };

      const order = await instance.orders.create(options);

      res.status(201).json({
         success: true,
         order,
         orderOptions,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      })
   }
};


export const paymentVerification = async (req, res, next) => {
   try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderOptions, } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
         .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
         .update(body)
         .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
         const payment = await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
         });

         await Order.create({
            ...orderOptions,
            paidAt: new Date(Date.now()),
            paymentInfo: payment._id,
         });

         res.status(201).json({
            success: true,
            message: `Order Placed Successfully. Payment ID: ${payment._id}`,
         });
      } else {
         return res.status(500).json({
            success: false,
            message: "Payment Failed"
         })
      }
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      })
   }
};


export const getMYOrders = async (req, res) => {
   try {
      const orders = await Order.find({
         user: req.user._id,
      }).populate("user", "name");

      res.status(200).json({
         success: true,
         orders,
      });
   } catch (error) {
      res.status(400).json({
         success: false,
         message: error.message
      });
   }
}


export const getOrderDetails = async (req, res, next) => {
   try {
      const order = await Order.findById(req.params.id).populate("user", "name avatar");

      if (!order) {
         return res.status(400).json({
            success: true,
            message: "Order not found"
         });
      }

      res.status(200).json({
         success: true,
         order,
      });
   } catch (error) {
      res.status(200).json({
         success: true,
         message: error.message
      });
   }
};

export const getAdminOrders = async (req, res, next) => {
   const orders = await Order.find().populate("user", "name");

   res.status(200).json({
      success: true,
      orders,
   });
};


export const processOrder = async (req, res) => {
   const order = await Order.findById(req.params.id);

   if (!order) {
      return res.status(404).json({
         success: true,
         message: "Invalid Order Id"
      })
   }

   if (order.orderStatus === "Preparing") {
      order.orderStatus = "Shipped";
   }

   else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliveredAt = new Date(Date.now());

   } else if (order.orderStatus === "Delivered")
      return res.status(400).json({
         success: true,
         message: "Food already deliverd"
      })

   await order.save();

   res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
   });
};