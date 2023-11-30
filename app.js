import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();


dotenv.config({ path: "config/config.env" })

app.use(
   cors({
      credentials: true,
      origin: "https://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
   })
);

app.get('/', async (req, res) => {
   res.send("<h1>Working Fine</h1>")
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());







import path from "path";
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "./client/build")))    // deploy only

app.get('/', async (req, res) => {
   res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// app.get('/', async (req, res) => {
//    res.send("<h1>Working Fine</h1>")
// });




// importing Routes
import order from "./routes/order.js";
import user from "./routes/user.js";

// usign Routes
app.use("/api/v1", order)
app.use("/api/v1", user)


export default app;
