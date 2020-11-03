'use strict'

const express = require('express')
const router = express.Router()

const path = '/api'

router.post(path + '/stripe', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }

  const body = req.body
  
  const data = {
    type: body.type,
    name: body.data.object.billing_details.name,
    email: body.data.object.billing_details.email,
    phone: body.data.object.billing_details.phone,
    amount: body.data.object.amount,
    paid: body.data.object.paid
  }
  console.log(data);

  if (data.paid && data.type === 'charge.succeeded') {
    response.success = true;
    response.message = `${data.name} (${data.email}) has paid ${data.amount} (TYPE ${data.type}).`
  } else {
    response.success = false;
    response.message = `${data.name} (${data.email}) has FAILED TO PAY ${data.amount} (TYPE ${data.type}).`
  }

  return res.status(200).json(response);
})

module.exports = {router}
