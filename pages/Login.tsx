import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
      <div className="w-full max-w-md border border-white/10 p-8 md:p-12">
        <h1 className="text-3xl font-serif text-white mb-2">vizarc3d.</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Admin Access</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/20 p-4 text-white focus:border-white outline-none transition-colors"
              placeholder="Enter access code"
            />
          </div>
          
          {error && <p className="text-red-500 text-xs uppercase tracking-widest">{error}</p>}
          
          <button 
            type="submit"
            className="w-full bg-white text-black py-4 uppercase tracking-[0.2em] text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;