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
        console.log(`${"[!]".red.bold} ${this.#getDate().yellow} DB.js: function ${funcName} encountered an error: ${err}`);
    }

    /**
     * Logs the successful execution of a function
     * @param {string} funcName - Name of the function, which called this method
     * @author Kristian Milanov
     * @returns {void}
     */
    static logInfo(funcName) {
        console.log(`${"[i]".blue.bold} ${this.#getDate()} DB.js: function ${funcName} successfully executed`);
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
            const result = await pool.request()
                .input("Username",sql.NVarChar,user.username)
                .input("Password",sql.NVarChar,user.password)
                .input("FirstName",sql.NVarChar,user.firstName)
                .input("LastName",sql.NVarChar,user.lastName)
                .input("CreatorId",sql.Int,user.creatorId)
                .input("DateOfLastChange",sql.NVarChar,user.dateOfLastChange)
                .input("LatestChangeUserId",sql.Int,user.latestChangeUserId)
                .input("IsAdmin",sql.Bit,user.isAdmin)
                .execute("CreateUser");
            Log.logInfo("createUser");
        } catch(err) {
            Log.logError("createUser",err);
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
        } catch(err) {
            Log.logError("createTeam",err);
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
        } catch(err) {
            Log.logError("createTask",err);
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
        } catch(err) {
            Log.logError("createWorklog",err);
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
        } catch(err) {
            Log.logError("createProject",err);
        }
    }
};

const DBM = new DBManager();

module.exports = { DBM,Log, Validations };