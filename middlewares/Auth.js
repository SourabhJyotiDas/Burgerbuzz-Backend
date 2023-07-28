
import user from "../models/user.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = async (req, res, next) => {
   try {
      const { token } = req.cookies;

      if (!token) {
         return res.status(400).json({
            success: false,
            message: "Please Login First"
         })
      }

      const decodedData = await jwt.verify(token, process.env.JWT_SECRET)
      req.user = await user.findById(decodedData._id);

      next();
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      })
   }
}

export const isAdmin = (req, res, next) => {
   if (req.user.role !== "admin") {
      return res.status(400).json({
         success: false,
         message: "Look like You are not a admin"
      })
   }
   next();
};