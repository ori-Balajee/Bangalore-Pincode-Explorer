const express = require('express');
const router = express.Router();
const {getAreasByPincode} = require('../controllers/pincodeController');

router.get('/:code', getAreasByPincode);

module.exports = router;