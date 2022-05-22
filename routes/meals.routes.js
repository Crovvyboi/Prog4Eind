var express = require('express');
const { json } = require('express/lib/response');
const authController = require('../controllers/auth.controller');
var router = express.Router();

const mealController = require('../controllers/meals.controller')

/* GET meal listing. */
router.post('/meals/post',authController.login, authController.validate, mealController.addMeal);

router.put('/meals/update',authController.login, authController.validate, mealController.updateMeal);

router.get('/meals',  mealController.getMeals);

router.delete('/meals/remove',authController.login, authController.validate, mealController.removeMeal);

module.exports = router;