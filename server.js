const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbconnection");
const dotenv = require('dotenv').config();

connectDb();

const app = express();


const port = process.env.PORT || 5005;
app.use(express.json());
app.use("/api/contacts", require('./routes/contactroute'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is running on  ${port}`);
});