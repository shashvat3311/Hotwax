const mysql=require('mysql');
const db=mysql.createConnection({
    user:"root",
    password:"shashvat",
    host:"localhost",
    database:"hotwaxpost"
})

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Hotwax Database connected");
    }
})

module.exports=db