var express = require('express');
const authController = require('../controllers/auth.controller')
var router = express.Router();

router.post('/auth/login', authController.validateLogin, authController.login)


module.exports = router;