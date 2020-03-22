const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const assert = require('assert');
const redis = require('redis');
const responseTime = require('response-time');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const indexRouter = require('./routes/index');
const statesRouter = require('./routes/states');

/* client = redis.createClient();
client.on('error', (err) => {
  console.log('Error ' + err);
});*/

MongoDB = null;
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-h6o7s.gcp.mongodb.net/test?retryWrites=true&w=majority&replicaSet=rs`;
MongoClient.connect(uri, {
  poolSize: 10,
  useUnifiedTopology: true,
}, (err, db) => {
  assert.equal(null, err);
  MongoDB = db;
});

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.use(responseTime());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/states', statesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
