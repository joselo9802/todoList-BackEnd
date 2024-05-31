const mongoose = require("mongoose");

const URI = process.env.BD;


mongoose
  .connect(URI, {
    useNewUrlParser: true,
  })
  .then(console.log("BD connected successfuly"))
  .catch("Error connecting to BD");
