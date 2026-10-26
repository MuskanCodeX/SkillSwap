import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skillOffered: '',
    level: 'Beginner',
    skillWanted: '',
  });
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skillsOffered: [{ skillName: formData.skillOffered, level: formData.level }],
        skillsWanted: [formData.skillWanted],
      };

      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-950 px-4 py-8">
      <form onSubmit={handleSignup} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-lg shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">Create SkillSwap Profile</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="text-slate-400 text-sm block mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            placeholder="Aman Verma"
          />
        </div>

        <div>
          <label className="text-slate-400 text-sm block mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            placeholder="aman@gmail.com"
          />
        </div>

        <div>
          <label className="text-slate-400 text-sm block mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            placeholder="••••••••"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Skill You Can Teach</label>
            <input
              type="text"
              name="skillOffered"
              required
              value={formData.skillOffered}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Python"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Your Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm block mb-1">Skill You Want to Learn</label>
          <input
            type="text"
            name="skillWanted"
            required
            value={formData.skillWanted}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Video Editing"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg transition mt-4"
        >
          Register & Get Started
        </button>

        <p className="text-slate-400 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}