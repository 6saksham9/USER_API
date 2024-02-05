const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require('express');
const app=express();
const path=require("path");
const methodoverride=require( "method-override" );

app.use(methodoverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set( 'view engine', 'ejs' );  // set up ejs for templating
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'SAK123@..sak$'
  });

  // let getRandomUser = () => {
  //   return [
  //      faker.string.uuid(),
  //     faker.internet.userName(),
  //      faker.internet.email(),
  //      faker.internet.password(),
  //   ];
  // };

// let q="INSERT INTO user (id,username, email, password) VALUES ?";

// let data=[];



// for(let i=1;i<=100;i++){
//   data.push(getRandomUser());
// }

//   try{
//     connection.query(q,[data],(err,result)=>{
//       if(err) throw err;
//       console.log(result);
//     });
//   }catch(err){
//     console.log(err);
//   }
  
//home page
app.get('/',(req,res)=>{
  let q=`SELECT  COUNT(*) FROM user`;
    try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count=result[0]["COUNT(*)"];
      res.render("home.ejs",{count});
    });
  }catch(err){
    console.log(err);
    res.send("Some error occured in DB");
  }  
})

//show route

app.get('/user',(req,res)=>{
  let q=`SELECT * FROM user`;
  try{
    connection.query(q,(err,users)=>{
      if(err) throw err;
      res.render("showusers.ejs",{users});
    });
  }catch(err){
    console.log(err);
    res.send("Some error occured in DB");
  }
});


//edit route

app.get('/user/:id/edit',(req,res)=>{
  let {id}=req.params;
  let q= `SELECT  * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  }catch(err){
    console.log(err);
    res.send("Some error occured in DB");
  }
})

//update(DB) route

app.patch( '/user/:id' , ( req , res ) => {
  let {id}=req.params;
  let {password:formpassword , username:newusername}=req.body;
  let q= `SELECT  * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      if(formpassword!=user.password){
        res.send("wrong password");
      }
      else{
        let q2=`UPDATE user SET username = '${newusername}' WHERE id='${id}'`;
        connection.query(q2,(err,results)=>{
          if(err) throw err;
          res.redirect("/user");
        })
      }
    });
  }catch(err){
    console.log(err);
    res.send("Some error occured in DB");
  }
} );

app.listen("8080",()=>console.log("Server is running on port 8080"));