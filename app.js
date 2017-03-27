var express = require('express');
var cfenv = require('cfenv');
var app = express();

const fs = require('fs');
var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

var natural_language_classifier = new NaturalLanguageClassifierV1({
  username: '0ec6f1bc-d977-428f-b2a4-4530df881f57',
  password: '6CXohUxzv5pq',
  version: 'v1'
});


app.get('/addUser', function (req, res) {
    var classifier_id = req.param('classifier_id');
    console.log('classifier_id:', classifier_id);

    var texto = req.param('texto');
    console.log('texto:', texto);

    //var classifier_id = '90e7acx197-nlc-4352';
    //var texto = 'Test de roubo';

    natural_language_classifier.classify({
      text: texto,
      classifier_id: classifier_id },
      function(err, response) {
        if (err) {
          res.send(err);         
          console.log('error:', err);
        } else {
          res.send(JSON.stringify(response, null, 2));         
          console.log(JSON.stringify(response, null, 2));
        }
    });
});

app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening


  console.log("server starting on " + appEnv.url);
});
