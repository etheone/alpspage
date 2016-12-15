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
    //addExistingImages();
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
            //MANAGE TAGS AND FILE NAMES
            Tag.findOne({ tagName: req.body.tag }, function (err, tag) {
                if (err) {

                } else {
                    if (tag === null || tag === undefined) {
                        tag = new Tag();
                        tag.tagName = req.body.tag;
                        tag.save();
                        console.log("SUCCESS saving tag");
                    }
                }
            });

            imageToAdd = new Image();
            image.imageName = req.files.file.name;
            image.tags.push(req.body.tag);
            image.save(function (err) {
                if (err) {
                    console.log("Failed to add image to db");
                    console.log(err);
                } else {
                    console.log("saved image to db");
                    res.redirect('/');
                }
            })


        }
    });

});

app.get('/tag-list', function(req, res) {

    Tag.find({}, function(err, tags) {
        if(err) {

        } else {
            res.send(tags);
        }
    });

});

app.get('/image-list', function (req, res) {
    const testFolder = './uploads/';
    const fs = require('fs');
    Image.find({}, function(err, images) {
        if(err) {

        } else {
            res.send(images);
        }
    });
    /*fs.readdir(testFolder, (err, files) => {
        res.send(files);
    });*/

});

app.get('*', function (req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/index.html');
});



function addExistingImages()  {
    const testFolder = __dirname + '/uploads/';
    const fs = require('fs');
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            Image.findOne({imageName: file}, function(err, image) {
                if(image === null || image === undefined) {
                    var image = new Image();
                    image.imageName = file;
                    image.tags.push("test");
                    image.save(function(err) {
                        if(err) {
                            console.log("error saving existing image");

                        } else {
                            console.log("saved existing image to db");
                        }
                    })
                }
            })
        });
    })
}