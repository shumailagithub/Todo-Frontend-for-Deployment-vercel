import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sun,
  Moon,
  Filter,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token exists
      window.location.href = '/login';
      return; // Early return to stop further execution
    }

    // Load tasks from backend API on component mount
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        console.error('Failed to fetch tasks:', response.status);
        // If unauthorized, redirect to login
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([data.task, ...tasks]);
        setTitle('');
        setDescription('');
        setIsAdding(false);
      } else {
        console.error('Failed to add task:', response.status);
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map(task =>
          task.id === id ? data.task : task
        ));
      } else {
        console.error('Failed to toggle task:', response.status);
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        console.error('Failed to delete task:', response.status);
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map(task =>
          task.id === editingTask ? data.task : task
        ));
        setEditingTask(null);
        setEditTitle('');
        setEditDescription('');
      } else {
        console.error('Failed to update task:', response.status);
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.filter(task => !task.completed).length;

  // Loading indicator
  if (loading) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50/50 to-emerald-50'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className={darkMode ? 'text-white' : 'text-slate-900'}>Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50/50 to-emerald-50'
    }`}>
      {/* Subtle particle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${
                darkMode
                  ? 'from-purple-400 to-blue-400'
                  : 'from-purple-600 to-blue-600'
              } bg-clip-text text-transparent`}>
                TaskFlow
              </h1>
              <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} mt-2`}>
                Welcome back! Let's get things done ✨
              </p>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full backdrop-blur-lg border transition-all duration-300 ${
                  darkMode
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                } shadow-lg hover:shadow-xl`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login';
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Logout
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl backdrop-blur-lg border ${
                darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-slate-200'
              } shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-blue-500/10 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Total Tasks
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {tasks.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl backdrop-blur-lg border ${
                darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-slate-200'
              } shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-green-500/10 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Completed
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {completedCount}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-2xl backdrop-blur-lg border ${
                darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-slate-200'
              } shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-orange-500/10 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  <Circle size={24} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Active
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeCount}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Add Task Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className={`p-8 rounded-3xl backdrop-blur-lg border ${
            darkMode
              ? 'bg-white/10 border-white/20'
              : 'bg-white/80 border-slate-200'
          } shadow-2xl`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {isAdding ? 'Add New Task' : 'Create New Task'}
            </h2>

            <div className="space-y-6">
              {/* Title Input */}
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=" "
                  className={`w-full px-4 py-4 pt-6 rounded-xl border-2 bg-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    darkMode
                      ? 'border-white/20 text-white focus:border-purple-400'
                      : 'border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
                <label className={`absolute left-4 top-3 text-sm transition-all duration-300 pointer-events-none ${
                  title ?
                    darkMode ? 'text-purple-400 text-xs' : 'text-purple-500 text-xs'
                    : darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Task Title
                </label>
              </div>

              {/* Description Textarea */}
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder=" "
                  rows={4}
                  className={`w-full px-4 py-4 pt-6 rounded-xl border-2 bg-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    darkMode
                      ? 'border-white/20 text-white focus:border-purple-400'
                      : 'border-slate-200 text-slate-900 focus:border-purple-500'
                  } resize-none`}
                />
                <label className={`absolute left-4 top-3 text-sm transition-all duration-300 pointer-events-none ${
                  description ?
                    darkMode ? 'text-purple-400 text-xs' : 'text-purple-500 text-xs'
                    : darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Description
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addTask}
                disabled={!title.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Plus size={20} className="inline mr-2" />
                Add Task
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className={`flex items-center gap-2 p-2 rounded-2xl backdrop-blur-lg border ${
              darkMode
                ? 'bg-white/5 border-white/10'
                : 'bg-white/60 border-slate-200'
            } shadow-lg`}>
              {['all', 'active', 'completed'].map((filterType) => (
                <motion.button
                  key={filterType}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(filterType)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                    filter === filterType
                      ? darkMode
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : darkMode
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {filterType}
                </motion.button>
              ))}
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-2xl backdrop-blur-lg border ${
              darkMode
                ? 'bg-white/5 border-white/10'
                : 'bg-white/60 border-slate-200'
            } shadow-lg`}>
              <Filter size={20} className={darkMode ? 'text-slate-400' : 'text-slate-600'} />
              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Task List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-20 rounded-3xl backdrop-blur-lg border ${
                darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/60 border-slate-200'
              } shadow-2xl`}
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className={`text-6xl mb-4 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  ✨
                </motion.div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  No tasks yet!
                </h3>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Create your first task above to get started
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
                      darkMode
                        ? 'bg-white/10 border-white/20 hover:bg-white/15'
                        : 'bg-white/80 border-slate-200 hover:bg-white'
                    } shadow-lg hover:shadow-xl`}
                  >
                    {editingTask === task.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border-2 bg-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                            darkMode
                              ? 'border-white/20 text-white focus:border-purple-400'
                              : 'border-slate-200 text-slate-900 focus:border-purple-500'
                          }`}
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-2 rounded-lg border-2 bg-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                            darkMode
                              ? 'border-white/20 text-white focus:border-purple-400'
                              : 'border-slate-200 text-slate-900 focus:border-purple-500'
                          } resize-none`}
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveEdit}
                            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTask(task.id)}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            task.completed
                              ? 'bg-green-500/20 text-green-500'
                              : darkMode
                                ? 'bg-white/10 text-slate-400 hover:bg-white/20'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {task.completed ? <Check size={20} /> : <Circle size={20} />}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold mb-2 ${
                            task.completed
                              ? darkMode
                                ? 'text-slate-400 line-through'
                                : 'text-slate-500 line-through'
                              : darkMode
                                ? 'text-white'
                                : 'text-slate-900'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm ${
                              task.completed
                                ? darkMode
                                  ? 'text-slate-500 line-through'
                                  : 'text-slate-400 line-through'
                                : darkMode
                                  ? 'text-slate-300'
                                  : 'text-slate-600'
                            }`}>
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEditing(task)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              darkMode
                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTask(task.id)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              darkMode
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}