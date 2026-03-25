import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import taskService from '../api/taskService';
import Sidebar from '../components/Sidebar';
import { 
  FiPlus, 
  FiTrash2, 
  FiCheckCircle, 
  FiRotateCcw, 
  FiClock, 
  FiActivity,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiStar,
  FiSearch,
  FiBell,
  FiUser,
  FiCalendar,
  FiMoreHorizontal,
  FiEdit2,
  FiTag,
  FiX,
  FiFilter,
  FiGrid,
  FiBarChart2,
  FiEye,
  FiShare2,
  FiFlag,
  FiFolder,
  FiSmile,
  FiAward
} from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showStats, setShowStats] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            // Add timestamps if not present
            const tasksWithDates = (Array.isArray(data) ? data : []).map(task => ({
                ...task,
                createdAt: task.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: task.updatedAt || new Date().toISOString()
            }));
            setTasks(tasksWithDates);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            const newTask = { 
                title, 
                description, 
                priority, 
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await taskService.createTask(newTask);
            resetForm();
            setShowAddModal(false);
            fetchTasks();
        } catch (error) {
            alert("Error adding task!");
        }
    };

    const handleEditTask = async (e) => {
        e.preventDefault();
        if (!editingTask || !title.trim()) return;
        try {
            await taskService.updateTask(editingTask.id, { 
                ...editingTask,
                title, 
                description, 
                priority,
                updatedAt: new Date().toISOString()
            });
            resetForm();
            setEditingTask(null);
            setShowAddModal(false);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Error updating task!");
        }
    };

    const toggleComplete = async (task) => {
        try {
            await taskService.updateTask(task.id, { 
                ...task, 
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : null,
                updatedAt: new Date().toISOString()
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority || 'MEDIUM');
        setShowAddModal(true);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setEditingTask(null);
    };

    const getPriorityStyle = (p) => {
        switch(p) {
            case 'HIGH': 
                return { 
                    color: 'text-red-400', 
                    bg: 'bg-red-500/10', 
                    border: 'border-red-500/20',
                    glow: 'shadow-red-500/20',
                    label: 'Critical',
                    icon: '🚨'
                };
            case 'MEDIUM': 
                return { 
                    color: 'text-amber-400', 
                    bg: 'bg-amber-500/10', 
                    border: 'border-amber-500/20',
                    glow: 'shadow-amber-500/20',
                    label: 'Important',
                    icon: '⚡'
                };
            case 'LOW': 
                return { 
                    color: 'text-emerald-400', 
                    bg: 'bg-emerald-500/10', 
                    border: 'border-emerald-500/20',
                    glow: 'shadow-emerald-500/20',
                    label: 'Normal',
                    icon: '🍃'
                };
            default: 
                return { 
                    color: 'text-blue-400', 
                    bg: 'bg-blue-500/10', 
                    border: 'border-blue-500/20',
                    glow: 'shadow-blue-500/20',
                    label: 'Default',
                    icon: '📌'
                };
        }
    };

    // Sort tasks
    const getSortedTasks = (tasksToSort) => {
        switch(sortBy) {
            case 'newest':
                return [...tasksToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...tasksToSort].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'priority':
                const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                return [...tasksToSort].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            case 'alphabetical':
                return [...tasksToSort].sort((a, b) => a.title.localeCompare(b.title));
            default:
                return tasksToSort;
        }
    };

    const filteredTasks = getSortedTasks(tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
        const matchesStatus = filterStatus === 'ALL' || 
                             (filterStatus === 'COMPLETED' && task.completed) ||
                             (filterStatus === 'ACTIVE' && !task.completed);
        return matchesSearch && matchesPriority && matchesStatus;
    }));

    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.length - completedCount;
    const completionRate = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    const stats = [
        { label: 'Total Tasks', value: tasks.length, icon: FiList, color: 'blue' },
        { label: 'Completed', value: completedCount, icon: FiCheckCircle, color: 'emerald' },
        { label: 'Active', value: activeCount, icon: FiActivity, color: 'amber' },
        { label: 'Completion', value: `${completionRate}%`, icon: FiTrendingUp, color: 'purple' },
    ];

    return (
        <div className="flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen text-slate-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                {/* Header */}
                <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
                    <div className="px-8 py-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                    Task Management
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">
                                    Organize, track, and complete your work efficiently
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* View Toggle */}
                                <div className="flex bg-slate-800/50 rounded-xl p-1">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <FiGrid className="inline mr-2" size={14} /> Grid
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <FiList className="inline mr-2" size={14} /> List
                                    </button>
                                </div>
                                
                                {/* Stats Toggle */}
                                <button 
                                    onClick={() => setShowStats(!showStats)}
                                    className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                                >
                                    <FiBarChart2 size={18} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="flex flex-wrap items-center gap-4 mt-6">
                            <div className="relative flex-1 min-w-[200px] max-w-md">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="text"
                                    placeholder="Search tasks by title or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            
                            <select 
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="ALL">All Priorities</option>
                                <option value="HIGH">High Priority</option>
                                <option value="MEDIUM">Medium Priority</option>
                                <option value="LOW">Low Priority</option>
                            </select>
                            
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                            
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="priority">Priority (High to Low)</option>
                                <option value="alphabetical">Alphabetical</option>
                            </select>
                            
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                                <FiPlus /> New Task
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-8">
                    {/* Stats Cards */}
                    {showStats && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="text-xl" />
                                        </div>
                                        <FiTrendingUp className="text-slate-600 text-sm" />
                                    </div>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Tasks Display */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <FiClock className="text-3xl text-slate-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                            <p className="text-slate-400 mb-6">
                                {searchQuery || filterPriority !== 'ALL' || filterStatus !== 'ALL' 
                                    ? "Try adjusting your filters to see more results"
                                    : "Create your first task to get started"}
                            </p>
                            {(searchQuery || filterPriority !== 'ALL' || filterStatus !== 'ALL') ? (
                                <button 
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterPriority('ALL');
                                        setFilterStatus('ALL');
                                    }}
                                    className="px-6 py-3 bg-slate-800 text-white font-medium rounded-xl inline-flex items-center gap-2 hover:bg-slate-700 transition-all"
                                >
                                    <FiX /> Clear Filters
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setShowAddModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl inline-flex items-center gap-2 hover:shadow-lg transition-all"
                                >
                                    <FiPlus /> Create Task
                                </button>
                            )}
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => {
                                const style = getPriorityStyle(task.priority);
                                return (
                                    <div 
                                        key={task.id}
                                        className={`bg-slate-900/50 backdrop-blur-sm border ${style.border} rounded-2xl p-6 hover:border-slate-700 transition-all group ${task.completed ? 'opacity-70' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`px-3 py-1.5 rounded-xl ${style.bg} ${style.color} text-xs font-bold flex items-center gap-2`}>
                                                <span>{style.icon}</span>
                                                <span>{style.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!task.completed && (
                                                    <button 
                                                        onClick={() => openEditModal(task)}
                                                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                                        title="Edit task"
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => toggleComplete(task)}
                                                    className={`p-2 rounded-lg transition-all ${task.completed ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}
                                                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                                                >
                                                    {task.completed ? <FiRotateCcw size={14} /> : <FiCheckCircle size={14} />}
                                                </button>
                                                <button 
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                    title="Delete task"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <h3 className={`text-lg font-semibold text-white mb-2 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                            {task.title}
                                        </h3>
                                        
                                        {task.description && (
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                                        )}
                                        
                                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">{user?.username || 'You'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="text-slate-500 text-xs" />
                                                <span className="text-xs text-slate-500">
                                                    {task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-800/50 border-b border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Task</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredTasks.map((task) => {
                                            const style = getPriorityStyle(task.priority);
                                            return (
                                                <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => toggleComplete(task)}
                                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-500'}`}
                                                        >
                                                            {task.completed && <FiCheckCircle className="text-white text-xs" />}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className={`text-white font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                                                {task.title}
                                                            </p>
                                                            {task.description && (
                                                                <p className="text-slate-500 text-sm mt-1 line-clamp-1">{task.description}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.color}`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-400">
                                                        {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {!task.completed && (
                                                                <button 
                                                                    onClick={() => openEditModal(task)}
                                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                                                >
                                                                    <FiEdit2 size={14} />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => deleteTask(task.id)}
                                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                            >
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                }}>
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"></div>
                    <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h2 className="text-2xl font-bold text-white">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                        
                        <form onSubmit={editingTask ? handleEditTask : handleAddTask} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Task Title *</label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Add task details (optional)..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
                                <select 
                                    value={priority || 'MEDIUM'}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="LOW">Low Priority 🍃</option>
                                    <option value="MEDIUM">Medium Priority ⚡</option>
                                    <option value="HIGH">High Priority 🚨</option>
                                </select>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;