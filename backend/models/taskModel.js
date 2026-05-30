const pool = require('../db2');

const getAllTasks = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE user_id = $1 ORDER BY 
     CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
     is_completed ASC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const createTask = async (userId, title, description, priority, due_date) => {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, description || null, priority || 'medium', due_date || null]
  );
  return result.rows[0];
};

const updateTask = async (taskId, userId, fields) => {
  const { title, description, priority, due_date, is_completed } = fields;
  const result = await pool.query(
    `UPDATE tasks SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       priority = COALESCE($3, priority),
       due_date = COALESCE($4, due_date),
       is_completed = COALESCE($5, is_completed),
       updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [title, description, priority, due_date, is_completed, taskId, userId]
  );
  return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [taskId, userId]
  );
  return result.rows[0];
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
