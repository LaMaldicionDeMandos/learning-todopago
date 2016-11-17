config = require('./services/config');

/* Routers */
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

/* ENDPOINTS */
app.use('/', (req, res) => res.send('Hola todo pago'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


