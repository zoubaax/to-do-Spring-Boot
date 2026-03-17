import { useState, useEffect } from 'react';
import './App.css';
import { TaskService } from './api/taskService';

/**
 * BEST PRACTICE: UI State Management
 * We use React hooks like useState (for data) and useEffect (to run code on start).
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // 1. Fetch data from backend when the component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await TaskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const addedTask = await TaskService.createTask({
        ...newTask,
        completed: false
      });
      setTasks([addedTask, ...tasks]); // Add to list immediately
      setNewTask({ title: '', description: '' }); // Clear form
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // 3. Toggle Complete (Update)
  const toggleComplete = async (task) => {
    try {
      const updatedTask = await TaskService.updateTask(task.id, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // 4. Delete a task
  const handleDelete = async (id) => {
    try {
      await TaskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Task Nexus</h1>

      {/* Modern Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          className="input-field"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description (Optional)"
          className="input-field"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button type="submit" className="add-btn">
          Create Task
        </button>
      </form>

      {/* Task List */}
      <div className="task-list">
        {isLoading ? (
          <div className="loading-spinner">Warping in your tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="loading-spinner">No tasks found. Create your first mission!</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'task-completed' : ''}`}>
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              
              <div className="task-actions">
                <button 
                  onClick={() => toggleComplete(task)}
                  className="action-btn check-btn"
                  title={task.completed ? "Mark Incomplete" : "Mark Complete"}
                >
                  {task.completed ? '⭕' : '✔️'}
                </button>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="action-btn delete-btn"
                  title="Delete Task"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
