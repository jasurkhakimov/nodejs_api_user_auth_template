require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const db = require("./models/index.js");

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Use /api/v1" });
});


const checkToken = (req, res, next) => {
    const db = require("./models/index.js");
    const Users = db.Users;
    if ( req.path == '/api/v1/users/auth') return next();

    console.log("token: ",req.headers.authorization, req.path);
    // if ()
    Users.findOne({where: {token: req.headers.authorization}}).then(data => {
        if (data) {
            next();
        } else {
            res.sendStatus(401);
        }
    })
    
    // next();
}


app.all('*', checkToken);

require("./routes/v1/users.route")(app)

// set port, listen for requests
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});