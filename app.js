import express from 'express'
import LawyerServices from './lib/lawyers'

const app = express();

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

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
