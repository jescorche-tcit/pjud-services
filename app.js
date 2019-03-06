import express from 'express'
import LawyerServices from './lib/lawyers'

const app = express();

app.get('/', function (req, res) {
  LawyerServices.validate('888888888');
  res.send('Hello World!');
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
