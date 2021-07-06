const sql = require("mssql/msnodesqlv8");
const { config } = require("./config");
const colors = require("colors");

class Validations {
    static #pattern

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

    static validateTitle(title) {
        if(!title)
            throw new Error("Titles can't be empty!");

        if(title.length <= 50 && title.length<=0)
            throw new Error("Titles have to be less than 50 characters!");
    }

    static validateDescription(desc) {
        if(!desc)
            throw new Error("Descriptions can't be empty!");

        if(desc.length <= 250 && desc.length<=0)
            throw new Error("Titles have to be less than 250 characters");
    }
}

class Log {

    static #getDate() {
        let date_ob = new Date();
        return `(${date_ob.getDate()}.${date_ob.getMonth()+1}.${date_ob.getYear()+1900} ${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()})`;
    }

    static logError(funcName,err) {
        console.log(`${"[!]".red.bold} ${this.#getDate().yellow} DB.js: function ${funcName} encountered an error: ${err}`);
    }

    static logInfo(funcName) {
        console.log(`${"[i]".blue.bold} ${this.#getDate()} DB.js: function ${funcName} successfully executed`);
    }

};

class DBManager {
    #pool
    constructor() {
        this.#pool = sql.connect(config);
    }

    async createUser() {
        try {
            const pool = await this.#pool;
        } catch(err) {
            Log.logError("createUser",err);
        }
    }
};

const DBM = new DBManager();

module.exports = { DBM,Log, Validations };