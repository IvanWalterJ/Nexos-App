"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Video, Phone, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Profile {
  id: string;
  name: string;
  role: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      
      const { data: cUser } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: oUser } = await supabase.from('profiles').select('*').eq('id', params.id).single();
      
      if (cUser) setCurrentUser(cUser);
      if (oUser) setOtherUser(oUser);

      // Fetch initial messages
      const { data: initialMessages } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${params.id}),and(sender_id.eq.${params.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (initialMessages) setMessages(initialMessages);
      setLoading(false);

      // Subscribe to new messages
      const channel = supabase
        .channel(`chat_${user.id}_${params.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        })
        .subscribe();

      // Mark unread messages as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('receiver_id', user.id)
        .eq('sender_id', params.id)
        .is('read_at', null);

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initChat();
  }, [router, params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !otherUser) return;
    
    const newMessage = {
      sender_id: currentUser.id,
      receiver_id: otherUser.id,
      content: input.trim(),
    };

    // Optimistic UI update
    const tempMsg: Message = { ...newMessage, id: Math.random().toString(), created_at: new Date().toISOString(), read_at: null };
    setMessages(prev => [...prev, tempMsg]);
    setInput("");

    const { data, error } = await supabase.from('messages').insert(newMessage).select().single();
    if (error) {
      console.error(error);
      alert("Error al enviar mensaje");
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id)); // revert optimistic update
    } else if (data) {
      // Replace optimistic message with actual DB message
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? data : m));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
         <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-sky-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="h-screen bg-[#060c18] flex flex-col relative overflow-hidden">
      <div className="bg-scene absolute inset-0 pointer-events-none">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.1 }} />
      </div>
      <div className="bg-grid absolute inset-0 pointer-events-none" />

      {/* Header */}
      <header className="glass p-4 sm:p-6 sticky top-0 z-10 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/chat" className="glass-inner p-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-n-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase">
                {otherUser?.name?.[0] || "?"}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0f172a]" />
            </div>
            <div>
              <h1 className="font-bold text-n-100 text-base">{otherUser?.name}</h1>
              <p className="text-[10px] text-emerald-400 font-medium">En línea</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl text-n-400 hover:text-white hover:bg-white/5 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl text-n-400 hover:text-white hover:bg-white/5 transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl text-n-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative z-0">
        <div className="text-center my-6">
          <span className="text-[10px] font-bold text-n-600 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest">
            Comienzo de la conversación
          </span>
        </div>

        {messages.map((msg, i) => {
          const isMine = msg.sender_id === currentUser?.id;
          const showAvatar = !isMine && (i === 0 || messages[i - 1]?.sender_id !== msg.sender_id);
          
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar Space mapping for non-sender */}
                {!isMine && (
                  <div className="w-8 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-300 font-bold uppercase">
                        {otherUser?.name?.[0]}
                      </div>
                    )}
                  </div>
                )}

                <div className={`px-4 py-3 rounded-2xl ${isMine 
                  ? 'bg-gradient-to-br from-sky-600 to-indigo-600 text-white rounded-br-sm shadow-[0_5px_15px_rgba(14,165,233,0.15)]' 
                  : 'glass-inner border border-white/5 text-n-200 rounded-bl-sm'}`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
              <span className={`text-[9px] text-n-600 mt-1 font-medium ${isMine ? 'mr-1' : 'ml-11'}`}>
                {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                {isMine && msg.read_at && <span className="text-sky-400 ml-1">✓✓</span>}
              </span>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-[#060c18] border-t border-white/5 relative z-10">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 glass bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-6 pr-14 text-sm text-n-200 placeholder:text-n-500 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:bg-n-700 disabled:text-n-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
