import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();


dotenv.config({ path: "config/config.env" })



app.get('/', async (req, res) => {
   res.send("<h1>Working Fine</h1>")
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
   })
);


// importing Routes
import order from "./routes/order.js";
import user from "./routes/user.js";

// usign Routes
app.use("/api/v1", order)
app.use("/api/v1", user)


export default app;
