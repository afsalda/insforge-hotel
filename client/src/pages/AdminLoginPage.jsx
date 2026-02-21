import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple hardcoded admin credentials as requested for mandatory login
        // In a real app, this would call api.login()
        if (email === 'albaith.booking@gmail.com' && password === 'Albaith321@') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify({ email, name: 'Admin' }));
            setTimeout(() => {
                navigate('/admin');
            }, 800);
        } else {
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <style>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--bg-off-white);
                    padding: 20px;
                    font-family: var(--font-sans);
                }
                .login-card {
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
                    width: 100%;
                    max-width: 420px;
                    border: 1px solid rgba(0, 0, 0, 0.04);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .brand-logo {
                    color: var(--bg-deep-green);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-family: var(--font-heading);
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                .login-subtitle {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-charcoal);
                    margin-bottom: 8px;
                }
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 14px;
                    color: var(--text-secondary);
                }
                .login-input {
                    width: 100%;
                    padding: 12px 14px 12px 42px !important;
                    border: 1.5px solid var(--border);
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    background: #fcfcfc;
                }
                .login-input:focus {
                    outline: none;
                    border-color: var(--bg-deep-green);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(26, 54, 54, 0.05);
                }
                .password-toggle {
                    position: absolute;
                    right: 14px;
                    cursor: pointer;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                }
                .btn-login {
                    width: 100%;
                    padding: 14px;
                    background: var(--bg-deep-green);
                    color: var(--text-cream);
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .btn-login:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .btn-login:active {
                    transform: translateY(0);
                }
                .error-msg {
                    background: #fee2e2;
                    color: #991B1B;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    margin-bottom: 20px;
                    text-align: center;
                    border: 1px solid #fecaca;
                }
                .login-footer {
                    text-align: center;
                    margin-top: 24px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }
                .login-footer a {
                    color: var(--bg-deep-green);
                    text-decoration: none;
                    font-weight: 600;
                }
            `}</style>

            <div className="login-card">
                <div className="login-header">
                    <div className="brand-logo">
                        <Hotel size={32} strokeWidth={2.5} />
                        <span>Al Baith</span>
                    </div>
                    <p className="login-subtitle">Admin Management Portal</p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Admin Email</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="email"
                                className="login-input"
                                placeholder="albaith.booking@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="login-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected area. Unauthorized access is monitored.</p>
                </div>
            </div>
        </div>
    );
}
