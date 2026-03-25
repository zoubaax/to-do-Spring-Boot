import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import taskService from '../api/taskService';
import Sidebar from '../components/Sidebar';
import { 
  FiActivity,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiStar
} from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement,
    Filler
);

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAllTasks();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.length - completedCount;
    const completionRate = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    // Chart Data
    const priorityDistribution = {
        HIGH: tasks.filter(t => t.priority === 'HIGH').length,
        MEDIUM: tasks.filter(t => t.priority === 'MEDIUM').length,
        LOW: tasks.filter(t => t.priority === 'LOW').length,
    };

    const doughnutData = {
        labels: ['High Priority', 'Medium Priority', 'Low Priority'],
        datasets: [{
            data: [priorityDistribution.HIGH, priorityDistribution.MEDIUM, priorityDistribution.LOW],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 0,
        }]
    };

    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Tasks Completed',
                data: [3, 5, 2, 8, 4, 6, 9], // Placeholder or derived from task data
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
            y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
            x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
        },
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                <div className="p-10 max-w-[1600px] mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Monitoring your productivity in real-time.</p>
                    </header>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Total Tasks', value: tasks.length, icon: FiList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'Success Rate', value: `${completionRate}%`, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'Active Now', value: activeCount, icon: FiActivity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                            { label: 'Critical Tasks', value: priorityDistribution.HIGH, icon: FiAlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:bg-slate-900 transition-all group">
                                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="text-2xl" />
                                </div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Charts View */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 h-[400px]">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-3"><FiTrendingUp className="text-blue-400" /> Weekly Activity</h3>
                            <div className="h-[280px]">
                                <Line data={lineChartData} options={chartOptions} />
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 h-[400px]">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-3"><FiAlertCircle className="text-amber-400" /> Task Load Distribution</h3>
                            <div className="h-[280px]">
                                <Doughnut data={doughnutData} options={{...chartOptions, cutout: '75%'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
