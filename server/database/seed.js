var pg = require('pg');
var path = require('path');

var User = require('../models/users.js');


var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
console.log(connectionString);
client.connect();
//Insert existing places


//Insert streetpark
streetpark = [];
/*name*/
streetpark.push('Streetpark Las Condes');
/*description*/
streetpark.push('El streetpark Las Condes es un parque público para hacer patinaje, skateboard, entre otros. Este parque reproduce los lugares más típicos de una ciudad que sean atractivos para los skaters. Este se encuentra ubicado en el parque araucano, colindando con Av. Manquehue Norte. Su cercanía con el Parque Arauco puede ser atractivos para marcas presentes en este mall ya que les puede servir para dirigir gente hacia sus tiendas.');
/*is_active*/
streetpark.push(false);
/*daily_visits*/
streetpark.push(700);
/*created at*/
streetpark.push(new Date());
/*update at*/
streetpark.push(new Date());
/*email*/
streetpark.push('no hay mail de registro');
/*email_verified*/
streetpark.push(false);
/*status*/
streetpark.push(0);
/*password*/
streetpark.push('password');

var query = client.query("INSERT INTO places(name, description, is_active, daily_visits, created_at, updated_at, email, email_verified, status, password) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", streetpark);
console.log(query);
query.on('end', function() {
    client.end();
});


//Insert users

// var user1 = User.new();
// user1.firstName = 'Antonio';
// user1.lastName = 'Fontaine';
// user1.description = 'Encargado del mantenimiento y desarrollo de esta aplicación';
// user1.isActive = true;
// user1.email = 'antonio@accionet.cl';
// user1.password = '1234';
// user1.is_super_user = true;
//
// User.save(user1);
