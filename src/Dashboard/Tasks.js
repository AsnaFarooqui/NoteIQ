import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { API_BASE_URL } from '../App/config';
import {
  FaPlus, FaTrash, FaCheck, FaExclamationCircle,
  FaCircle, FaArrowDown, FaArrowUp, FaCalendarAlt, FaSearch
} from 'react-icons/fa';
import './Tasks.css';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   icon: <FaArrowUp />,   color: '#ef4444', bg: '#fef2f2' },
  medium: { label: 'Medium', icon: <FaCircle />,     color: '#f59e0b', bg: '#fffbeb' },
  low:    { label: 'Low',    icon: <FaArrowDown />,  color: '#22c55e', bg: '#f0fdf4' },
};

function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/task`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/task`, {
        method: 'POST', headers: authHeaders,
        body: JSON.stringify(newTask),
      });
      const task = await res.json();
      if (!res.ok) throw new Error(task.error);
      setTasks(prev => [task, ...prev]);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_BASE_URL}/task/${task.id}`, {
        method: 'PATCH', headers: authHeaders,
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (err) { setError('Failed to update task.'); }
  };

  const handleChangePriority = async (task, priority) => {
    try {
      const res = await fetch(`${API_BASE_URL}/task/${task.id}`, {
        method: 'PATCH', headers: authHeaders,
        body: JSON.stringify({ priority }),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (err) { setError('Failed to update priority.'); }
  };

  const handleDelete = async (taskId) => {
    try {
      await fetch(`${API_BASE_URL}/task/${taskId}`, { method: 'DELETE', headers: authHeaders });
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) { setError('Failed to delete task.'); }
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchStatus   = filterStatus === 'all'
      || (filterStatus === 'active' && !t.is_completed)
      || (filterStatus === 'done'   && t.is_completed);
    return matchSearch && matchPriority && matchStatus;
  });

  const counts = { total: tasks.length, active: tasks.filter(t => !t.is_completed).length, done: tasks.filter(t => t.is_completed).length };

  return (
    <div className="tasks-page">

      {/* Header */}
      <div className="tasks-header">
        <div className="tasks-title-row">
          <h1 className="tasks-title">Tasks <span className="task-count">{counts.active}</span></h1>
          <button className="new-task-btn" onClick={() => setShowForm(v => !v)}>
            <FaPlus /> New Task
          </button>
        </div>

        {/* Filters */}
        <div className="tasks-filters">
          <div className="filter-tabs">
            {['all','active','done'].map(s => (
              <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                {s === 'all' ? 'All Tasks' : s === 'active' ? 'Active' : 'Completed'}
              </button>
            ))}
          </div>
          <div className="filter-right">
            <div className="priority-filter">
              {['all','high','medium','low'].map(p => (
                <button key={p} className={`priority-pill ${filterPriority === p ? 'active' : ''}`}
                  style={filterPriority === p && p !== 'all' ? { background: PRIORITY_CONFIG[p].color, color: '#fff' } : {}}
                  onClick={() => setFilterPriority(p)}>
                  {p === 'all' ? 'All' : PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
            <div className="task-search-bar">
              <FaSearch className="search-icon-task" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find tasks..." />
            </div>
          </div>
        </div>
      </div>

      {/* New Task Form */}
      {showForm && (
        <form className="new-task-form" onSubmit={handleCreate}>
          <div className="form-row">
            <input
              autoFocus className="task-input-main"
              placeholder="Task title..."
              value={newTask.title}
              onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
              required
            />
            <select className="task-select"
              value={newTask.priority}
              onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <div className="due-date-input">
              <FaCalendarAlt className="cal-icon" />
              <input type="date" value={newTask.due_date}
                onChange={e => setNewTask(p => ({ ...p, due_date: e.target.value }))} />
            </div>
            <button type="submit" className="save-task-btn">Add</button>
            <button type="button" className="cancel-task-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <input className="task-input-desc"
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
        </form>
      )}

      {error && <div className="tasks-error">{error}</div>}

      {/* Tasks Table */}
      <div className="tasks-table-wrapper">
        <div className="tasks-table-header">
          <span className="col-title">Title</span>
          <span className="col-due">Due Date</span>
          <span className="col-priority">Priority</span>
          <span className="col-actions">Actions</span>
        </div>

        {loading ? (
          <div className="tasks-empty">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="tasks-empty">
            <FaExclamationCircle className="empty-icon" />
            <p>{search ? 'No tasks match your search.' : 'No tasks yet. Create your first one!'}</p>
          </div>
        ) : (
          <div className="tasks-list">
            {filtered.map(task => {
              const p = PRIORITY_CONFIG[task.priority];
              return (
                <div key={task.id} className={`task-row ${task.is_completed ? 'completed' : ''}`}>
                  {/* Checkbox */}
                  <button className={`task-checkbox ${task.is_completed ? 'checked' : ''}`}
                    onClick={() => handleToggleComplete(task)}>
                    {task.is_completed && <FaCheck />}
                  </button>

                  {/* Title */}
                  <div className="col-title">
                    <span className="task-title-text">{task.title}</span>
                    {task.description && <span className="task-desc-text">{task.description}</span>}
                  </div>

                  {/* Due Date */}
                  <div className="col-due">
                    {task.due_date
                      ? <span className="due-badge">{new Date(task.due_date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}</span>
                      : <span className="no-date">—</span>}
                  </div>

                  {/* Priority Selector */}
                  <div className="col-priority">
                    <div className="priority-badge-wrapper">
                      {['high','medium','low'].map(pr => (
                        <button key={pr}
                          className={`priority-dot ${task.priority === pr ? 'active' : ''}`}
                          style={{ background: task.priority === pr ? PRIORITY_CONFIG[pr].color : '' }}
                          title={PRIORITY_CONFIG[pr].label}
                          onClick={() => handleChangePriority(task, pr)} />
                      ))}
                      <span className="priority-label-text" style={{ color: p.color }}>
                        {p.icon} {p.label}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="col-actions">
                    <button className="delete-task-btn" onClick={() => handleDelete(task.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="tasks-footer">
        <span>{counts.total} total</span>
        <span className="active-count">{counts.active} active</span>
        <span className="done-count">{counts.done} completed</span>
      </div>

    </div>
  );
}

export default Tasks;
