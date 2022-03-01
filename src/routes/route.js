const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")

//creates new user
router.put('/user/:username', userController.createUser)

//get the details of the user
router.get('/user/:username', userController.getUser)

//adds a new subscription to a user
router.post('/subscription', userController.newSubscription)

//returns all the subscriton details of the user.
router.get('/subscription/:username/:date?', userController.getSubscription)

module.exports = router;