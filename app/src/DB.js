const sql = require("mssql/msnodesqlv8");
const config = require(".\\config");

class Log {
    getDate() {
        let date_ob = new Date();
        return `(${date_ob.getDate()}.${date_ob.getMonth()+1}.${date_ob.getYear()+1900} ${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}) DB.js: `;
    }

    getFuncName(funcNum) {
        
    }

    logError(funcNum,err) {
        console.log(`[!] ${this.getDate()} DB.js: function ${this.getFuncName(funcNum)} encountered an error: ${err}`);
    }

    logInfo(funcNum) {
        console.log(`[i] ${this.getDate()} DB.js: function ${this.getFuncName(funcNum)} successfully executed`);
    }
};

const logger = new Log();

class DBManager {
    #pool
    constructor() {
        this.#pool = sql.connect(config);
    }

    async createUser() {
        try {
            let pool = await this.#pool;
        } catch(err) {
            console.log(err);
            return 420;
        }
    }
};

const DBM = new DBManager();

module.exports = { DBM,logger };