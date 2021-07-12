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
app.use("/styles", express.static("./styles"));

app.get("/admin", redirectLogin, async (req, res)=>{

    user = await DBM. getPublicUserDataById(req.session.userId);
    let data = {
        firstName: user.FirstName,
        lastName: user.LastName,
        projects: await DBM.getAllProjects(),
        users: await DBM.getAllUsers(),
        tasks: await DBM.getAllTasks(),
        worklogs: await DBM.getAllWorklogs(),
        teams: await DBM.getAllTeams()
    };
    res.render("../views/admin.ejs", { data });
});

app.get("/user", redirectLogin, (req, res)=>{
    res.render("../views/user.ejs");
});

// app.get("*", (req,res)=>{
//     res.render("../views/main.ejs");
// });

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

// app.post("/delete-project", async (req,res)=>{
//     const { id } = req.body;
//     await DBM.deleteProject(id)
//     res.redirect("/admin");
// });

app.post("/delete-project/:id", async(req,res) =>{
    const { id } = req.params;
    await DBM.deleteProject(id);
});

app.get("/get-users-teams/:id", async(req,res)=>{
    const { id } = req.params;

    const teams = await DBM.getAllTeamsByProject(id);
    res.send(teams)
});

app.post("/create-project/:title/:description", async (req,res)=>{
    const project = { title: req.params.title, description: req.params.description, creatorId: req.session.userId };
    await DBM.createProject(project);
});

app.post("/update-project", async(req,res)=>{
    const newProject = req.body;
    console.log(newProject);
});