require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 5000;

console.info('\x1b[33m%s\x1b[0m', "Running environment as " + process.env.NODE_ENV);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// protected routes
app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));

app.listen(PORT, () => console.log('\x1b[32m%s\x1b[0m', `Server running on port ${PORT}`));