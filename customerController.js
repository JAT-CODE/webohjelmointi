'use strict'

const { json } = require('express');
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

module.exports = 
{
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
          console.log("Data = " + JSON.stringify(results));
          res.json(results); //onnistunut data lähetetään selaimelle (tai muulle)
        }
      });

      console.log("Body = " +JSON.stringify(req.body));
      console.log("Params = " + JSON.stringify(req.query));
      console.log(req.query.nimi);
      console.log(req.query.osoite);
      console.log(req.query.asty_avain);
      
      //res.send("Kutsuttiin fetchAll");
    },

    create: function(req, res){
      console.log("Data = " + JSON.stringify(req.body));
      console.log(req.body.nimi);
      res.send("Kutsuttiin create");
    },

    update: function(req, res){
    },

    delete : function (req, res) {
      console.log("Body = " + JSON.stringify(req.body));
      console.log("Params = " + JSON.stringify(req.params));
      
      res.send("Kutsuttiin delete");
    }
}
