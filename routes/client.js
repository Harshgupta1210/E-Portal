const express = require('express');
const router = express.Router();

const userController = require('../controllers/users_controller');

router.get('/register',userController.register);
router.get('/logging',userController.logging);
router.get('/dashboard_client',userController.Dashboard_client);
router.get('/face',userController.face);
router.post('/client_register',userController.client_register);
router.post('/client_login',userController.client_login)
module.exports = router;