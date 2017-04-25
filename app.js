var express = require('express');
var cfenv = require('cfenv');

var appEnv = cfenv.getAppEnv();
var dbCreds =  appEnv.getServiceCreds('analitycsNLCdb');

var nano, prints;

if (dbCreds) {
	console.log('URL is ' + dbCreds.url);
	nano = require('nano')(dbCreds.url);
	prints = nano.use('prints');
} else {

	console.log('NO DB!');
}

var app = express();
var result = [];

const fs = require('fs');
var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

var natural_language_classifier = new NaturalLanguageClassifierV1({
  username: '0ec6f1bc-d977-428f-b2a4-4530df881f57',
  password: '6CXohUxzv5pq',
  version: 'v1'
});

var bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json' }));

const gravarDados = function(retorno) {
  if (dbCreds) {
    prints.insert({ 'poc-dipol': retorno}, 'poc-dipol_' + result.length, function(err, body, header) {
      if (err) {
        console.log('Error creating document - ', err.message);
        return;
      }
      console.log('all records inserted.')
      console.log(body);
    });
  } else {
    console.log('NO DB!');
  }
};


app.post('/postNlcDipol', function (req, res) {  
    console.log("==== Retorno: " + JSON.stringify(req.body));
    
    var classifier_id = req.body.cl;
    console.log("==== classifier_id: " + classifier_id);
    
    var texto = req.body.texto;
    console.log("==== texto: " + texto);

    var textofatiado = texto.split('tx=');
    console.log("==== textofatiado: " + textofatiado);

    var promises = [];

    textofatiado.forEach(function (texto) {
      if(texto.length > 4){
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

                var retorno = [];
                retorno.push({classifier_id: classifier_id, texto: texto, classes: classes});

                gravarDados(retorno);

                resolve(classes);
              };
          });
        }))};
    });

    Promise.all(promises)
      .then(function(results){
        var retorno = '';

        console.log("results = = " + results);

        results.forEach(function (array) {
          console.log("array = = " + array);

          array.forEach(function (subArray) {
            console.log("subArray = = " + subArray.class_name);
          
              if(retorno.length == 0){
                retorno = subArray.class_name;
              } else {
                if(retorno.indexOf(subArray.class_name) <= 0){
                  retorno = retorno + ',' + subArray.class_name;
                }
              }
                console.log("retorno = = " + retorno);
          })
        })

        res.send(retorno);
      }).catch(function(errs) {
        res.send('MO não encontrado!');
      });

});

app.get('/getNlcDipol/:cl/:tx', function (req, res) {
    var classifier_id = req.params.cl;
    var textofatiado = req.params.texto.split('tx=');

    var promises = [];
    textofatiado.forEach(function (texto) {
      if(texto.length > 5){
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

                var retorno = [];
                retorno.push({classifier_id: classifier_id, texto: texto, classes: classes});

                gravarDados(retorno);

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
              if(retorno.length === 0){
                retorno = subArray.class_name;
              } else {
                retorno = retorno + ',' + subArray.class_name;
              }
            }
          })
        })

        res.send(retorno);
      }).catch(function(errs) {
        res.send('MO não encontrado!');
      });

});

app.get('/nlcDipol', function (req, res) {
    var classifier_id = req.param('cl');
    var texto = req.param('tx');

    var promises = [];
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

            var retorno = [];
            retorno.push({classifier_id: classifier_id, texto: texto, classes: classes});

            gravarDados(retorno);

            resolve(classes);
          };
      });
    }));


    Promise.all(promises)
      .then(function(results){
        var retorno = "";

        results.forEach(function (array) {
          array.forEach(function (subArray) {
            if(retorno.indexOf(subArray) === -1){
              if(retorno.length === 0){
                retorno = subArray.class_name;
              } else {
                retorno = retorno + ',' + subArray.class_name;
              }
            }
          })
        })

        res.send(retorno);
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