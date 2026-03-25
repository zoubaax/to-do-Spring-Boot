import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import taskService from '../api/taskService';
import { 
  FiPlus, 
  FiTrash2, 
  FiCheckCircle, 
  FiRotateCcw, 
  FiClock, 
  FiActivity,
  FiList,
  FiAlertCircle
} from 'react-icons/fi';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            // BEST PRACTICE: Always ensure the data is an array before setting state
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]); // Fallback to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await taskService.createTask({ title, description, priority, completed: false });
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            fetchTasks();
        } catch (error) {
            alert("Error adding task!");
        }
    };

    const toggleComplete = async (task) => {
        try {
            await taskService.updateTask(task.id, { ...task, completed: !task.completed });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await taskService.deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const getPriorityColor = (p) => {
        switch(p) {
            case 'HIGH': return '#ef4444'; // Red
            case 'MEDIUM': return '#f59e0b'; // Amber
            case 'LOW': return '#10b981'; // Green
            default: return 'var(--primary)';
        }
    };

    const completedCount = Array.isArray(tasks) ? tasks.filter(t => t.completed).length : 0;

    return (
        <div className="tasks-page-container">
            <header className="tasks-header">
                <div className="tasks-header-content">
                    <h1>Your Dashboard</h1>
                    <p className="welcome-text">
                        Welcome back, <span>{user?.username}</span>. You have <span>{tasks.length - completedCount}</span> tasks pending.
                    </p>
                </div>
                <div className="stats-cards">
                    <div className="stat-card glass-morphism">
                        <FiList className="stat-icon total" />
                        <div className="stat-info">
                            <span className="stat-value">{tasks.length}</span>
                            <span className="stat-label">Total Tasks</span>
                        </div>
                    </div>
                    <div className="stat-card glass-morphism">
                        <FiActivity className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">{completedCount}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>
            </header>

            <form className="task-form-modern glass-morphism" onSubmit={handleAddTask}>
                <div className="form-row">
                    <div className="input-group">
                        <input 
                            className="input-field-modern"
                            type="text" 
                            placeholder="What needs to be done?" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="priority-select-container">
                        <select 
                            className="input-field-modern priority-select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <button className="add-btn-modern" type="submit">
                        <FiPlus /> Add Task
                    </button>
                </div>
                <textarea 
                    className="input-field-modern textarea-modern"
                    placeholder="Add more details (optional)..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </form>

            <div className="task-list-modern">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading your space...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state glass-morphism animate-fadeIn">
                        <FiClock className="empty-icon" />
                        <p>No tasks yet. Start your journey by adding one!</p>
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        <div 
                            key={task.id} 
                            className={`task-card-modern glass-morphism animate-slideUp ${task.completed ? 'completed' : ''}`}
                            style={{ 
                                animationDelay: `${index * 0.05}s`,
                                borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                            }}
                        >
                            <div className="task-card-main">
                                <div className="task-text">
                                    <div className="task-title-row">
                                        <span 
                                            className="priority-indicator" 
                                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                                        ></span>
                                        <h3>{task.title}</h3>
                                    </div>
                                    {task.description && <p>{task.description}</p>}
                                </div>
                                <div className="task-actions-modern">
                                    <button 
                                        className={`action-btn-modern check ${task.completed ? 'active' : ''}`} 
                                        onClick={() => toggleComplete(task)}
                                        title={task.completed ? "Undo Completion" : "Complete Task"}
                                    >
                                        {task.completed ? <FiRotateCcw /> : <FiCheckCircle />}
                                    </button>
                                    <button 
                                        className="action-btn-modern delete" 
                                        onClick={() => deleteTask(task.id)}
                                        title="Delete Task"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="task-footer-modern">
                                <div className="task-badges">
                                    <span className="task-tag">
                                        {user.role === 'ROLE_ADMIN' ? 'Admin View' : 'Personal'}
                                    </span>
                                    <span 
                                        className="priority-badge" 
                                        style={{ color: getPriorityColor(task.priority), backgroundColor: `${getPriorityColor(task.priority)}15` }}
                                    >
                                        <FiAlertCircle size={12} />
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Tasks;
