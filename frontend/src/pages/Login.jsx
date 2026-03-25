import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login(username, password);
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md glass-card p-10 rounded-3xl animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400">Log in to your workspace</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-400/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Username</label>
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input 
                                className="w-full pl-12 pr-6 py-4 bg-slate-900/40 border border-white/10 rounded-2xl text-white outline-none focus:border-primary/50 focus:bg-slate-900/60 transition-all duration-300 ring-0 focus:ring-4 focus:ring-primary/10"
                                type="text" 
                                placeholder="Enter your username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors" />
                            <input 
                                className="w-full pl-12 pr-6 py-4 bg-slate-900/40 border border-white/10 rounded-2xl text-white outline-none focus:border-secondary/50 focus:bg-slate-900/60 transition-all duration-300 ring-0 focus:ring-4 focus:ring-secondary/10"
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl font-bold flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.4)] transition-all duration-300 mt-2"
                        type="submit"
                    >
                        Sign In <FiArrowRight />
                    </button>
                </form>

                <div className="mt-10 text-center text-sm text-slate-500 font-medium">
                    Don't have an account? 
                    <Link to="/signup" className="ml-2 text-primary hover:text-white transition-colors underline-offset-4 hover:underline"> Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
