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
        teams: await DBM.getAllTeams(),
        realUsersCount: await DBM.getRealUserCount()
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
    newProject.teams = newProject.teams.split(",");
    newProject.tasks = newProject.tasks.split(",");
    
    await DBM.updateProject(newProject.projectId,newProject,req.session.userId);
    await DBM.addTeamsToProject(newProject.teams, newProject.projectId);
    await DBM.addTasksToProject(newProject.tasks, newProject.projectId);

    res.redirect("/admin");
});

app.get("/get-team-users/:teamId", async(req,res)=>{
    const  teamId  = req.params.teamId;

    const users = await DBM.getUsersInTeam(teamId);
    let usersNames=[];
    for(const user of users) {
        usersNames.push(await DBM.getUserById(user.UserId));
    }
    res.send(usersNames);
})
// /tasks
// POST   => CREATE
// PUT    => UPDATE
// DELETE => DELETE
// GET    => GET => return all items
// GET /tasks/:id => GET concrete item
app.post("/create-task", async (req,res)=>{
    const task = req.body;
    task.creatorId=req.session.userId;
    await DBM.createTask(task);
    res.redirect("/admin");
});

app.post("/delete-task/:id", async (req,res)=>{
    const id = req.params.id;
    await DBM.deleteTask(id);
    res.sendStatus(204);
})

app.post("/create-team", async(req,res)=>{
    let { title, users} = req.body
    users=users.split(",");
    await DBM.createTeam({title, creatorId: req.session.userId});
    let team = await DBM.getTeamByTitle(title);
    console.log(team);
    for(let item of users) {
        item = parseInt(item);
        await DBM.addUserToTeam(item,team.Id);
    }
    res.redirect("/admin");
})

app.post("/delete-team/:id", async(req,res)=>{
    let { id } = req.params;
    await DBM.deleteTeam(id);
    res.sendStatus(204);
})

app.post("/create-user", async(req,res)=>{
    let user = req.body;
    user.isAdmin=parseInt(user.isAdmin);
    user.creatorId=req.session.userId;
    await DBM.createUser(user);
    res.redirect("/admin");
})

app.post("/delete-user/:id", async(req,res)=>{
    let id = req.params.id;
    await DBM.deleteUser(id);
    res.sendStatus(204);
})