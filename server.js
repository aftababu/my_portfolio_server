const express = require("express");
const cors = require("cors");
const bodyParser  = require("body-parser");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 4200;
require("dotenv").config({ path: "config/config.env" });
const app = express();

const connectDatabase = require("./config/database");
const errorMiddleware = require("./utils/error");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const corsOption = {
  origin : "https://dashing-dango-1db5d6.netlify.app",
  credentials: true,
};
connectDatabase();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(fileUpload());
// Middleware for error

app.use(errorMiddleware);

const projects = require("./routes/projectsRoutes");
const admin = require("./routes/adminRoutes");

app.use("/api/v1", projects);
app.use("/api/admin", admin);

app.listen(port, () => console.log(`Server started on port ${port}`));
