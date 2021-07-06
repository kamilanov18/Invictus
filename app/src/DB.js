const sql = require("mssql/msnodesqlv8");
const config = require(".\\config");

(async ()=>{
    let pool = await sql.connect(config);
    console.log(await pool.request()
        .query("SELECT * FROM Projects"));
})();