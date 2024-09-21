const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();


//middleware
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://furni-flex-375.web.app"
    ]
}));



// test server
app.get((req,res)=>{
    res.send('server is working')
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})