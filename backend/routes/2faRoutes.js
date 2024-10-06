const express = require('express');
const { generate2FA, verify2FA } = require('../controllers/twoFaController');
const router = express.Router();

router.post('/generate-2fa', generate2FA);
router.post('/verify-2fa', verify2FA);

module.exports = router;
