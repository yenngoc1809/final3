var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const expHbs = require('express3-handlebars');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const redis = require('redis');


/* Routes */
var userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const categoriesRouter = require('./routes/categories');
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/authentication');

/* App Config */
dotenv.config();
var app = express();
const port = process.env.PORT || 3000;

//const redisClient = redis.createClient();


/* Middlewares */
app.use(express.json()); // Chỉnh sửa ở đây
app.use(express.urlencoded({ extended: false })); // Chỉnh sửa ở đây
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

/* View Engine Setup */
// app.set('views', path.join(__dirname, 'views'));
// app.engine('hbs', expHbs({ defaultLayout: 'layout', extname: '.hbs' }));
// app.set('view engine', 'hbs');

/* MongoDB connection */
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

/* API Routes */
app.use('/api/authentication', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoriesRouter);

/* Parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));

/* Parse application/json */
app.use(bodyParser.json());

/* Catch 404 and forward to error handler */
app.use(function (req, res, next) {
  next(createError(404));
});

/* Error handler */
// app.use(function (err, req, res, next) {
//   // Set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // Render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

/* Start the server */
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Set timeout to 2 minutes
server.setTimeout(4 * 60 * 1000);

module.exports = app;
