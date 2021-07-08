const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser")
const { sessionConfig } = require("./src/config");
const { DBM } = require("./src/DB");
const app = express();

app.use(session({
    name: sessionConfig.name,
    resave: false,
    saveUninitialized: false,
    secret: sessionConfig.secret,
    cookie: {
        maxAge: sessionConfig.maxAge,
        sameSite: true,
        secure: false
    }
}));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(3000, ()=>{
    console.log("Server started");
});

// Views //

app.get("/", (req, res)=>{
    res.render("../views/main.ejs");
})

app.get("/admin", (req, res)=>{
    res.render("../views/admin.ejs");
})

app.get("/user", (req, res)=>{
    res.render("../views/user.ejs");
})

app.get("*", (req,res)=>{
    res.render("../views/main.ejs");
});

// Main api functionality //
app.post("/login", async (req,res, next)=>{
    const {
        username,
        password
    } = req.body;

    const userId = await DBM.validateUser(username,password);

    if(userId) {
        req.session.userId = userId;
        const { isAdmin } = await DBM.getPublicUserDataById(userId);
        if(isAdmin) {
            res.redirect("/admin");
        } else {
            res.redirect("/user");
        } 
    } else {
        res.redirect("/");
    }
});