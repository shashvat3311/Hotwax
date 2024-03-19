const bodyParser = require('body-parser');
const express=require('express');
const app=express();
const indexrouter=require('./router')
const db=require('./db')
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(bodyParser.json());

app.use(indexrouter);

app.listen(5000,()=>{
    console.log("Server up and running on port 5000 for Hotwax");
})