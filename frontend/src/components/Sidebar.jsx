import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, 
  FiList, 
  FiSettings, 
  FiUser, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiZap
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Functional navigation items
    const mainNavItems = [
        { path: '/', icon: FiGrid, label: 'Dashboard' },
        { path: '/tasks', icon: FiList, label: 'Tasks' },
    ];

    const bottomNavItems = [
        { path: '/settings', icon: FiSettings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-all duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={() => setIsOpen(false)}
            />
            
            <aside 
                className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-30 flex flex-col ${
                    isOpen ? 'w-72' : 'w-20'
                }`}
            >
                {/* 1. Header Section */}
                <div className="p-6 border-b border-slate-800 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                                <FiZap className="text-white text-xl" />
                            </div>
                            {isOpen && (
                                <div className="overflow-hidden">
                                    <h2 className="text-lg font-bold text-white truncate">SaaSFlow</h2>
                                    <p className="text-[10px] text-emerald-400 font-medium tracking-wider">WORKSPACE</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Navigation Section */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-hide">
                    <div>
                        {isOpen && <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>}
                        <div className="space-y-1">
                            {mainNavItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                        ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                        ${!isOpen && 'justify-center'}
                                    `}
                                >
                                    <item.icon className="text-xl shrink-0" />
                                    {isOpen && <span className="flex-1 text-sm font-medium">{item.label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* 3. Bottom Section */}
                <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/50">
                    <div className="space-y-1 mb-4">
                        {bottomNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all
                                    ${isActive ? 'text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                                    ${!isOpen && 'justify-center'}
                                `}
                            >
                                <item.icon className="text-xl shrink-0" />
                                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>

                    {/* Logout */}
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${!isOpen && 'justify-center'}`}
                    >
                        <FiLogOut className="text-xl shrink-0" />
                        {isOpen && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                    
                    {/* User Mini Profile */}
                    <div className={`mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                             <FiUser className="text-slate-400 text-sm" />
                        </div>
                        {isOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user?.username || 'User'}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pro Account</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggle Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute top-7 -right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-slate-900 hover:bg-blue-500 transition-all z-50 shadow-lg"
                >
                    {isOpen ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
                </button>
            </aside>
        </>
    );
};

export default Sidebar;