import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTasks, createTask, toggleTask as apiToggleTask, deleteTask as apiDeleteTask } from '@/lib/api';
import { isAuthenticated, clearAuth, getCurrentUser } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import Navbar from '@/components/Navbar';
import {
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
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
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
      const response = await getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.message.includes('401')) {
        window.location.href = '/login';
      }
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

  const handleAddTask = async (title, description) => {
    try {
      const response = await createTask(title, description);
      setTasks([response.task, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
      if (error.message.includes('401')) {
        window.location.href = '/login';
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await apiToggleTask(taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? response.task : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      if (error.message.includes('401')) {
        window.location.href = '/login';
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiDeleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.message.includes('401')) {
        window.location.href = '/login';
      }
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
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
    <ProtectedRoute>
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

        {currentUser && (
          <Navbar 
            username={currentUser.username} 
            onLogout={handleLogout} 
          />
        )}

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
                  Welcome back! Let&apos;s get things done ✨
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
                Create New Task
              </h2>

              <TaskForm onSubmit={handleAddTask} />
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
            <TaskList 
              tasks={filteredTasks} 
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          </motion.section>
        </div>
      </div>
    </ProtectedRoute>
  );
}