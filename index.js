import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import userRoutes from "./src/routes/userRoutes";
import postRoutes from "./src/routes/postRoutes";

const app = express();

const PORT = process.env.PORT || 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose
    .connect("mongodb://localhost:27017/chatterbox-db", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connection established successfully"))
    .catch(err => console.log(err));

// bodyparser setup
// allow app to parse json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// jwt setup
// check if token exists
app.use(( req, res, next ) => {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], 'userKey', (err, decode) => {
            if(err) req.user = undefined;
            req.user = decode;
            next();
        })
    } else {
        req.user = undefined;
        next();
    }
})

// serving static files
app.use(express.static("public"));

userRoutes(app);
postRoutes(app);

app.get("/", (req, res) => {
    res.send('Welcome to ChatterBox, a simple chat application built with Node and express');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))