import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              placeholder="you@gmail.com"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-lg transition"
          >
            Log In
          </button>
        </div>
        <p className="text-slate-400 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}