// require: Trae la librería express del npm.
var engine = require('consolidate');
var express = require('express');
var http = require('http');
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var ejs = require('ejs');

// Se invoca la función (de la variable express) y se almacena en la variable app.
var app = express();
var usuarioActual;
var usuarioActual;
var idUsuarioActual;
var nombreUsuarioActual;


app.use('/bower_components', express.static('bower_components'));
app.use('/plugins', express.static('plugins'));
app.use('/dist', express.static('dist'));
app.use('/build', express.static('build'));
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('views', __dirname + '/');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');


const child_process = require('child_process');

//Define el home de la página y que función se va a ejecutar.
// La función tiene como parámetro el request y el response.
app.get('/', function (req, res) {
    if (usuarioActual == undefined) {
        res.render("index.html", { mensaje: "Registrate para iniciar sesion", usuario: "" });
    } else {
        res.redirect('/cpu');
    }
});

app.get('/cpu', function (req, res) {

    if (usuarioActual != undefined) {
	res.redirect('/');
    } else {
	res.render("cpu.html", { mensaje:"Datos del cpu"});
    }


});

// Correr el servidor con el puerto 8989.
app.listen(8989);
