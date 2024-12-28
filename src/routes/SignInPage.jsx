// src/components/SignInPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
    const { login } = useAuth(); // Ensure this is correctly imported
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { name: email.split('@')[0], email }; // Simulate user data
        const tokens = {
            facebook: '',
            instagram: '',
            threads: '',
        };
        login(userData, tokens);
        // Reset form
        setEmail('');
        setPassword('');
    };

    return (
        <div className="auth-form">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={( e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignInPage;