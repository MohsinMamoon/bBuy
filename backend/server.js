const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017/bubuy";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established succesfully'); 
})
.catch(err => console.log("Could not connect to database"));

const accountsRouter = require('./routes/user');
const productsRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const ratingRouter = require('./routes/rating');

app.use('/order', orderRouter);
app.use('/account', accountsRouter);
app.use('/product', productsRouter);
app.use('/rating', ratingRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
