import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Send, ArrowLeft } from 'lucide-react';

let socket;

export default function Chat() {
  const { sessionId } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // 1. Socket server se connect karo
    socket = io('http://localhost:5000');

    // 2. Specific session room join karo
    socket.emit('join_session', sessionId);

    // 3. Purane messages backend se fetch karo
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    fetchMessages();

    // 4. Live messages listen karo
    socket.on('receive_message', (incomingMessage) => {
      setMessages((prev) => [...prev, incomingMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [sessionId, token, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      sessionId,
      senderId: user.id,
      text: newMessage,
    };

    // Socket ke through message bhejo
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 w-full flex-1 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-t-2xl flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Skill Exchange Room</h2>
          <p className="text-xs text-emerald-400">Live Peer-to-Peer Session</p>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-slate-950/80 border-x border-slate-800 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No messages yet. Say hello and introduce your skill!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;

            return (
              <div
                key={idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[11px] text-slate-500 px-1 mb-0.5">
                  {isMe ? 'You' : msg.sender?.name || 'Peer'}
                </span>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="bg-slate-900 border border-slate-800 p-3 rounded-b-2xl flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 rounded-xl flex items-center justify-center transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}