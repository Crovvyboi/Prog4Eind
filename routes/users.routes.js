var express = require('express');
const { json } = require('express/lib/response');
const authController = require('../controllers/auth.controller');
var router = express.Router();

const userController = require('../controllers/users.controller')

/* GET user listing. */
router.get('/users', authController.validate, userController.getUsers);

router.post('/users', authController.validate, userController.addUser);

router.get('/users/profile', authController.validate, userController.getUserProfile);

// router.get('/users/:id', userController.getUserId);

router.put('/users', authController.validate, userController.updateUser);

router.delete('/users', authController.validate, userController.deleteUser);



module.exports = router;
