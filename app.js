var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var usersRouter = require('./routes/users');
var barbies = require("./routes/barbies");

const connectDB = require('./server/database/connection');

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//mongodb connection
connectDB()

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/barbies', barbies);

app.use(express.static('client/build'));
  app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});

module.exports = app;
