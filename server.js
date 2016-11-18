config = require('./services/config');
var sdk = require('./node_modules/todo-pago');

/* Routers */
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var parameters = {
  'Session': 'ABCDEF-1234-12221-FDE1-00000200',
  'Security':'c4a9eb9f1b6d421297c7c6cf9bb06e50',
  'EncodingMethod':'XML',
  'Merchant':16002,
  'URL_OK':'http://192.168.0.35:5000/ok/',
  'URL_ERROR':'http://192.168.0.35:5000/fail/',
  'MERCHANT': "16002",
  'OPERATIONID':"1",
  'CURRENCYCODE': "032",
  'AMOUNT':"54",
  'MAXINSTALLMENTS':"1",
  'MAXINSTALLMENTS':"6"
};

var fraudControl = {
  'CSBTCITY': 'Quilmes Oeste',
  'CSBTCOUNTRY': 'AR',
  'CSBTCUSTOMERID': '00001',
  'CSBTEMAIL': 'pasutmarcelo@hotmail.com',
  'CSBTFIRSTNAME': 'Marcelo',
  'CSBTIPADDRESS': '192.168.0.35',
  'CSBTLASTNAME': 'Pasut',
  'CSBTPHONENUMBER': '541164080807',
  'CSBTPOSTALCODE': ' 1878',
  'CSBTSTATE': 'B',
  'CSBTSTREET1': 'Lavalleja 1745',
  'CSPTCURRENCY': 'ARS',
  'CSPTGRANDTOTALAMOUNT': '54.00',
  'CSSTCITY': 'Quilmes',
  'CSSTCOUNTRY': 'AR',
  'CSSTEMAIL': 'pasutmarcelo@gmail.com',
  'CSSTFIRSTNAME': 'Marcelo',
  'CSSTLASTNAME': 'Pasut',
  'CSSTPHONENUMBER': '541160913988',
  'CSSTPOSTALCODE': ' 1878',
  'CSSTSTATE': 'B',
  'CSSTSTREET1': 'Lavalleja 1745',
  'CSMDD1': '22',
  'CSMDD2': 'Wolla inc',
  'CSMDD3': 'services',
  'CSITPRODUCTCODE': 'electronic_good#chocho',
  'CSITPRODUCTDESCRIPTION': 'NOTEBOOK L845 SP4304LA DF TOSHIBA#chocho',
  'CSITPRODUCTNAME': 'NOTEBOOK L845 SP4304LA DF TOSHIBA#chocho',
  'CSITPRODUCTSKU': 'LEVJNSL36GN#chocho',
  'CSITTOTALAMOUNT': '54.00#10.00',
  'CSITQUANTITY': '1#1',
  'CSITUNITPRICE': '54.00#15.00'
};

var options = {
  endpoint : "developers", // "developers" o "production"
  Authorization:'TODOPAGO c4a9eb9f1b6d421297c7c6cf9bb06e50',
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

var requestKey = '';
/* ENDPOINTS */
app.post('/pago/:amount', (req, res) => {
  parameters.AMOUNT = req.params.amount;
  sdk.sendAutorizeRequest(options, parameters, fraudControl, function(result, err){
    console.log("------------- sendAutorizeRequest ---------------");
    if(result){
      console.log(result);
    }
    if(err){
      console.error(err);
    }
    console.log("------------------------------------------------");
    requestKey = result.RequestKey;
    if (result.StatusCode == -1) {
      res.status(202).send({url: result.URL_Request});
    } else {
      res.status(400).send();
    }
  });
});

app.get('/ok', (req, res) => {
  var answer = req.query.Answer;
  var params = {
    'Security':'c4a9eb9f1b6d421297c7c6cf9bb06e50',
    'Merchant':'16002',
    'RequestKey': requestKey,
    'AnswerKey': answer
  };
  sdk.getAutorizeAnswer(options, params, function(result, err){
    console.log("getAutorizeAnswer");
    console.log(result);
    console.log(err);
    console.log("-------------------");
    var html = "<html><body><script type='text/javascript'>android.finishOk();</script></body></html>";
    res.send(html);
  });
});

app.get('/fail', (req, res) => {
  res.status(400).send('fail');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


