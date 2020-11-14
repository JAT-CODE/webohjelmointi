'use strict'

const { json, response } = require('express');
// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost', // tietokantapalvelimen osoite
  port : 3307,
  user : 'root', //kehitystarkoituksessa voidaan käyttää root-käyttäjää. Tuotannossa ei saa käyttää root-käyttäjää
  password : 'Ruutti',
  database : 'asiakas'
});

module.exports = {
  fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas taulusta: " + error);
          res.status(500);
          res.json({"status" : "ei toiminut"});
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results); //onnistunut data lähetetään selaimelle (tai muulle)
        }
    });
  },

    haeTyypit: function (req, res) {
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function (error, results, fields) {
        res.json(results);
      });
    },

    fetchAll: function(req, res){
      //T2 Toteutus
      var sql = 'SELECT * FROM asiakas WHERE 1 = 1';

      if(req.query.nimi != undefined) {
          var nimi = req.query.nimi;
          sql = sql + " AND nimi like '" + nimi + "%'";
      }
      else if(req.query.osoite != undefined) {
        var osoite = req.query.osoite;
        sql = sql + " AND osoite like'" + osoite + "%'";
      }
      else if(req.query.asty_avain != undefined) {
        var asty_avain = req.query.asty_avain;
        sql = sql + " AND asty_avain like'" + asty_avain + "%'";
      }
      //
      connection.query(sql, function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas taulusta: " + error);
          res.status(500);
          res.json({"status" : "ei toiminut"});
        }
        else
        {
          //console.log("Data = " + JSON.stringify(results));
          res.json(results); //onnistunut data lähetetään selaimelle (tai muulle)
        }
      });
      //res.send("Kutsuttiin fetchAll");
    },

    create: function(req, res){
      //Ensin tarkistetaan, että onko tarvittavat kentät
      //Jos ei, niin res.status(400) ja res.json({"status": "Tänne viesdtiä"})
      //jos on kentät, niin sitten ->
      //connection.query...
      /*INSERT INTO asiakas (nimi, osoite, postinro, postitmp, luontipvm, asty_avain)
        VALUES ("Testi Testinen","Mikrokatu 1", "90580", getdate(), )*/

        var d = new Date();
        var month = d.getUTCMonth() +1;
        var day = d.getUTCDate();
        var year = d.getUTCFullYear();
        var newdate = year + "-" + month + "-" + day;
        req.body.luontipvm;

        var sql = 'INSERT INTO asiakas (nimi, osoite, postinro, postitmp, luontipvm, asty_avain) VALUES (' + "'"+req.body.nimi+"'" +','+ "'"+req.body.osoite+"'" +','+ "'"+req.body.postinro+"'" +','+ "'"+req.body.postitmp+"'" +','+
        "'"+newdate+"'" +','+ req.body.asty_avain + ')';

        connection.query(sql, function (error, results, fields){
          if (error){
            console.log(sql);
            console.log("Virhe lisättäessä dataa Asiakas taulusta: " + error);
            res.status(400);
            res.json({"status": "bad request"});
          }
          else {
            //console.log("Data = " + JSON.stringify(req.body));
            response.statusCode = 200;
            res.json({"status": "ok"});
          }

        })
        //res.send("Kutsuttiin create");
      },

    update: function(req, res){
    },

    delete : function (req, res) {
      //connection.query...
      //DETELE FROM asiakas WHERE avain=x
      var sql = 'DELETE FROM asiakas WHERE avain =' + req.params.id;
      connection.query(sql, function (error, results, fields){
        if (error) {
          console.log("Virhe poistossa: " + error);
        }
        else {
          response.statusCode =200;
          res.json({"status": "ok"});
        }
      })
      console.log("Params = " + JSON.stringify(req.params.id)); //tänne tulee id: req.params.id
    }
}
