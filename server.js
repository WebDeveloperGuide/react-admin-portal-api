import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import registerRoutes from './app/routes/register.routes.js';
import loginRoutes from './app/routes/login.routes.js';
import UserModel from "./app/models/user.model.js";
import productRoutes from './app/routes/product.routes.js';

const app = express();

// read value from .env file
dotenv.config();

const urlAllowed = process.env.NODE_ENV === 'production' ? process.env.REQUEST_FROM_URL_PROD : process.env.REQUEST_FROM_URL_DEV;

var corsOptions = {
  origin: urlAllowed
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/api/login" || req.path == "/api/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/products', productRoutes);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to admin application." });
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;

const DB_CONNECTION = process.env.NODE_ENV === 'production' ? process.env.CONNECTION_URL_PRODUCTION : process.env.CONNECTION_URL_DEVELOPMENT; 

mongoose.connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));