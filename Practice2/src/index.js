const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const authRouters = require("./routes/auth.route");
const { PORT, MONGODB_URL, ORIGIN } = require("../config");
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require("../errors");

const app = express();

// middleware
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: ORIGIN, // currently on 5000 port, need to change to frontend address
    optionsSuccessStatus: 200,
  })
);

// log only 4xx and 5xx messages to the console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

//log all requests to access.log file
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "assess.log"), {
      flags: "a",
    }),
  })
);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

// routes middleware
app.use("/api", authRouters);

// page not found error handling  middleware
app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: API_ENDPOINT_NOT_FOUND_ERR,
  };
  next(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.response ? (err.response.status || 500) : (err.status || 500);
  const message = err.response ? (err.response.data.message || 500) : (err.message || SERVER_ERR);
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});


// connect to database and run server
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connect successfully.");
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Connection failed.");
    console.log(e);
  });
