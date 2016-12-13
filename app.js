var express = require("express");
var request = require("request");
var mongoose = require("mongoose");
var app = express();
var fs = require("fs");
var http = require("http");
var bodyParser = require('body-parser');
var path = require('path');
var fileUpload = require('express-fileupload');
//var Dropzone = require("dropzone");

app.use(fileUpload());
var Image = require('./imageSchema.js');
var Tag = require('./tagSchema.js');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

//var files = fs.readdirSync(requiredDir);

/*for (var index in files) {
  if (path.extname(files[index]) === ".js") {
    require(requiredDir + files[index]).backend(app, Sensor, Group);
  }
}*/



app.set('port', 3000);
var server = http.createServer(app);
server.listen(app.get('port'), "0.0.0.0", function () {
    console.log('Dbserver listening on port ' + app.get('port'));
});

app.post('/file-upload', function (req, res) {

    console.log("File upload underway");
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    console.log("SAMPLEFILE");
    console.log(req.files.file);
    console.log(req.files.file.name);
    console.log(req);
    sampleFile = req.files.file;
    sampleFile.mv(__dirname + '/uploads/' + sampleFile.name, function (err) {
        if (err) {
            console.log(err);
            console.log("ERROR");
            res.status(500).send(err);
        }
        else {
            console.log("SUCCESS");
            res.redirect('/');
        }
    });

});

app.get('*', function (req, res) {
    console.log(req.url);
    res.sendFile('index.html');
});



