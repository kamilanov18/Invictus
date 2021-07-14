const sql = require("mssql/msnodesqlv8");
const { config } = require("./config");
const colors = require("colors");


// ඞ sus
/**
 * Static class used in various data validations throughout the app
 * @author Kristian Milanov
 */
class Validations {
    static #pattern

    /**
     * Validates the given name by checking if it starts with a capital letter, or wether it contains any special characters or numbers. Throws an error if a vulnerability is found
     * @param {string} name -The name given by the user 
     * @author Kristian Milanov
     * @returns {void}
     */
    static validateName(name) {

        if(!name)
            throw new Error("Names can't be empty!");
        
        this.#pattern=/^[a-z]/;
        if(this.#pattern.test(name))
            throw new Error("Names have to start with a capital letter!");

        this.#pattern=/[0-9]/;
        if(this.#pattern.test(name))
            throw new Error("Names can't contain numbers!");

        this.#pattern=/[!@$%^&*()_+=|\/\\\[\]{}#?<>;:~]/;
        if(this.#pattern.test(name))
            throw new Error("Names can't contain special symbols other than: ' \" ` , ");
    }

    /**
     * Validates the length of the title, as it can not be empty, nor can it be more than 50 characters
     * @param {string} title - Title of the project / task
     * @author Kristian Milanov
     * @returns {void}
     */
    static validateTitle(title) {
        if(!title)
            throw new Error("Titles can't be empty!");

        if(title.length <= 50 && title.length<=0)
            throw new Error("Titles have to be less than 50 characters!");
    }

    /**
     * Validates the length of the description, as it can not be empty, nor can it be more than 50 characters
     * @param {string} desc - Description of the task
     * @author Kristian Milanov
     * @returns {void}
     */
    static validateDescription(desc) {
        if(!desc)
            throw new Error("Descriptions can't be empty!");

        if(desc.length <= 250 && desc.length<=0)
            throw new Error("Titles have to be less than 250 characters");
    }

    /**
     * Validates wether the supplied information containes only numbers
     * @param {*} data - Data to be checked
     * @returns {void}
     */
    static validateNumericability(data) {
        this.#pattern = /^[0-9]+$/;
        if(!this.#pattern.test(data))
            throw new Error("This field can only contain numbers");
    }
}

/**
 * Static class which logs any events from DB handling, wether they are simple information, or a critical error
 * @author Kristian Milanov
 */
class Log {

    /**
     * Static private method, which gets the current date in day, month, year, hour, minute, second format and returns it as a string
     * @returns {string}
     * @author Kristian Milanov
     */
    static #getDate() {
        let date_ob = new Date();
        return `(${date_ob.getDate()}.${date_ob.getMonth()+1}.${date_ob.getYear()+1900} ${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()})`;
    }

    /**
     * Logs a received exception to the console
     * @param {string} funcName - Name of the function, which called this method
     * @param {*} err - The potention error or exception, which has been received
     * @author Kristian Milanov
     * @returns {void}
     */
    static logError(funcName,err) {
        console.log(`${"[!]".red.bold} ${this.#getDate().yellow} DB.js: function ${funcName} encountered an error: ${err.message}`);
    }

    /**
     * Logs the successful execution of a function
     * @param {string} funcName - Name of the function, which called this method
     * @author Kristian Milanov
     * @returns {void}
     */
    static logInfo(funcName) {
        console.log(`${"[i]".blue.bold} ${this.#getDate().yellow} DB.js: function ${funcName} successfully executed`);
    }

};

/**
 * Main manager class for the database API functionality
 * @author Kristian Milanov
 */
class DBManager {

    /**
     * User object
     * @typedef {Object} user
     * @property {string} username - user's username
     * @property {string} password - user's password
     * @property {string} firstName - user's first name
     * @property {string} lastName - user's last name
     * @property {number} creatorId - The id of the user which created this user
     * @property {string} dateOfLastChange - the date, which the user's data was last changed
     * @property {number} latestChangeUserId - Id of the user, which last changed this user's data
     * @property {boolean} isAdmin - wether the new user has administrator privilages or not
     * @author Kristian Milanov
     */

    /**
     * Team object
     * @typedef {Object} team
     * @property {string} title - Title of the team
     * @property {number} creatorId - Id of the user, which created this team
     * @property {string} dateOfLastChange - the date, which the user's data was last changed
     * @property {number} latestChangeUserId - Id of the user, which last changed this user's data
     * @author Kristian Milanov
     */

    /**
     * Project object
     * @typedef {Object} project
     * @property {string} title - Title of the team
     * @property {string} description - Description of the task
     * @property {number} creatorId - Id of the user, which created this team
     * @property {string} dateOfLastChange - the date, which the user's data was last changed
     * @property {number} latestChangeUserId - Id of the user, which last changed this user's data
     * @author Kristian Milanov
     */

    /**
     * Task object
     * @typedef {Object} task
     * @property {number} projectId - Id of the project, to which this task belongs to
     * @property {number} asigneeId - Id of the user which has been asigned to this task.
     * @property {string} title - Title of the project
     * @property {string} description - Description of the project
     * @property {number} status - Status of the task
     * @property {number} creatorId - Id of the user, which created this team
     * @property {string} dateOfLastChange - the date, which the user's data was last changed
     * @property {number} latestChangeUserId - Id of the user, which last changed this user's data
     * @author Kristian Milanov
     */

    /**
     * Worklog object
     * @typedef {Object} worklog
     * @property {number} taskId - id of the task which belongs to this worklog
     * @property {number} time - time spent working by minutes
     * @property {number} creatorId - Id of the user, which created this team
     * @author Kristian Milanov
     */

    /**
     * @type {*} - Private field, which holds the connection pool to the database
     * @author Kristian Milanov
     */
    #pool

    /**
     * The constructor connects the server to the DB using the connection pool
     * @author Kristian Milanov
     */
    constructor() {
        this.#pool = sql.connect(config);
    }

    /**
     * Adds a user to the database
     * @param {user} user- Holds all relevant user information
     * @author Kristian Milanov
     */
    async createUser(user) {
        try {
            const pool = await this.#pool;

            Validations.validateName(user.firstName);
            Validations.validateName(user.lastName);

             const result = await pool.request()
                 .input("Username",sql.NVarChar,user.username)
                 .input("Password",sql.NVarChar,user.password)
                 .input("FirstName",sql.NVarChar,user.firstName)
                 .input("LastName",sql.NVarChar,user.lastName)
                 .input("CreatorId",sql.Int, user.creatorId)
                 .input("IsAdmin",sql.Bit,user.isAdmin)
                 .execute("CreateUser");

            Log.logInfo("createUser");
        } catch(err) {
            Log.logError("createUser",err);
        }
    }

    /**
     * Gets all data fields of the specified user without the Password and Id
    * @param {number} id - Id of the user
    * @author Kristian Milanov
    * @returns {user}
    */
    async getPublicUserDataById(id) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(id);

            const results = await pool.request()
                .input("UserId",sql.Int,id)
                .query("SELECT Username, FirstName, LastName, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId, IsAdmin FROM Users WHERE Id = @UserId")
            
            Log.logInfo("getPublicUserDataById");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getPublicUserDataById",err);
        }
    }

    /**
    * @author Kristian Milanov
    * @returns {*}
    */
    async getRealUserCount() {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .query("SELECT Id FROM Users WHERE IsDeleted = 0")

            Log.logInfo("getRealUserCount");

            return results.recordset.length;
        } catch(err) {
            Log.logError("getRealUserCount",err);
        }
    }

