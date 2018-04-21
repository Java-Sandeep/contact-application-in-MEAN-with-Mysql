// module import
const fs = require('fs');
var express = require('express');
var url = require('url');
var mysql = require('mysql');
const path = require('path');
const bodyparser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');


// database information
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'node',
  port     : '3390'
});

// database connection
connection.connect();

var app = express();
// parse application/jsons
app.use(bodyparser.json())
app.use(cookieParser())
app.use(session({secret: "session information"}));

// parse application/x-www-form-urlencoded
var urlencodedParser = bodyparser.urlencoded({ extended: false })

// home page request
app.get('/',function(req,res){
  res.status(200);
  // if(req.session.name != null){
  //     res.send("your name is " + req.session.name);
  //  } else {
  //     req.session.name = "sandeep";
  //     res.send("");
  //  }
  res.sendFile(path.join(__dirname+'/index.html'));
});

// loginpage request
app.get('/loginpage',function(req,res){
  res.status(200);
  res.sendFile(path.join(__dirname+'/login.html'));
});

// login with us request
app.post('/login',urlencodedParser,function(req,res){
  var email = req.body.email;
  var pass = req.body.pass;
  var data;
  res.status(200);
  connection.query("select password from registration where email = '" + email + "'",
    function (err, result, fields) {
      if (err)
        throw err
     if(result[0].password.localeCompare(pass) == 0){
        console.log('user authetication complete');
        res.sendFile(path.join(__dirname+'/table.html'));
     }
     else {
       res.write("User email or password incorrect")
       res.sendFile(path.join(__dirname+'/login.html'));
     }
  });
});

// registration page request
app.get('/registration',function(req,res){
  res.status(200);
  res.sendFile(path.join(__dirname+'/register.html'));
});

// get registration with us request
app.post('/reg',urlencodedParser,function(req,res){
  let uname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let pass = req.body.pass;
  let cpass = req.body.cpass;
  let mobile = req.body.mobile;

  // data save into database
  connection.query('insert into registration (firstname,lastname,mobile,email,password) values (?,?,?,?,?)',[uname,lname,mobile,email,pass] ,function (err, rows) {
      if (err)
        throw err
     console.log('Data added successfully with affected rows:' + rows.affectedRows);
  });

  console.log('"'+uname+' '+lname+'" register successfully ..... !!!!');
  //res.cookie('c', req.body);
  res.status(200);
  res.sendFile(path.join(__dirname+'/login.html'));
});

// contact request
app.get('/contact',function(req,res){
  res.status(200);
  res.sendFile(path.join(__dirname+'/contact.html'));
});

// get registration with us request
app.post('/add',urlencodedParser,function(req,res){
  let uname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let address = req.body.address;
  let mobile = req.body.mobile;

  // data save into database
  connection.query('insert into contact (firstname,lastname,mobile,email,address,uid) values (?,?,?,?,?,?)',[uname,lname,mobile,email,address,1] ,function (err, rows) {
      if (err)
        throw err
     console.log('Data added successfully with affected rows:' + rows.affectedRows);
  });

  //console.log('"'+uname+' '+lname+'" register successfully ..... !!!!');
  //res.cookie('c', req.body);
  res.status(200);
  res.sendFile(path.join(__dirname+'/table.html'));
});

// table routing
app.get('/table',function(req,res){
  res.status(200);
  res.sendFile(path.join(__dirname+'/table.html'));
});

// data request
app.get('/datat',function(req,res){
  connection.query("select * from contact",
    function (err, result, fields) {
      if (err)
        throw err;
      var data = result;
      //console.log(data);
      res.send(JSON.stringify(data));
  });
});



// app.get('/cookie', function(req, res) {
//   console.log('Cookies: ', req.cookies.c)
//   res.status(200)
//   res.send("check console")
// })



app.get('/contact/delete/:id',function(req,res){
  connection.query("delete from contact where cid = " + req.param('id'),
    function (err, result, fields) {
      if (err)
        throw err;
      res.redirect('/table');
  });
});


app.get('/contact/edit/:id',function(req,res){
  var data;
  connection.query("select * from contact where cid = " + req.param('id'),
    function (err, result, fields) {
      if (err)
        throw err;
      data = result;
      fs.writeFile('user.json',JSON.stringify(result[0]),function(err){
        if(err)
          console.error("write error :- " + err.meassage);
      });
      res.sendFile(path.join(__dirname+'/edit.html'));
  });
});

// edit form data
// app.get('/userinfo',function(req,res){
//   console.log(req.session.cid);
//   connection.query("select * from contact where cid = " + req.session.cid,
//     function (err, result, fields) {
//       if (err)
//         throw err;
//       var data = result;
//       console.log(data);
//       res.send(JSON.stringify(data));
//   });
// });

app.get('contact/edit/user.json',urlencodedParser,function(req,res){

});
app.get('/edit',urlencodedParser,function(req,res){
  let uname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let address = req.body.address;
  let mobile = req.body.mobile;

  var query = "UPDATE contact SET firstname='${uname}', lastname='${lname}', email='${email}', mobile='${mobile}', address='${address}' WHERE cid = " + req.session.cid;
  // connection.query(query,
  //   function (err, result, fields) {
  //     if (err)
  //       throw err;
  //     let data = result;
  //     res.send(JSON.stringify(data));
  // });
  // res.JSON
  // res.sendFile(path.join(__dirname+'/edit.html'));
  res.send(query);
});

app.get('/logout',function(req,res){
  res.redirect('/');
});

app.listen(3000,() => console.log('server started at port no 3000'));
