import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, Check, X, Clock, Star, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions/my-sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSessions();
  }, [token]);

  const updateStatus = async (sessionId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/sessions/${sessionId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const peerId =
        selectedSession.receiver._id === user?.id
          ? selectedSession.requester._id
          : selectedSession.receiver._id;

      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          sessionId: selectedSession._id,
          reviewedUserId: peerId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviewMessage('Review submitted successfully!');
      setTimeout(() => {
        setSelectedSession(null);
        setReviewMessage('');
        setComment('');
      }, 1500);
    } catch (err) {
      setReviewMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="text-center p-12 text-slate-400">Loading sessions...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-white relative">
      <h1 className="text-3xl font-bold mb-6">Your Exchange Requests & Sessions</h1>

      {sessions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400">
          No swap sessions yet. Go to <Link to="/" className="text-emerald-400 underline">Explore</Link> to find peers!
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => {
            const isReceiver = s.receiver._id === user?.id;
            const peer = isReceiver ? s.requester : s.receiver;

            return (
              <div key={s._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{peer.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      s.status === 'completed' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      s.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      s.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm mt-2">
                    <span className="text-white font-medium">Exchange:</span> Teaching <span className="text-emerald-400 font-semibold">{s.skillOffered}</span> in return for <span className="text-indigo-400 font-semibold">{s.skillRequested}</span>
                  </p>
                  {s.note && <p className="text-slate-500 text-xs mt-1">Note: "{s.note}"</p>}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {s.status === 'pending' && isReceiver && (
                    <>
                      <button
                        onClick={() => updateStatus(s._id, 'accepted')}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-1.5 rounded-lg font-medium text-sm transition"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => updateStatus(s._id, 'rejected')}
                        className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg font-medium text-sm transition"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}

                  {s.status === 'pending' && !isReceiver && (
                    <span className="flex items-center gap-1 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" /> Awaiting response
                    </span>
                  )}

                  {s.status === 'accepted' && (
                    <>
                      <Link
                        to={`/chat/${s._id}`}
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg font-medium text-sm transition"
                      >
                        <MessageSquare className="w-4 h-4" /> Chat
                      </Link>
                      <button
                        onClick={() => updateStatus(s._id, 'completed')}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 px-3.5 py-1.5 rounded-lg font-medium text-sm transition"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Completed
                      </button>
                    </>
                  )}

                  {s.status === 'completed' && (
                    <button
                      onClick={() => setSelectedSession(s)}
                      className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-1.5 rounded-lg text-sm transition"
                    >
                      <Star className="w-4 h-4 fill-slate-950" /> Give Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal Popup */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Leave a Review</h3>
            <p className="text-slate-400 text-sm mb-4">Rate your skill exchange experience.</p>

            {reviewMessage && (
              <div className="mb-4 text-sm p-2 rounded bg-emerald-500/20 text-emerald-300">
                {reviewMessage}
              </div>
            )}

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        } transition`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm block mb-1">Feedback Comment</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Great teacher! Explained concepts very clearly."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}