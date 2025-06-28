const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");

require("dotenv").config();

const app = express()
const port = 3000

// Connect to DB
mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => console.log("Connected To MongoDB Instance"))

// import routes
const authRoutes = require("./routes/auth");
const dreamRoutes = require("./routes/dreams");

// middleware
app.use(cors())
app.use(express.json())

// use routes middleware
app.use("/api", authRoutes);
app.use("/api", dreamRoutes);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
