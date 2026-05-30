const taskModel = require('../models/taskModel');
const logger = require('../utils/logger');

const getTasks = async (req, res) => {
  const userId = req.user.userId;
  try {
    const tasks = await taskModel.getAllTasks(userId);
    res.status(200).json(tasks);
  } catch (err) {
    logger.error({ err, userId }, 'Error fetching tasks');
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const createTask = async (req, res) => {
  const userId = req.user.userId;
  const { title, description, priority, due_date } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }
  try {
    const task = await taskModel.createTask(userId, title.trim(), description, priority, due_date);
    logger.info({ userId, taskId: task.id }, 'Task created');
    res.status(201).json(task);
  } catch (err) {
    logger.error({ err, userId }, 'Error creating task');
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;
  const fields = req.body;
  try {
    const task = await taskModel.updateTask(taskId, userId, fields);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    logger.info({ userId, taskId }, 'Task updated');
    res.status(200).json(task);
  } catch (err) {
    logger.error({ err, userId }, 'Error updating task');
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;
  try {
    const deleted = await taskModel.deleteTask(taskId, userId);
    if (!deleted) return res.status(404).json({ error: 'Task not found.' });
    logger.info({ userId, taskId }, 'Task deleted');
    res.status(200).json({ message: 'Task deleted.' });
  } catch (err) {
    logger.error({ err, userId }, 'Error deleting task');
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
