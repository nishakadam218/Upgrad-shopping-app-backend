const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();
dotenv.config({ path: "./config.env" })
const PORT = process.env.PORT;
require("./db/connection");
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");



app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);


//middleware for error
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`server is runing on ${PORT}`)
})