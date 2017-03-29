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

app.get('/nlcDipol/:classifier_id/:texto', function (req, res) {
    res.contentType('application/json');
    
    var classifier_id = req.params.classifier_id;
    var textofatiado = req.params.texto.split('&amp;texto=');

    var promises = [];
    textofatiado.forEach(function (texto) {
      if(texto.length > 0){
        promises.push(new Promise(function(resolve, reject) {
          var envio = {text: texto, classifier_id: classifier_id };
          natural_language_classifier.classify(envio,
            function(err, response) {
              if (err) {
                console.log('error:', err);
                reject(err);     
                
              } else {
                var classes_0 = response.classes[0].class_name;
                var confidence_0 = response.classes[0].confidence;
                var classes_1 = response.classes[1].class_name;
                var confidence_1 = response.classes[1].confidence;

                var classes = [];

                classes.push({class_name: classes_0, confidence: confidence_0});
                classes.push({class_name: classes_1, confidence: confidence_1});
          
                result.push({classifier_id: classifier_id, texto: texto, classes: classes});

                resolve(classes);
              };
          });
        }))};
    });

    Promise.all(promises)
      .then(function(results){
        var retorno = [];

        results.forEach(function (array) {
          array.forEach(function (subArray) {
            if(retorno.indexOf(subArray) === -1){
              retorno.push(subArray.class_name);
            }
          })
        })

        res.send(JSON.stringify(retorno));
      }).catch(function(errs) {
        res.send('MO não encontrado!');
      });

});


app.get('/listResult', function (req, res) {
  res.contentType('application/json');
  res.send(JSON.stringify(result));
});

app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});