const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.routes");
const userTaskRoute = require("./routes/userTasks.routes");
const userTaskCategoriesRoute = require("./routes/userTasksCategories.routes");
require("dotenv").config();

app.set("port", process.env.PORT || 3000);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://todolistapp-frontend.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoute);
app.use("/api", userTaskRoute);
app.use("/api", userTaskCategoriesRoute);

module.exports = app;
