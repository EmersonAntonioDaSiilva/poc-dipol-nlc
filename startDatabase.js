var nano = require('nano')('https://6fb9d344-3e7c-48f1-845d-ef672216af56-bluemix:3b70c7a9d7bbbfd587b744851f61edb3f105da99ca76bcfad05825ed58c03841@6fb9d344-3e7c-48f1-845d-ef672216af56-bluemix.cloudant.com');

// clean up the database we created previousl
nano.db.destroy('prints', function() {
  // create a new database
  nano.db.create('prints', function() {
    // specify the database we are going to use
    var prints = nano.use('prints');
    // and insert a document in it
    prints.insert({ 'landscapes': [
  {
    "classifier_id": "90e7b7x198-nlc-4946",
    "texto": ", na mao e mediante grave ameaça lhe subtrairam o veículo.",
    "classes": [
      {
        "class_name": "Caracter_Força_Fisica",
        "confidence": 0.9806416270074992
      },
      {
        "class_name": "Caracter_Sem_Violencia",
        "confidence": 0.005087274907787098
      }
    ]
  },
  {
    "classifier_id": "90e7b7x198-nlc-4946",
    "texto": "Comparece a vítima nesta delegacia noticiando que assim que retirou o veículo da garagem, estacionando-o defronte sua casa dois individuos, um aparentando ser maior de idade e outro menor, lhe abordaram, tendo o individuo mais velho uma arma de fogo",
    "classes": [
      {
        "class_name": "Caracter_Armado",
        "confidence": 0.9480817204482705
      },
      {
        "class_name": "Abordagem_Faca",
        "confidence": 0.02035068250776396
      }
    ]
  }
]}, 'inventory', function(err, body, header) {
      if (err) {
        console.log('Error creating document - ', err.message);
        return;
      }
      console.log('all records inserted.')
      console.log(body);
    });
  



});
});