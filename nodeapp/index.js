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

//Push notification Admin panel
var admin = require("firebase-admin");

const dotenv = require('dotenv');
const { send } = require('process');
dotenv.config();

const app = express();
app.use(bodyParser.json())

app.use(express.static(__dirname + '/'));

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




 /*
 Firebase push notification
 Method :: Post
 URL    :: https://fcm.googleapis.com/fcm/send
 Body   ::
 {
  "data": {
    "notification": {
        "title": "Notification",
        "body": "Firebase notification implementation",
        "icon": "/itwonders-web-logo.png"
    }
  },
  "to":"fvteLDXq2xfDj81E3OEMQV:APA91bHQixWBAYJI3-HnQJmBilmt40O3uUx-2nZyreiPQYSMc6Te6Rcx7ofO4Aqn79Vqwzux7HntIBfeiU1m5w6s9pTHEqnBvjN2XnvuYWcj0cpme_ZRB4DGKotH6wK_Qv0mwiiFuXWT"
 }

 to :: where to find?
    Application home page 

 Header ::  
   key <serverkey>  Where to find => Project Overview -> Cloud messeging
   Authorization :: key=AAAAsyVjz5M:APA91bFQqEe0NH0-TjvBLWqUYya5vVT1ZKXeDnLCfDq7MlKGihHqEhsIRYYLjndynzZ1XndbkU0V3gD2rZ8EzQsz1ShyiX1idr8LRo2WljYtABuf1V4uF05U9LeWnuZQl3q-DYIsYOv0

*/



//Push notification from admin
var serviceAccount = require('./calculation-notification-firebase-adminsdk-d7gob-48af7a7a6e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://calculation-notification.firebaseio.com"
});


app.post('/send-notification',function(req,res){


    var topic = 'general';

    var message = {
      notification: {
        title: 'Message from node',
        body: 'hey there'
      },
      topic: topic
    };

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        res.send({
          response
        });
      })
      .catch((error) => {
        res.send({
          error
        });
    }); 
   
});

var topic = 'general';

var message = {
  notification: {
    title: 'Message from node',
    body: 'hey there'
  },
  topic: topic
};

// Send a message to devices subscribed to the provided topic.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log(response)
  })
  .catch((error) => {
    console.log(error)
}); 


 
  



app.listen(process.env.PORT, () => {
  winston.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  winston.info(`INSTANCE: ${process.env.INSTANCE}`);
  winston.info(`EXPRESS: ${process.env.PORT}`);
});
