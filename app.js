import express from 'express'
import LawyerServices from './lib/lawyers'

const app = express();

app.get('/', function (req, res) {
  const taxNumber = req.query.rut;
  if (taxNumber) {
    LawyerServices.validate(taxNumber, (data) => {
      res.send(data);
    });
  } else {
    throw new Error("RUT wasn't included or it isn't valid");
  }
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
