var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();

const userController = require('../controllers/users.controller')

/* GET user listing. */
router.get('/users', userController.getUsers);

router.post('/users/post', userController.addUser);

router.get('/users/profile', userController.getUserProfile);

router.get('/users/:id', userController.getUserId);

router.put('/users/update', userController.updateUser);

router.delete('/users/remove', userController.deleteUser);



module.exports = router;
