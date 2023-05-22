const braintree = require("braintree");
require("dotenv").config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANTID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

module.exports.genToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

module.exports.processPayment = (req, res) => {
  let nonce=req.body.paymentMethodNonce;
  let amount=req.body.amount;
  //  Charge
  let newTransaction=gateway.transaction.sale({
    amount:amount,
    paymentMethodNonce:nonce,
    options:{
      submitForSettlement:true
    }

  }, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

