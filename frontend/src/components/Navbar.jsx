import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiCheckSquare, FiUser } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar glass-morphism">
            <div className="nav-brand">
                <FiCheckSquare className="nav-icon brand-icon" />
                <span>TaskMaster</span>
            </div>
            <div className="nav-links">
                <div className="nav-user">
                    <FiUser className="nav-icon" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleLogout} className="nav-logout-btn">
                    <FiLogOut className="nav-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
