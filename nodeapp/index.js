const express = require('express');
const path = require('path');
const winston = require('winston');
const Sequelize = require("sequelize");
const mysql = require('mysql2');
const redisLib = require("redis");
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const Redis = require('ioredis');
const hbs = require('hbs') 

//Push notification
const webPush = require('web-push');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static(__dirname + '/public'));

// View Engine Setup 
app.set('views', path.join(__dirname)) 
app.set('view engine', 'hbs') 
  



app.get('/', (req, res) => {
  const environment = {
    title: 'NGINX ON TOP OF NODE WITH MYSQL-MONGO-REDIS',
    node: process.env.NODE_ENV,
    instance: process.env.INSTANCE,
    port: process.env.PORT
  };

  res.render('Home', { environment });
});


app.get('/endpoint', (req, res) => {
   res.send({
     "Api" : "End point is working!"
   });
});


var mysqlHost = process.env.DATABASE_HOST;
var mysqlPort = process.env.MYSQL_PORT;
var mysqlUser = process.env.MYSQL_USER;
var mysqlPass = process.env.MYSQL_PASS;
var mysqlDB   = process.env.MYSQL_DB ;
var mongoHost   = process.env.MONGO_HOST ;

console.log(process.env.DATABASE_HOST)
console.log(process.env.MYSQL_PORT)
console.log(process.env.MYSQL_USER)
console.log(process.env.MYSQL_PASS)
console.log(process.env.MYSQL_DB)
console.log(process.env.MONGO_HOST)

var sequelize = new Sequelize( mysqlDB, mysqlUser , mysqlPass , {
  host: mysqlHost,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('MySQL server :  You are now connected!');
  })
  .catch(function (err) {
    console.log('MySQL server :  Failed!', err);
  });



 
// create the connection to database
const connection = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password : mysqlPass,
  database: mysqlDB
});

const dbstring = "mongodb://"+mongoHost+":27017/testdb";



//Mysql Test
app.get('/mysql-test',function(req,res){

  connection.query('SELECT * FROM `customers` limit 50',function(err, result ) 
    {
      return res.send(result);
    }
  );
   
});


//Redis Connection checking using ioredis
const redis = new Redis({ host: 'redis' });
redis.set("Redis", "Redis : Redis is working Fine!"); 
redis.get("Redis").then(function (result) {
  console.log(result); // Prints "bar"
});



//Redis Connection checking using redis lib
var client = redisLib.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
client.on('connect', function() {
  console.log('Redis : Redis is connected through redis library');
});

client.on('error', function (err) {
  console.log('Redis : Redis can\'t through redis library ' + err);
});


//mongo database connection testing
mongoose.connect(dbstring,{useNewUrlParser: true},(err)=>{
  if(err){
    console.log("MongoDB : Can't connect to database",+err);
  }
  else
  {
    console.log("MongoDB : Databse connected succesfully");
  }
});





MongoClient.connect(dbstring, {useNewUrlParser: true}, function(error, db) {
  if(error){
    console.log("MongoDB-2 : Can't connect to database",+error);
  }
  else
  {
    console.log("MongoDB-2 : Databse connected succesfully");
  }
  db.close();
});



//push notification
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);
app.post('/subscribe', (req, res) => {
  const subscription = req.body

  res.status(201).json({});

  const payload = JSON.stringify({
    title: 'Push notifications with Service Workers',
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => console.error(error));
});


app.listen(process.env.PORT, () => {
  winston.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  winston.info(`INSTANCE: ${process.env.INSTANCE}`);
  winston.info(`EXPRESS: ${process.env.PORT}`);
});