    /**
     * Retrieves all user data
    * @param {number} id - Id of the user
    * @author Kristian Milanov
    * @returns {user}
    */
     async #getAllUserDataById(id) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(id);

            const results = await pool.request()
                .input("UserId",sql.Int,id)
                .query("SELECT * FROM Users WHERE Id = @UserId")
            
            Log.logInfo("getAllUserDataById");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getAllUserDataById",err);
        }
    }

    /**
    * Gets all users
    * @author Kristian Milanov
    * @returns {void}
    */
    async getAllUsers() {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .query("SELECT * FROM Users")
            Log.logInfo("getAllUsers");
            return results.recordset;
        } catch(err) {
            Log.logError("getAllUsers",err);
        }
    }

    /**
    * Updates the specified user
    * @param {number} userId - Id of the user to be updated
    * @param {user} newUser - User object with the new properties
    * @param {number} updaterId - Id of the user which updated this data type
    * @author Kristian Milanov
    * @returns {void}
    */
    async updateUser(userId,newUser,updaterId) {
        try {
            const pool = await this.#pool;
            
            const oldUser = this.#getAllUserDataById(userId);
            for(const key in newUser) {
                oldUser[key] = newUser[key];
            }

            Validations.validateName(oldUser.firstName);
            Validations.validateName(oldUser.lastName);
            Validations.validateNumericability(userId);
            Validations.validateNumericability(updaterId);

            const results = await pool.request()
                .input("Username",sql.NVarChar,oldUser.username)
                .input("Password",sql.NVarChar,oldUser.password)
                .input("FirstName",sql.NVarChar,oldUser.firstName)
                .input("LastName",sql.NVarChar,oldUser.lastName)
                .input("LatestChangeUserId",sql.Int,updaterId)
                .input("UserId",sql.Int,userId)
                .query(`UPDATE Users 
                    SET Username = @Username,
                        Password = @Password,
                        FirstName = @FirstName,
                        LastName = @LastName,
                        LatestChangeUserId = @LatestChangeUserId,
                        DateOfLastChange = GETDATE()
                    WHERE Id = @UserId`)

            Log.logInfo("updateUser");
        } catch(err) {
            Log.logError("updateUser",err);
        }
    }

    /**
    * @param {number} userId -Id of the user to be deleted
    * @author Kristian Milanov
    * @returns {void}
    */
    async deleteUser(userId) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(userId);

            const results = await pool.request()
                .input("UserId",sql.Int,userId)
                .execute("DeleteUser")
            Log.logInfo("deleteUser");
        } catch(err) {
            Log.logError("deleteUser",err);
        }
    }

    /**
     * Adds a team to the database
     * @param {team} team- Holds all relevant team information
     * @author Kristian Milanov
     */
     async createTeam(team) {
        try {
            const pool = await this.#pool;

            Validations.validateTitle(team.title);
            Validations.validateNumericability(team.creatorId);

            const result = await pool.request()
                .input("Title",sql.NVarChar,team.title)
                .input("CreatorId",sql.Int,team.creatorId)
                .execute("CreateTeam")

            Log.logInfo("createTeam");
        } catch(err) {
            Log.logError("createTeam",err);
        }
    }

    /**
    * Retrieves info about the specified team
    * @param {number} id - Id of the team
    * @author Kristian Milanov
    * @returns {team}
    */
    async getTeamById(id) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(id);

            const results = await pool.request()
                .input("TeamId",sql.Int,id)
                .query("SELECT Title, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Teams WHERE Id = @TeamId");
            Log.logInfo("getTeamById");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getTeamById",err);
        }
    }

    /**
    * @param {number} projectId
    * @author Kristian Milanov
    * @returns {void}
    */
    async getAllTeamsByProject(projectId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(projectId);

            const results = await pool.request()
                .input("ProjectId",sql.Int,projectId)
                .query(`
                SELECT Teams.Title
                FROM Teams
                INNER JOIN TeamsProjects
                ON Teams.Id = TeamsProjects.TeamId
                WHERE ProjectId = @ProjectId
                `);

            Log.logInfo("getAllTeamsByProject");
            return results.recordset;
        } catch(err) {
            Log.logError("getAllTeamsByProject",err);
        }
    }

    /**
     * Gets all team data
    * @author Kristian Milanov
    * @returns {array}
    */
    async getAllTeams() {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .query("SELECT Id, Title, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Teams");
            Log.logInfo("getAllTeams");
            return results.recordset;
        } catch(err) {
            Log.logError("getAllTeams",err);
        }
    }

    /**
    * @param {string} title
    * @author Kristian Milanov
    * @returns {void}
    */
    async getTeamByTitle(title) {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .input("Title",sql.NVarChar,title)
                .query("SELECT Id, Title, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Teams WHERE Title = @Title");
            Log.logInfo("getTeamByTitle");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getTeamByTitle",err);
        }
    }

    /**
    * Updates the specified team
    * @param {number} teamId - Team's id
    * @param {string} newTitle - new team's data
    * @param {number} updaterId - Id of the user which updated this data type
    * @author Kristian Milanov
    * @returns {void}
    */
    async updateTeam(teamId,newTitle,updaterId) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(teamId);
            Validations.validateNumericability(updaterId);
            Validations.validateTitle(newTitle);

            const results = await pool.request()
                .input("Title",sql.NVarChar,newTitle)
                .input("TeamId",sql.Int,teamId)
                .input("LatestChangeUserId",sql.Int,updaterId)
                .query(`
                    UPDATE Teams
                    SET Title = @Title,
                        LatestChangeUserId = @LatestChangeUserId,
                        DateOfLastChange = GETDATE()
                    WHERE Id = @TeamId
                `);
            Log.logInfo("updateTeam");
        } catch(err) {
            Log.logError("updateTeam",err);
        }
    }

    /**
    * @param {*} teamId
    * @author Kristian Milanov
    * @returns {void}
    */
    async deleteTeam(teamId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(teamId);

            const results = await pool.request()
                .input("TeamId",sql.Int,teamId)
                .execute("DeleteTeam");

            Log.logInfo("deleteTeam");
        } catch(err) {
            Log.logError("deleteTeam",err);
        }
    }

    /**
     * Adds a task to the database
     * @param {task} task- Holds all relevant task information
     * @author Kristian Milanov
     */
     async createTask(task) {
        try {
            const pool = await this.#pool;

            Validations.validateTitle(task.title);
            Validations.validateDescription(task.description);
            Validations.validateNumericability(task.projectId);
            Validations.validateNumericability(task.asigneeId);
            Validations.validateNumericability(task.status)

            const result = pool.request()
                .input("ProjectId",sql.Int,task.projectId)
                .input("AsigneeId",sql.Int,task.asigneeId)
                .input("Title",sql.NVarChar,task.title)
                .input("Description",sql.NVarChar,task.description)
                .input("Status",sql.Int,task.status)
                .input("CreatorId",sql.Int,task.creatorId)
                .execute("CreateTask")

            Log.logInfo("createTask");
        } catch(err) {
            Log.logError("createTask",err);
        }
    }

    /**
    * @param {number} id - Id of the task
    * @author Kristian Milanov
    * @returns {task}
    */
    async getTaskById(id) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(id)

            const results = await pool.request()
                .input("TaskId",sql.Int,id)
                .query("SELECT Id, ProjectId, AsigneeId, Title, Description, Status, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Tasks WHERE Id = @TaskId")
            Log.logInfo("getTaskById");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getTaskById",err);
        }
    }

    /**
     * Gets all tasks
    * @author Kristian Milanov
    * @returns {array}
    */
    async getAllTasks() {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .query("SELECT Id, ProjectId, AsigneeId, Title, Description, Status, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Tasks")
            Log.logInfo("getAllTasks");
            return results.recordset;
        } catch(err) {
            Log.logError("getAllTasks",err);
        }
    }

    /**
    * @param {number} taskId - Id of the task to be updated
    * @param {task} newTask - Holds the new info of the task
    * @param {number} updaterId - Id of the user which updated this data type
    * @author Kristian Milanov
    * @returns {void}
    */
    async updateTask(taskId, newTask, updaterId) {
        try {
            const pool = await this.#pool;
            
            const oldTask = this.getTaskById(taskId);
            for(const key in newTask) {
                oldTask[key] = newTask[key];
            }

            Validations.validateNumericability(updaterId);
            Validations.validateNumericability(taskId);
            Validations.validateNumericability(oldTask.projectId);
            Validations.validateNumericability(oldTask.asigneeId);
            Validations.validateTitle(oldTask.title);
            Validations.validateDescription(oldTask.description)
            Validations.validateNumericability(oldTask.status)

            const results = await pool.request()
                .input("Title",sql.NVarChar,newTask.title)
                .input("ProjectId",sql.Int,newTask.projectId)
                .input("AsigneeId",sql.Int,newTask.asigneeId)
                .input("Description",sql.NVarChar,newTask.description)
                .input("Status",sql.Int,newTask.status)
                .input("LatestChangeUserId",sql.Int,updaterId)
                .input("TaskId",sql.Int,taskId)
                .query(`
                    UPDATE Tasks
                    SET ProjectId = @ProjectId,
                        AsigneeId = @AsigneeId,
                        Title = @Title,
                        Description = @Description,
                        Status = @Status,
                        LatestChangeUserId = @LatestChangeUserId,
                        DateOfLastChange = GETDATE()
                    WHERE Id = @TaskId
                `);
            Log.logInfo("updateTask");
        } catch(err) {
            Log.logError("updateTask",err);
        }
    }

    /**
    * @param {*} taskId
    * @author Kristian Milanov
    * @returns {void}
    */
    async deleteTask(taskId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(taskId);

            const results = await pool.request()
                .input("TaskId",sql.Int,taskId)
                .execute("DeleteTask");

            Log.logInfo("deleteTask");
        } catch(err) {
            Log.logError("deleteTask",err);
        }
    }

    /**
     * Adds a worklog to the database
     * @param {worklog} worklog- Holds all relevant worklog information
     * @author Kristian Milanov
     */
     async createWorklog(worklog) {
        try {
            const pool = await this.#pool;

            Validations.validateNumericability(worklog.taskId);
            Validations.validateNumericability(worklog.time);
            Validations.validateNumericability(worklog.creatorId);

            const results = await pool.request()
                .input("TaskId",sql.Int,worklog.taskId)
                .input("Time",sql.Int,worklog.time)
                .input("CreatorId",sql.Int,worklog.creatorId)
                .execute("CreateWorklog")
            
            Log.logInfo("createWorklog");
        } catch(err) {
            Log.logError("createWorklog",err);
        }
    }

    /**
    * @param {number} id -Id of the worklog
    * @author Kristian Milanov
    * @returns {worklog}
    */
    async getWorklogById(id) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(id);

            const results = await pool.request()
                .input("WorklogId",sql.Int,id)
                .query("SELECT TaskId, Time, CreatorId, Date FROM Worklogs WHERE Id = @WorklogId")
            Log.logInfo("getWorklogById");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getWorklogById",err);
        }
    }

    /**
    * Gets all worklogs
    * @author Kristian Milanov
    * @returns {void}
    */
    async getAllWorklogs() {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .query("SELECT Id, TaskId, Time, CreatorId, Date FROM Worklogs")
            Log.logInfo("getAllWorklogs");
            return results.recordset;
        } catch(err) {
            Log.logError("getAllWorklogs",err);
        }
    }

    /**
    * @param {number} worklogId - Id of the worklog to be updated
    * @param {worklog} newWorklog - Hold new worklog info
    * @param {number} updaterId - Id of the user which updated this data type
    * @author Kristian Milanov
    * @returns {void}
    */
    async updateWorklog(worklogId,newWorklog) {
        try {
            const pool = await this.#pool;
            
            const oldWorklog = await this.getWorklogById(worklogId);
            for(const key in newWorklog) {
                oldWorklog[key] = newWorklog[key];
            }

            console.log(oldWorklog);

            Validations.validateNumericability(worklogId);
            Validations.validateNumericability(oldWorklog.time);

            const results = await pool.request()
                .input("Time",sql.Int,oldWorklog.time)
                .input("WorklogId",sql.Int,worklogId)
                .query(`
                    UPDATE Worklogs
                    SET Time = @Time
                    WHERE Id = @WorklogId
                `);
            Log.logInfo("updateWorklog");
            return results.recordsets[0];
        } catch(err) {
            Log.logError("updateWorklog",err);
        }
    }

    /**
    * @param {*} id - Id of the worklog ot be deleted
    * @author Kristian Milanov
    * @returns {void}
    */
    async deleteWorklog(id) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(id);

            const results = await pool.request()
                .input("WorklogId",sql.Int,id)
                .query("DELETE FROM Worklogs WHERE Id = @WorklogId")

            Log.logInfo("deleteWorklog");
        } catch(err) {
            Log.logError("deleteWorklog",err);
        }
    }

    /**
     * Adds a project to the database
     * @param {project} project- Holds all relevant project information
     * @author Kristian Milanov
     */
     async createProject(project) {
        try {
            const pool = await this.#pool;

            Validations.validateTitle(project.title);
            Validations.validateDescription(project.description);
            Validations.validateNumericability(project.creatorId);

            const results = await pool.request()
                .input("Title",sql.NVarChar,project.title)
                .input("Description",sql.NVarChar,project.description)
                .input("CreatorId",sql.Int,project.creatorId)
                .execute("CreateProject");
            Log.logInfo("createProject");
        } catch(err) {
            Log.logError("createProject",err);
        }
    }
    
    /**
    * @param {number} id - Id of the project
    * @author Kristian Milanov
    * @returns {project}
    */
    async getProjectById(id) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(id);

            const results = await pool.request()
                .input("ProjectId",sql.Int,id)
                .query("SELECT Title, Description, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Projects WHERE Id = @ProjectId")
            Log.logInfo("getProjectById");
            return results.recordsets[0];
        } catch(err) {
            Log.logError("getProjectById",err);
        }
    }

    /**
    * @param {string} title
    * @author Kristian Milanov
    * @returns {void}
    */
    async getProjectByTitle(title) {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .input("Title",sql.NVarChar,id)
                .query("SELECT Id, Title, Description, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Projects WHERE Title like @Title")
            Log.logInfo("getProjectByTitle");
        } catch(err) {
            Log.logError("getProjectByTitle",err);
        }
    }

    /**
    * Gets all projects
    * @author Kristian Milanov
    * @returns {array}
    */
    async getAllProjects() {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .query("SELECT Id, Title, Description, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Projects")
            Log.logInfo("getAllProjects");
            return results.recordset;
        } catch(err) {
            Log.logError("getAllProjects",err);
        }
    }

    /**
    * @param {number} projectId - Id of the project you wish to update
    * @param {project} newProject - New project object, containing 
    * @param {number} updaterId - Id of the user, which updated this project
    * @author Kristian Milanov
    * @returns {void}
    */
    async updateProject(projectId,newProject,updaterId) {
        try {
            const pool = await this.#pool;

            const oldProject = this.getProjectById(projectId);
            for(const key in newProject) {
                oldProject[key] = newProject[key];
            }

            Validations.validateTitle(oldProject.title);
            Validations.validateDescription(oldProject.description);
            Validations.validateNumericability(projectId);
            Validations.validateNumericability(updaterId);

            const results = await pool.request()
                .input("Title",sql.NVarChar,oldProject.title)
                .input("Description",sql.NVarChar,oldProject.description)
                .input("ProjectId",sql.Int,projectId)
                .input("LatestChangeUserId",sql.Int,updaterId)
                .query(`
                    UPDATE Projects
                    SET Title = @Title,
                        Description = @Description,
                        LatestChangeUserId = @LatestChangeUserId,
                        DateOfLastChange = GETDATE()
                    WHERE Id = @ProjectId
                `);
            Log.logInfo("updateProject");
        } catch(err) {
            Log.logError("updateProject",err);
        }
    }

    /**
    * @param {number} projectId
    * @author Kristian Milanov
    * @returns {void}
    */
    async deleteProject(projectId) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(projectId);

            const tasks = await pool.request()
                .input("Id",sql.Int,projectId)
                .query("SELECT Id FROM Tasks WHERE ProjectId = @Id");

            for(const task of tasks.recordset) {
                await pool.request()
                    .input("TaskId",sql.Int,task.Id)
                    .execute("DeleteTask")
            }

            await pool.request()
                .input("Id",sql.Int,projectId)
                .query("DELETE FROM TeamsProjects WHERE ProjectId = @Id");

            await pool.request()
                .input("Id",sql.Int,projectId)
                .query("DELETE FROM Projects WHERE Id = @Id");

            Log.logInfo("deleteProject");
        } catch(err) {
            Log.logError("deleteProject",err);
        }
    }

    /**
    * @param {number} userId
    * @param {number} teamId
    * @author Kristian Milanov
    * @returns {void}
    */
    async addUserToTeam(userId,teamId) {
        try {
            const pool = await this.#pool;

            Validations.validateNumericability(userId);
            Validations.validateNumericability(teamId);

            const results = await pool.request()
                .input("UserId",sql.Int,userId)
                .input("TeamId",sql.Int,teamId)
                .query("INSERT INTO UsersTeams (UserId,TeamId) VALUES (@UserId,@TeamId)")
            Log.logInfo("addUserToTeam");
        } catch(err) {
            Log.logError("addUserToTeam",err);
        }
    }

    /**
    * @param {number} userId
    * @param {number} teamId
    * @author Kristian Milanov
    * @returns {void}
    */
    async removeUserFromTeam(userId,teamId) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(userId);
            Validations.validateNumericability(teamId);

            const results = await pool.request()
                .input("UserId",sql.Int,userId)
                .input("TeamId",sql.Int,teamId)
                .query("DELETE FROM UsersTeams WHERE UserId = @UserId AND TeamId = @TeamId")
            Log.logInfo("removeUserFromTeam");
        } catch(err) {
            Log.logError("removeUserFromTeam",err);
        }
    }

    /**
    * @param {number} teamId
    * @param {number} projectId
    * @author Kristian Milanov
    * @returns {void}
    */
    async addTeamToProject(teamId,projectId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(projectId);
            Validations.validateNumericability(teamId);

            const results = await pool.request()
                .input("ProjectId",sql.Int,projectId)
                .input("TeamId",sql.Int,teamId)
                .query("INSERT INTO TeamsProjects (ProjectId,TeamId) VALUES (@ProjectId,@TeamId)")

            Log.logInfo("addTeamToProject");
        } catch(err) {
            Log.logError("addTeamToProject",err);
        }
    }

    /**
    * @param {array} teams
    * @param {number} projectId
    * @author Kristian Milanov
    * @returns {void}
    */
    async addTeamsToProject(teams,projectId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(projectId);

            await pool.request()
                    .input("ProjectId",sql.Int,projectId)
                    .query("UPDATE TeamsProjects SET ProjectId = NULL WHERE ProjectId = @ProjectId")

            for(const teamTitle in teams) {
                
                const team = await this.getTeamByTitle(teams[teamTitle]);
                console.log(team.Id);
                
                const results = await pool.request()
                    .input("TeamId",sql.Int,team.Id)
                    .input("ProjectId",sql.Int,projectId)
                    .query("DELETE FROM TeamsProjects WHERE TeamId = @TeamId")

                await pool.request()
                    .input("TeamId",sql.Int,team.Id)
                    .input("ProjectId",sql.Int,projectId)
                    .query("INSERT INTO TeamsProjects (ProjectId, TeamId) VALUES (@ProjectId,@TeamId)")
            }

            Log.logInfo("addTeamsToProject");
        } catch(err) {
            Log.logError("addTeamsToProject",err);
        }
    }

    /**
    * @param {string} title
    * @author Kristian Milanov
    * @returns {void}
    */
    async getTaskByTitle(title) {
        try {
            const pool = await this.#pool;

            Validations.validateTitle(title);
    
            const results = await pool.request()
                .input("Title",sql.NVarChar,title)
                .query("SELECT Id, ProjectId, AsigneeId, Title, Description, Status, DateOfCreation, CreatorId, DateOfLastChange, LatestChangeUserId FROM Tasks WHERE Title like @Title");
    
            Log.logInfo("getTaskByTitle");
            return results.recordset[0];
        } catch(err) {
            Log.logError("getTaskByTitle",err);
        }
    }

    /**
    * @param {array} tasks
    * @param {string} projectId
    * @author Kristian Milanov
    * @returns {void}
    */
    async addTasksToProject(tasks,projectId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(projectId);

            await pool.request()
                    .input("ProjectId",sql.Int,projectId)
                    .query("UPDATE Tasks SET ProjectId = NULL WHERE ProjectId = @ProjectId")

            for(const taskTitle in tasks) {
        
                const task = await this.getTaskByTitle(tasks[taskTitle]);
                console.log(task);
                
                const results = await pool.request()
                    .input("TaskId",sql.Int,task.Id)
                    .input("ProjectId",sql.Int,projectId)
                    .query("UPDATE Tasks SET ProjectId=@ProjectId WHERE Id = @TaskId")
            }
    
            Log.logInfo("addTasksToProject");
        } catch(err) {
            Log.logError("addTasksToProject",err);
        }
    }

    /**
    * @param {number} teamId
    * @param {number} projectId
    * @author Kristian Milanov
    * @returns {void}
    */
    async removeTeamFromProject(teamId,projectId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(projectId);
            Validations.validateNumericability(teamId);

            const results = await pool.request()
                .input("ProjectId",sql.Int,projectId)
                .input("TeamId",sql.Int,teamId)
                .query("DELETE FROM TeamsProjects WHERE ProjectId = @ProjectId AND TeamId = @TeamId")
            Log.logInfo("removeTeamFromProject");
        } catch(err) {
            Log.logError("removeTeamFromProject",err);
        }
    }

    /**
    * @param {number} teamId
    * @author Kristian Milanov
    * @returns {void}
    */
    async getUsersInTeam(teamId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(teamId);

            const results = await pool.request()
                .input("TeamId",sql.Int,teamId)
                .query("SELECT UserId FROM UsersTeams WHERE TeamId = @TeamId")
            Log.logInfo("getUsersInTeam");
            return results.recordset;
        } catch(err) {
            Log.logError("getUsersInTeam",err);
        }
    }

    /**
    * @param {number} userId
    * @author Kristian Milanov
    * @returns {void}
    */
    async getUserById(userId) {
        try {
            const pool = await this.#pool;
    
            Validations.validateNumericability(userId);

            const results = await pool.request()
                .input("UserId",sql.Int,userId)
                .query("SELECT * FROM Users WHERE Id = @UserId");
            Log.logInfo("getUserById");
            return results.recordsets[0];
        } catch(err) {
            Log.logError("getUserById",err);
        }
    }

    /**
    * @param {array} users
    * @param {number} teamId
    * @author Kristian Milanov
    * @returns {void}
    */
    async updateUsersInTeam(users,teamId) {
        try {
            const pool = await this.#pool;
            
            Validations.validateNumericability(teamId);
            
            await pool.request()
                    .input("TeamId",sql.Int,teamId)
                    .query("DELETE FROM UsersTeams WHERE TeamId = @TeamId")

            for(let user of users) { 
                let userId = parseInt(user);
                
                await pool.request()
                    .input("UserId",sql.Int,userId)
                    .input("TeamId",sql.Int,teamId)
                    .query("INSERT INTO UsersTeams (TeamId,UserId) VALUES (@TeamId,@UserId)")
            }
            
            Log.logInfo("updateUsersInTeam");
        } catch(err) {
            Log.logError("updateUsersInTeam",err);
        }
    }

    /**
     * Checks if the user registered under this username and password exists in the DB and returns their Id if found and 0 if not.
    * @param {string} username
    * @param {string} password
    * @author Kristian Milanov
    * @returns {number}
    */
    async validateUser(username,password) {
        try {
            const pool = await this.#pool;
    
            const results = await pool.request()
                .input("Username",sql.NVarChar,username)
                .input("Password",sql.NVarChar,password)
                .query("SELECT Id FROM Users WHERE Username = @Username AND Password = @Password")

            Log.logInfo("validateUser");
            if(results.recordset.length==0)
                return 0;
            return results.recordset[0].Id;
        } catch(err) {
            Log.logError("validateUser",err);
        }
    }
};

const DBM = new DBManager();

module.exports = { DBM };
