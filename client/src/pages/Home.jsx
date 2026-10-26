import { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?skill=${searchQuery}`);
      setUsers(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white">
          Learn Skills without Spending <span className="text-emerald-400">Money</span>
        </h1>
        <p className="text-slate-400">Exchange what you know for what you want to learn.</p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto pt-4">
          <input
            type="text"
            placeholder="Search skills (e.g. Java, Graphic Design, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 font-semibold rounded-xl flex items-center gap-2 transition"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 text-left">
          {users.map((item) => (
            <div key={item._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs">
                <span className="font-semibold">★ {item.ratingAverage || 'No ratings yet'}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">{item.email}</p>
                
                <div className="mt-4">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Teaches:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.skillsOffered.map((s, idx) => (
                      <span key={idx} className="bg-emerald-500/10 text-emerald-300 text-xs px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {s.skillName} ({s.level})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Wants to Learn:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.skillsWanted.map((s, idx) => (
                      <span key={idx} className="bg-indigo-500/10 text-indigo-300 text-xs px-2.5 py-1 rounded-md border border-indigo-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {searched && users.length === 0 && (
            <p className="text-slate-500 text-center col-span-2">No users found offering this skill.</p>
          )}
        </div>
      </div>
    </div>
  );
}