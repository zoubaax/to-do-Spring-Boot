import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import taskService from '../api/taskService';
import Sidebar from '../components/Sidebar';
import {
    FiPlus, FiTrash2, FiCheckCircle, FiClock, FiActivity,
    FiList, FiSearch, FiEdit2, FiX,
    FiGrid, FiBox, FiCheck, FiFilter,
    FiUser, FiArrowUp, FiZap, FiMoreVertical
} from 'react-icons/fi';
import {
    format, isPast
} from 'date-fns';
import toast from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    useDroppable
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Task Card Component
const SortableTaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityStyle = getPriorityStyle(task.priority);
    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'DONE';

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, borderColor: 'rgba(59,130,246,0.3)' }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 transition-all group"
        >
            <div className="flex items-start gap-2">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FiMoreVertical className="text-slate-500 text-sm" />
                </div>
                
                <div className="flex-1" onClick={() => onEdit(task)}>
                    <div className="flex items-start justify-between mb-3">
                        <div className={`px-2 py-0.5 rounded-lg text-xs font-bold ${priorityStyle.bg} ${priorityStyle.color}`}>
                            {priorityStyle.icon} {task.priority}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {task.status !== 'DONE' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE';
                                        onStatusChange(task, nextStatus);
                                    }}
                                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                    title="Move to next stage"
                                >
                                    <FiArrowUp size={12} />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                title="Delete"
                            >
                                <FiTrash2 size={12} />
                            </button>
                        </div>
                    </div>

                    <h4 className={`font-semibold text-white mb-2 text-sm ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            {task.dueDate && (
                                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                                    <FiClock size={10} />
                                    <span className="text-[10px]">{format(new Date(task.dueDate), 'MMM d')}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <FiUser size={10} />
                            <span className="text-[10px]">{task.assignee?.split(' ')[0] || 'Unassigned'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Helper function (needs to be defined before use)
const getPriorityStyle = (p) => {
    switch (p) {
        case 'HIGH':
            return {
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                icon: '🚨',
                label: 'Critical'
            };
        case 'MEDIUM':
            return {
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                icon: '⚡',
                label: 'Important'
            };
        case 'LOW':
            return {
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                icon: '🍃',
                label: 'Normal'
            };
        default:
            return {
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                icon: '📌',
                label: 'Default'
            };
    }
};

// Kanban Column Component
const KanbanColumn = ({ column, tasks, onEdit, onDelete, onStatusChange, isOverlay = false }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });
    
    const columnTasks = tasks.filter(t => t.status === column.id);
    
    return (
        <div className="w-80 shrink-0 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${column.color}-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]`}></div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {column.title}
                    </h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                    {columnTasks.length}
                </span>
            </div>
            
            <div 
                ref={setNodeRef}
                className={`flex-1 rounded-2xl transition-all duration-200 ${isOver ? 'bg-blue-500/5 ring-2 ring-blue-500/20' : 'bg-transparent'}`}
            >
                <SortableContext
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3 min-h-[300px] p-1">
                        {columnTasks.map(task => (
                            <SortableTaskCard
                                key={task.id}
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                            />
                        ))}
                        {columnTasks.length === 0 && !isOverlay && (
                            <div className="h-full flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-800/50 rounded-xl opacity-40">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Empty Zone</p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState('kanban');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const { user } = useAuth();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            const normalizedData = (Array.isArray(data) ? data : []).map(task => ({
                ...task,
                status: task.status || (task.completed ? 'DONE' : 'TODO'),
                createdAt: task.createdAt || new Date().toISOString(),
                assignee: task.assignee || user?.username || 'Unassigned',
                comments: task.comments || []
            }));
            setTasks(normalizedData);
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
                status: 'TODO',
                dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
                assignee: user?.username,
                createdAt: new Date().toISOString(),
                comments: []
            };
            await taskService.createTask(newTask);
            resetForm();
            setShowAddModal(false);
            fetchTasks();
            toast.success('Task created successfully!');
        } catch (error) {
            toast.error("Error adding task!");
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
                dueDate: dueDate ? (typeof dueDate === 'string' ? dueDate : dueDate.toISOString().split('T')[0]) : null,
                updatedAt: new Date().toISOString()
            });
            resetForm();
            setEditingTask(null);
            setShowAddModal(false);
            fetchTasks();
            toast.success('Task updated successfully!');
        } catch (error) {
            toast.error("Error updating task!");
        }
    };

    const updateTaskStatus = async (task, newStatus) => {
        try {
            await taskService.updateTask(task.id, {
                ...task,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                completedAt: newStatus === 'DONE' ? new Date().toISOString() : null
            });
            fetchTasks();
            toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            toast.error("Failed to move task");
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
                toast.success('Task deleted successfully');
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority || 'MEDIUM');
        setDueDate(task.dueDate ? new Date(task.dueDate) : null);
        setShowAddModal(true);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setDueDate(null);
        setEditingTask(null);
    };

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        // 1. Drop on a column background directly
        const validColumns = ['TODO', 'IN_PROGRESS', 'DONE'];
        if (validColumns.includes(over.id)) {
            if (activeTask.status !== over.id) {
                await updateTaskStatus(activeTask, over.id);
            }
            return;
        }

        // 2. Drop on another task (over.id is a Task ID)
        const overTask = tasks.find(t => t.id === over.id);
        if (overTask && activeTask.status !== overTask.status) {
            await updateTaskStatus(activeTask, overTask.status);
        }
    }, [tasks]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const columns = [
        { id: 'TODO', title: 'TO DO', icon: FiClock, color: 'blue' },
        { id: 'IN_PROGRESS', title: 'IN PROGRESS', icon: FiActivity, color: 'amber' },
        { id: 'DONE', title: 'DONE', icon: FiCheckCircle, color: 'emerald' }
    ];

    const filteredTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
            const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
            return matchesSearch && matchesPriority && matchesStatus;
        });

        switch (sortBy) {
            case 'newest':
                return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'priority':
                const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                return [...filtered].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            case 'dueDate':
                return [...filtered].sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
            default:
                return filtered;
        }
    }, [tasks, searchQuery, filterPriority, filterStatus, sortBy]);

    const stats = {
        total: tasks.length,
        active: tasks.filter(t => t.status !== 'DONE').length,
        completed: tasks.filter(t => t.status === 'DONE').length,
        highPriority: tasks.filter(t => t.priority === 'HIGH').length,
        completionRate: tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100)
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    // Regular Task Card for non-drag contexts
    const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
        const priorityStyle = getPriorityStyle(task.priority);
        const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'DONE';

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, borderColor: 'rgba(59,130,246,0.3)' }}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 transition-all cursor-pointer group"
                onClick={() => onEdit(task)}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className={`px-2 py-0.5 rounded-lg text-xs font-bold ${priorityStyle.bg} ${priorityStyle.color}`}>
                        {priorityStyle.icon} {task.priority}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.status !== 'DONE' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE';
                                    onStatusChange(task, nextStatus);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                title="Move to next stage"
                            >
                                <FiArrowUp size={12} />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(task.id);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                            title="Delete"
                        >
                            <FiTrash2 size={12} />
                        </button>
                    </div>
                </div>

                <h4 className={`font-semibold text-white mb-2 text-sm ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                </h4>

                {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                )}

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        {task.dueDate && (
                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                                <FiClock size={10} />
                                <span className="text-[10px]">{format(new Date(task.dueDate), 'MMM d')}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                        <FiUser size={10} />
                        <span className="text-[10px]">{task.assignee?.split(' ')[0] || 'Unassigned'}</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Kanban Board with Drag and Drop
    const KanbanBoard = () => {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-5 overflow-x-auto pb-6" style={{ minHeight: 'calc(100vh - 380px)' }}>
                    {columns.map(column => (
                        <SortableContext
                            key={column.id}
                            items={filteredTasks.filter(t => t.status === column.id).map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <KanbanColumn
                                column={column}
                                tasks={filteredTasks}
                                onEdit={openEditModal}
                                onDelete={deleteTask}
                                onStatusChange={updateTaskStatus}
                            />
                        </SortableContext>
                    ))}
                </div>
                
                <DragOverlay
                    dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.4',
                                },
                            },
                        }),
                    }}
                >
                    {activeTask ? (
                        <div className="bg-slate-900/90 border border-blue-500 rounded-xl p-4 shadow-2xl w-80">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getPriorityStyle(activeTask.priority).bg} ${getPriorityStyle(activeTask.priority).color}`}>
                                    {getPriorityStyle(activeTask.priority).icon} {activeTask.priority}
                                </div>
                            </div>
                            <h4 className="font-semibold text-white mb-2 text-sm">{activeTask.title}</h4>
                            {activeTask.description && (
                                <p className="text-xs text-slate-400 line-clamp-2">{activeTask.description}</p>
                            )}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        );
    };

    // Grid View Component
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={openEditModal} onDelete={deleteTask} onStatusChange={updateTaskStatus} />
            ))}
        </div>
    );

    // List View Component
    const ListView = () => (
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-800/30 border-b border-slate-700">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Task</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Priority</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Due Date</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Assignee</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredTasks.map(task => {
                            const priorityStyle = getPriorityStyle(task.priority);
                            const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'DONE';
                            
                            return (
                                <tr key={task.id} className="hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={() => openEditModal(task)}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${task.status === 'DONE' ? 'bg-emerald-500' : task.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                            <div>
                                                <p className={`text-sm font-medium text-white ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                                                    {task.title}
                                                </p>
                                                {task.description && (
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-medium ${priorityStyle.color}`}>
                                            {priorityStyle.icon} {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
                                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-slate-400">
                                        {task.assignee || '-'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (task.status !== 'DONE') {
                                                        const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE';
                                                        updateTaskStatus(task, nextStatus);
                                                    }
                                                }}
                                                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
                                                title={task.status === 'DONE' ? 'Completed' : 'Mark Progress'}
                                            >
                                                <FiArrowUp size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteTask(task.id);
                                                }}
                                                className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 transition-all"
                                                title="Delete"
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
    );

    return (
        <div className="flex bg-slate-950 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">Tasks Center</h1>
                        <p className="text-slate-400 text-sm mt-1">Drag and drop tasks between columns</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Total Tasks</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Active</p>
                            <p className="text-2xl font-bold text-amber-400">{stats.active}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">High Priority</p>
                            <p className="text-2xl font-bold text-red-400">{stats.highPriority}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Completion Rate</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.completionRate}%</p>
                        </div>
                    </div>

                    {/* View Mode Toggle and Search */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-xl p-1">
                            {[
                                { mode: 'kanban', icon: FiBox, label: 'Kanban' },
                                { mode: 'grid', icon: FiGrid, label: 'Grid' },
                                { mode: 'list', icon: FiList, label: 'List' }
                            ].map(({ mode, icon: Icon, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                        viewMode === mode 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-48"
                                />
                            </div>
                            
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="ALL">All Priorities</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                            
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-all"
                            >
                                <FiPlus size={14} /> New Task
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500/30 border-t-blue-500"></div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <FiZap className="text-2xl text-slate-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
                            <p className="text-slate-400 text-sm mb-5">
                                {searchQuery || filterPriority !== 'ALL'
                                    ? "Try adjusting your filters"
                                    : "Get started by creating your first task"}
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg inline-flex items-center gap-2 hover:bg-blue-500 transition-all"
                            >
                                <FiPlus /> Create Task
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={viewMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {viewMode === 'kanban' && <KanbanBoard />}
                                {viewMode === 'grid' && <GridView />}
                                {viewMode === 'list' && <ListView />}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </main>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowAddModal(false);
                            resetForm();
                        }}
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white">
                                    {editingTask ? 'Edit Task' : 'Create New Task'}
                                </h2>
                            </div>

                            <form onSubmit={editingTask ? handleEditTask : handleAddTask} className="p-5 space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="Task title"
                                        required
                                    />
                                </div>

                                <div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="2"
                                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                                        placeholder="Description (optional)"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="LOW">Low Priority 🍃</option>
                                        <option value="MEDIUM">Medium Priority ⚡</option>
                                        <option value="HIGH">High Priority 🚨</option>
                                    </select>

                                    <DatePicker
                                        selected={dueDate}
                                        onChange={(date) => setDueDate(date)}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                                        placeholderText="Due date"
                                        dateFormat="MMM d, yyyy"
                                        isClearable
                                    />
                                </div>

                                <div className="flex gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-all"
                                    >
                                        {editingTask ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tasks;