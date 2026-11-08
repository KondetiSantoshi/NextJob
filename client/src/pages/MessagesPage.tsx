import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { Conversation, MessageItem, User } from '../types';
import {
  Send,
  MessageSquare,
  Search,
  User as UserIcon,
  CheckCheck,
  Check,
  Phone,
  Video,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations || []);
        if (res.data.conversations?.length > 0 && !selectedPartner) {
          setSelectedPartner(res.data.conversations[0].user);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const res = await api.get(`/messages/${partnerId}`);
      if (res.data.success) {
        setMessages(res.data.messages || []);
        setSelectedPartner(res.data.partner);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedPartner?._id) {
      fetchMessages(selectedPartner._id);
    }
  }, [selectedPartner?._id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPartner?._id) return;

    try {
      const res = await api.post(`/messages/${selectedPartner._id}`, {
        content: messageInput.trim(),
      });

      if (res.data.success) {
        setMessages([...messages, res.data.message]);
        setMessageInput('');
        fetchConversations();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-[750px] grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Conversations List */}
          <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="p-4 border-b border-slate-200/80 bg-white">
              <h2 className="text-lg font-bold text-slate-900">Direct Messages</h2>
              <div className="mt-3 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active conversations found. Connect with recruiters or peers to chat!
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const isSelected = selectedPartner?._id === c.user?._id;
                  return (
                    <div
                      key={c.user?._id}
                      onClick={() => setSelectedPartner(c.user)}
                      className={`p-4 flex items-center gap-3.5 cursor-pointer transition ${
                        isSelected ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : 'hover:bg-white/80'
                      }`}
                    >
                      <img
                        src={
                          c.user?.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.name}`
                        }
                        alt={c.user?.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {c.user?.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.lastMessageDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                      </div>
                      {c.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat History & Input */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {selectedPartner ? (
              <>
                {/* Active Partner Header */}
                <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        selectedPartner.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${selectedPartner.name}`
                      }
                      alt={selectedPartner.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{selectedPartner.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {selectedPartner.headline || selectedPartner.role}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    Active Session
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                  {messages.map((msg) => {
                    const isMine =
                      msg.sender?._id === user?._id ||
                      (msg.sender as any) === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isMine
                              ? 'bg-indigo-600 text-white rounded-br-sm'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-40 transition shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
