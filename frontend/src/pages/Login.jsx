import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await authService.login(username, password);
            login(data);
            navigate('/');
        } catch (err) {
            // BEST PRACTICE: If Spring returns an error object, extract the message
            // Otherwise, React crashes because it cannot render Objects as text.
            const message = err.response?.data?.message || err.response?.data || 'Invalid credentials';
            setError(typeof message === 'object' ? JSON.stringify(message) : message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-morphism">
                <h2>Welcome Back</h2>
                <p>Login to manage your tasks</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn-primary full-width">Login</button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
