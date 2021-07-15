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

async function hasPermission(userId, itemId) {
    let user = await DBM.getUserById(userId);
    console.log(user[0].IsAdmin);
    if(user[0].IsAdmin)
        return 1;
    if(userId==itemId)
        return 1;
    return 0;
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
        realUsersCount: await DBM.getRealUserCount(),
    };
    res.render("../views/admin.ejs", { data });
});

app.get("/user", redirectLogin, async (req, res)=>{
    let user = await DBM. getPublicUserDataById(req.session.userId);
    let data = await DBM.getRelevantDataByUserId(req.session.userId);
    data.users=await DBM.getAllUsers();
    data.firstName = user.FirstName;
    data.lastName = user.LastName;
    data.userId = req.session.userId;
    data.allTeams = await DBM.getAllTeams();
    data.allTasks = await DBM.getAllTasks();
    res.render("../views/user.ejs", { data } );
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

app.post("/delete-project/:id", async(req,res) =>{
    const { id } = req.params;
    const project = await DBM.getProjectById(id);
    if(await hasPermission(req.session.userId,project.CreatorId))
        await DBM.deleteProject(id);
    res.sendStatus(204);
});

app.get("/get-users-teams/:id", async(req,res)=>{
    const { id } = req.params;

    const teams = await DBM.getAllTeamsByProject(id);
    res.send(teams)
});

app.post("/create-project/:title/:description", async (req,res)=>{
    const project = { title: req.params.title, description: req.params.description, creatorId: req.session.userId };
    await DBM.createProject(project);
    let user = await DBM.getUserById(req.session.userId);
    console.log(user);
    if(user[0].IsAdmin) {
        res.redirect("/admin");
    } else {
        res.redirect("/user");
    }
});

app.post("/update-project", async(req,res)=>{
    const newProject = req.body;
    console.log(newProject);
    newProject.teams = newProject.teams.split(",");
    newProject.tasks = newProject.tasks.split(",");
    let project=await DBM.getProjectById(newProject.projectId);
    if(await hasPermission(req.session.userId,project.CreatorId)) {
        await DBM.updateProject(newProject.projectId,newProject,req.session.userId);
        console.log(project);
        if(newProject.teams)
            await DBM.addTeamsToProject(newProject.teams, newProject.projectId);
        if(newProject.tasks)
            await DBM.addTasksToProject(newProject.tasks, newProject.projectId);
    }
    res.redirect("/user");
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
    let task = await DBM.getTaskById(id);
    console.log(task.CreatorId)
    console.log(req.session.userId);
    if(await hasPermission(req.session.userId, task.CreatorId)) {
        await DBM.deleteTask(id);
    }
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

app.post("/update-user", async(req,res)=>{
    const newUser = req.body;
    await DBM.updateUser(parseInt(newUser.userId),newUser,req.session.userId);
    res.redirect("/admin");
})

app.post("/update-team",async(req,res)=>{
    let newTeam = req.body;
    newTeam.users=newTeam.users.split(",");
    console.log(newTeam);
    await DBM.updateTeam(newTeam.teamId,newTeam.title,req.session.userId);
    await DBM.updateUsersInTeam(newTeam.users,newTeam.teamId);
    res.redirect("/admin");
})

app.post("/update-task", async(req,res)=>{
    let newTask = req.body;
    console.log(newTask);
    const task = await DBM.getTaskById(newTask.taskId);
    if(await hasPermission(req.session.userId,task.CreatorId)) {
        await DBM.updateTask(newTask.taskId,newTask,req.session.userId);
    }
    res.redirect("/admin");
})

app.post("/create-worklog",async(req,res)=>{
    let worklog = req.body;
    worklog.creatorId=req.session.userId;
    await DBM.createWorklog(worklog);
    console.log(worklog);
    res.redirect("/admin");
})

app.post("/delete-worklog/:id",async(req,res)=>{
    let id = req.params.id;
    let log = await DBM.getWorklogById(id);
    if(await hasPermission(req.session.userId,log.CreatorId))
        await DBM.deleteWorklog(id);
    res.sendStatus(204);
})

app.post("/update-worklog", async (req,res)=>{
    let worklog = req.body;
    worklog.worklogId=parseInt(worklog.worklogId);
    let log = await DBM.getWorklogById(worklog.worklogId);
    if(await hasPermission(req.session.userId),log.CreatorId) {
        worklog.time=parseInt(worklog.time);
        console.log(worklog);
        await DBM.updateWorklog(worklog.worklogId,worklog);
    }
    res.redirect("/admin");
})