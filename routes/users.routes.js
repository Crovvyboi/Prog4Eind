var express = require('express');
const { json } = require('express/lib/response');
const authController = require('../controllers/auth.controller');
var router = express.Router();

const userController = require('../controllers/users.controller')

/* GET user listing. */
router.get('/users', authController.login, authController.validate, userController.getUsers);

router.post('/users/post', authController.login, authController.validate, userController.addUser);

router.get('/users/profile', authController.login, authController.validate, userController.getUserProfile);

// router.get('/users/:id', userController.getUserId);

router.put('/users/update', authController.login, authController.validate, userController.updateUser);

router.delete('/users/remove', authController.login, authController.validate, userController.deleteUser);



module.exports = router;
