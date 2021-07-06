const express = require("express");
const app = express();

app.get("/test", (req,res)=>{
    res.send("aaaa");
});

app.get("*", (req,res)=>{
    res.send("Error, no page like this exists yet.");
});

app.listen(3000, ()=>{
    console.log("Server started");
});