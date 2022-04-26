const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();
dotenv.config({ path: "./config.env" })
const PORT = process.env.PORT;
require("./db/connection");
const errorMiddleware = require("./middleware/error")
app.use(cors());
app.use(express.json());

//route imports
// const authRoute = require("./routes/auth");
const product = require("./routes/productRoute");;


app.use("/api/v1", product);
// app.use("/api", authRoute);

//middleware for error
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`server is runing on ${PORT}`)
})