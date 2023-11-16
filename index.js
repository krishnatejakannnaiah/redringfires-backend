const express = require("express");
const errorHandler = require("./middleware/errorHandler");
// const connectDb = require("./config/dbConnection");
// const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv').config();
const cors = require('cors');


// connectDb();

const app = express();


const port = process.env.PORT || 5005;
app.use(cors())

app.use(express.json());
// app.use("/api/contacts", require('./routes/contactroute'));
// app.use("/api/users", require('./routes/userRoutes'));
// app.use("/api/posts", require('./routes/postRoutes'));
// app.use("/api/claps", require('./routes/clapRoutes'));
app.use("/api", require("./routes/scrapesRoutes"));

app.use(errorHandler);

app.get('/', (req,res) => {
    res.send({title: 'RedRingFires'})
})


app.listen(port, () => {
    console.log(`server is running on  ${port}`);
});
