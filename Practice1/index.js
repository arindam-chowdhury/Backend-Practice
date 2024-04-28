const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const ProductRoute = require("./routes/products.route");

const app = express();
app.use(express.json());

// mongoDB username: arindam
// mongoDB password: x6UJ0uSrwsCykf1J

//route to /api/products
app.use("/api/products", ProductRoute);

app.get("/", (req, res) => {
  res.send("Working Properly.");
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connect successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed.");
  });
