var express = require('express');
var cfenv = require('cfenv');
var app = express();
var result = [];

const fs = require('fs');
var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

var natural_language_classifier = new NaturalLanguageClassifierV1({
  username: '0ec6f1bc-d977-428f-b2a4-4530df881f57',
  password: '6CXohUxzv5pq',
  version: 'v1'
});


// O adequado seria desta Performance
// app.get('/nlcDipol/:classifier_id/:texto', function (req, res) {
//    var classifier_id = req.params.classifier_id;
//     var texto = req.params.texto;


app.get('/nlcDipol', function (req, res) {
    var classifier_id = req.param('classifier_id');
    var texto = req.param('texto');

    natural_language_classifier.classify({
      text: texto,
      classifier_id: classifier_id },
      function(err, response) {
        if (err) {
          
          res.send('MO não encontrado!');         
          console.log('error:', err);
        } else {

          var classes_0 = response.classes[0].class_name;
          var confidence_0 = response.classes[0].confidence;
          var classes_1 = response.classes[1].class_name;
          var confidence_1 = response.classes[1].confidence;


          var classes = [];

          classes.push({class_name: classes_0, confidence: confidence_0});
          classes.push({class_name: classes_1, confidence: confidence_1});

          result.push({classifier_id: classifier_id, texto: texto, classes: classes});

          res.send(classes_0 + ',' + classes_1);         
        }
    });
});


app.get('/listResult', function (req, res) {
  res.contentType('application/json');
  res.send(JSON.stringify(result));
});

app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening


  console.log("server starting on " + appEnv.url);
});
