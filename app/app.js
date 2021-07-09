const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser")
const { sessionConfig } = require("./src/config");
const { DBM } = require("./src/DB");
const app = express();

function getPath(IsAdmin) {
    if(IsAdmin)
        return "/admin";
    return "/user";
}

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

// Middlewares //
const redirectLogin = async (req,res,next) =>{
    if(!req.session.userId)
        res.redirect("/");
    else {
        const user = await DBM.getPublicUserDataById(req.session.userId);
        const IsAdmin = user.IsAdmin;
        if(req.url === getPath(IsAdmin))
            next();
        else
            res.redirect(getPath(IsAdmin));
    }
}

// End of middlewares //

// Views //

app.get("/", (req, res)=>{
    res.render("../views/main.ejs");
});

app.use("/photos", express.static("./photos"));

app.get("/admin", redirectLogin, async (req, res)=>{

    user = await DBM. getPublicUserDataById(req.session.userId);
    let data = {
        firstName: user.FirstName,
        lastName: user.LastName
    };
    res.render("../views/admin.ejs", {data: data});
});

app.get("/user", redirectLogin, (req, res)=>{
    res.render("../views/user.ejs");
});

app.get("/logout", (req,res)=>{
    res.send(`
    logout
    <form method="post" action="/logout">
    <button>Submit</button>
    </form>
    `);
});

app.get("*", (req,res)=>{
    res.render("../views/main.ejs");
});

// End of views //

// Main api functionality //
app.post("/login", async (req,res, next)=>{
    const {
        username,
        password
    } = req.body;

    const userId = await DBM.validateUser(username,password);

    if(userId) {
        req.session.userId = userId;
        const  { IsAdmin }  = await DBM.getPublicUserDataById(userId);
        console.log(getPath(IsAdmin));
        res.redirect(getPath(IsAdmin));
    } else {
        res.redirect("/");
    }
});

app.post("/logout", (req, res)=>{
    req.session.destroy(err=>{
        if(err)
            console.log(err);
        res.clearCookie(sessionConfig.name);
        res.redirect("/");
    });
});