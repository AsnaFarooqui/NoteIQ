const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, taskController.createTask);
router.patch('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;
