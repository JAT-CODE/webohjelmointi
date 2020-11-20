
// Asenna ensin express npm install express --save

var express = require('express');
var app=express();

// Otetaan käyttöön body-parser, jotta voidaan html-requestista käsitellä viestin body post requestia varten... *
var bodyParser = require('body-parser');
// Pyyntöjen reitittämistä varten voidaan käyttää Controllereita
var customerController = require('./customerController');

const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    // Jos haluttaisiin rajata hakuja joidenkin ehtojen perusteella, niin määritettäisiin näin: 
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
}
// Otetaan käyttöön CORS säännöt:
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //* ...jsonina


// Staattiset tiedostot, esim. kuvat, tyylitiedostot, scriptit käyttöliittymää varten
app.use(express.static('public'));



// REST API Asiakas
app.route('/Types') // route reitittää pyynnön merkkijonon ja metodin perusteella customerControlleriin
    .get(customerController.fetchTypes)
    .post((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end("post metodilla mennään");
    })

app.route("/Tyypit")
    .get(customerController.haeTyypit);


app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .get(customerController.fetchCustomer)
    .delete(customerController.delete);
//

app.get('/', function(request, response){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Terve maailma"); 
});

app.get('/maali', function(request, response){
    console.log(request.headers);
    console.log(request.url);
    console.log(request.method);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Maaleja"); 
});


app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/  