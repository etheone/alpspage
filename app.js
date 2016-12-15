var express = require("express");
var request = require("request");
var mongoose = require("mongoose");
var app = express();
var fs = require("fs");
var http = require("http");
var bodyParser = require('body-parser');
var path = require('path');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var multer = require('multer');

var upload = multer()
//var Dropzone = require("dropzone");

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: '!pretOr-50-YihA',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 2592000000 }
}));


/*var auth = function(req, res, next) {
  if (req.session && req.session.user === "user" && req.session.admin) {
      console.log("auth next");
    return next();
  } else {
    console.log("auth redirect");
    return res.redirect('/login');
  }
};*/

app.use(fileUpload());
var Image = require('./imageSchema.js');
var Tag = require('./tagSchema.js');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017");
/*
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());*/

app.use(express.static(__dirname));



//var files = fs.readdirSync(requiredDir);

/*for (var index in files) {
  if (path.extname(files[index]) === ".js") {
    require(requiredDir + files[index]).backend(app, Sensor, Group);
  }
}*/




app.set('port', 8350);
var server = http.createServer(app);
server.listen(app.get('port'), "0.0.0.0", function () {
    //addExistingImages();
    console.log('Dbserver listening on port ' + app.get('port'));
});

var auth = function(req, res, next) {
  if (req.session && req.session.user === "user" && req.session.admin) {
      console.log("auth next");
    return next();
  } else {
    console.log("auth redirect");
    return res.redirect('/login');
  }
};

app.get('/', function (req, res) {
    console.log(req.session);
    if(req.session.password) {
        if(req.session.password == "AUTHED") {
         res.sendFile(__dirname + '/index1.html');
        } else {
          res.redirect('/login');
        }
    //res.sendFile(__dirname + '/index.html');
    } else {
        res.redirect('/login');
    }

});


app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/loginn', upload.array(), function(req, res) {

    //console.log(req.query.password);
    var enteredPass = req.body.password;
    if(enteredPass == "PEnsson50") {
        req.session.password = "AUTHED";
        console.log(req.session);
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
 

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
            var tempTag = req.body.tag;
            var tagToUse = tempTag.replace(/[^\w]/g,'');
            console.log("TAAAAAG");
            console.log(tempTag);
            console.log(tagToUse);
            Tag.findOne({ tagName: tagToUse }, function (err, tag) {
                if (err) {

                } else {
                    if (tag === null || tag === undefined) {
                        tag = new Tag();
                        tag.tagName = tagToUse;
                        tag.save();
                        console.log("SUCCESS saving tag");
                    }
                }
            });

            imageToAdd = new Image();
            imageToAdd.imageName = req.files.file.name;
            imageToAdd.tags.push(tagToUse);
            imageToAdd.save(function (err) {
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

});



  app.use(function(err, req, res, next){
      if(err.status && err.status < 500) {
        return res.status(400).send('Request Aborted');
      }

      console.log('Type of Error:', typeof err);
      console.log('Error: ', err.stack);

      if(req.xhr) {
        res.send('500', { error: err });
      } else {
        res.send('500', { error: err });
      }
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
