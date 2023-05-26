const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyFlags = require('../../middleware/verifyFlags');

router.route('/')
    .get(verifyFlags("FLAG_VIEW"), usersController.getAllUsers)
    .post(verifyFlags("FLAG_CREATE"), usersController.createNewUser)
    .put(verifyFlags("FLAG_EDIT"), usersController.updateUser)
    .delete(verifyFlags("FLAG_DELETE"), usersController.deleteUser);

router.route('/:id')
    .get(verifyFlags("FLAG_EDIT"), usersController.getUser);

module.exports = router;