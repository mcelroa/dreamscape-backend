const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

// import routes
const authRoutes = require("./routes/auth");

// middleware
app.use(cors())

// use routes middleware
app.use("/api", authRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
