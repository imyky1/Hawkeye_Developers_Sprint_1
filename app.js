const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 8080;
const app = express();
const UserRoutes = require('./Routes/User')

//middelwares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Routes
app.use('/',UserRoutes);

//starting server
app.listen(PORT,()=>{
    console.log("Listening on port 8080")
})


