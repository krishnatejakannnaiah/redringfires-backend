const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv').config();
const cors = require('cors');


connectDb();

const app = express();


const port = process.env.PORT || 5005;
app.use(cors())

app.use(express.json());
app.use("/api/contacts", require('./routes/contactroute'));
app.use("/api/users", require('./routes/userRoutes'));
app.use("/api/posts", require('./routes/postRoutes'));
app.use("/api/claps", require('./routes/clapRoutes'));

app.use(errorHandler);

app.get('/', (req,res) => {
    res.send({title: 'RedRingFires'})
})


app.listen(port, () => {
    console.log(`server is running on  ${port}`);
});



// require('dotenv').config();

// const express = require('express')
// const mongoose = require('mongoose')
// const Book = require("./models/books");

// const app = express()
// const PORT = process.env.PORT || 3000

// mongoose.set('strictQuery', false);
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// }

// //Routes go here
// app.get('/', (req,res) => {
//     res.send({ title: 'Books' });
// })

// app.get('/books', async (req,res)=> {

//   const book = await Book.find();

//   if (book) {
//     res.json(book)
//   } else {
//     res.send("Something went wrong.");
//   }
  
// });

// app.get('/add-note', async (req,res) => {
//   try {
//     await Book.insertMany([
//       {
//         title: "Sons Of Anarchy",
//         body: "Body text goes here...",
//       },
//       {
//         title: "Games of Thrones",
//         body: "Body text goes here...",
//       }
//     ]);
//     res.json({"Data":"Added"})
//   } catch (error) {
//     console.log("err", + error);
//   }
// })

// //Connect to the database before listening
// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("listening for requests");
//     })
// })