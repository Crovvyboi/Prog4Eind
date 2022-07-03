var express = require('express');
const authController = require('../controllers/auth.controller');
var router = express.Router();

const mealController = require('../controllers/meals.controller')

/* GET meal listing. */
router.post('/meals', authController.validate, mealController.addMeal);

router.put('/meals', authController.validate, mealController.updateMeal);

router.get('/meals',  authController.validate, mealController.getMeals);

router.delete('/meals', authController.validate, mealController.removeMeal);

module.exports = router;