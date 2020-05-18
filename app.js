import express from 'express'
import LawyerServices from './lib/lawyers'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

const app = express();

const xmlParser = bodyParser.text({ type: 'application/xml' })

app.get('/', function (req, res, next) {
  const taxNumber = req.query.rut;
  if (taxNumber) {
    LawyerServices.validate(taxNumber, (data) => {
      res.send(data);
    }, next);
  } else {
    throw new Error("RUT wasn't included or it isn't valid");
  }
});

app.post('/remissions', xmlParser, (req, res, next) => {
  console.log('Received XML:\n', req.body);
  const requestBody = req.body;
  const destinyUrl = req.get('Destiny-Url');
  const soapAction = req.get('SOAPAction');

  const headers = {
    'Content-Type': 'application/xml',
    'SOAPAction': soapAction
  };

  fetch(destinyUrl, { headers, method: 'POST', body: requestBody })
    .then((response) => response.text())
    .then((data) => {
      res.set('Content-Type', 'application/xml');
      res.send(data);
    })
    .catch((error) => {
      next(error);
    });
});

app.listen(8081, function () {
  console.log('App listening on port 8081!');
});
