const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

"use strict";
var hana = require("@sap/hana-client");

var connOptions = {
  serverNode: "56384f1e-10f3-4bbd-8292-6ee754dea139.hana.trial-eu10.hanacloud.ondemand.com:443",
  encrypt: "true",
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "Welcome@1234",
};

var dbConnection = hana.createConnection();

dbConnection.connect(connOptions, function (err) {
  if (err) throw err;
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/api/get", (req, res) => {
    const hanaSelect = "SELECT * FROM DBADMIN.USERS";
    dbConnection.exec(hanaSelect,
      function (err, result) {
        if (err) throw err;
        res.send(result);      
      }
    );
});

app.post("/api/insert", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  //Inser data into Table
  const hanaInsert = "insert into DBADMIN.USERS (id, name, email) values (?,?,?)"
  dbConnection.exec(hanaInsert, [id, name, email],
    function (err, affectedRows) {
      if (err) {
          console.error('Error: ', err);
      }
      console.log('No. of affected rows: ', affectedRows); 
      res.send(201);
    });      
});

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;
  const hanaDelete = "DELETE FROM DBADMIN.USERS WHERE id = ?"
  dbConnection.exec(hanaDelete, [id],
    function (err, affectedRows) {
      if (err) {
          console.error('Error: ', err);
      }
      console.log('No. of affected rows: ', affectedRows); 
      res.send(200);
    });  
});

app.put("/api/update", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;

  const hanaUpdate = "UPDATE DBADMIN.USERS set name = ?, email = ? WHERE id = ?";
  dbConnection.exec(hanaUpdate, [name, email, id], 
    function (err, affectedRows) {
    if (err) {
        console.error('Error: ', err);
    } else {
        console.log('No. of affected rows: ', affectedRows);
        res.send(200);
    }
  });
});

app.listen(5000, ()=> {
  console.log("Running on port: 5000")
});