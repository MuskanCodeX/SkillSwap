import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Repeat, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-400">
        <Repeat className="w-6 h-6" />
        SkillSwap
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-emerald-400 transition">Explore</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-emerald-400 transition">Dashboard</Link>
            <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-emerald-400 transition">Login</Link>
            <Link
              to="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}