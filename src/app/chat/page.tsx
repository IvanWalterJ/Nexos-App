"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Search, User } from "lucide-react";
import Link from "next/link";

interface ChatContact {
  id: string; // The other person's profile ID
  name: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function ChatIndexPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      // Get user role
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      const role = profile?.role || 'patient';
      setUserRole(role);

      // Find all people they have a booking with
      let peopleIds = new Set<string>();
      
      if (role === 'patient') {
        const { data: bookings } = await supabase.from('bookings').select('professional_id').eq('patient_id', user.id);
        bookings?.forEach(b => peopleIds.add(b.professional_id));
      } else {
        const { data: bookings } = await supabase.from('bookings').select('patient_id').eq('professional_id', user.id);
        bookings?.forEach(b => peopleIds.add(b.patient_id));
      }

      if (peopleIds.size === 0) {
        setLoading(false);
        return;
      }

      // Fetch profiles for those IDs
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('id', Array.from(peopleIds));

      if (profilesData) {
        // Mock last message for UI styling
        const contactsWithMeta = profilesData.map(p => ({
          ...p,
          lastMessage: "Toca para enviar un mensaje...",
          lastMessageTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          unreadCount: 0
        }));
        setContacts(contactsWithMeta);
      }

      setLoading(false);
    };

    fetchContacts();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-scene"><div className="bg-blob bg-blob-2" /></div>
        <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-sky-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={userRole === 'professional' ? '/professional/dashboard' : '/dashboard'} className="glass-inner p-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-n-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-n-100">Mensajes</h1>
            <p className="text-sm text-n-500">Chateá con tus contactos.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-n-500" />
          <input 
            type="text" 
            placeholder="Buscar conversación..." 
            className="w-full glass bg-transparent border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-n-200 placeholder:text-n-600 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
        </div>

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-n-600 mb-4" />
              <h2 className="text-lg font-bold text-n-200">No hay mensajes aún</h2>
              <p className="text-sm text-n-500 mt-2">
                {userRole === 'patient' 
                  ? 'Tus conversaciones con profesionales aparecerán aquí luego de reservar un turno.'
                  : 'Tus conversaciones con pacientes aparecerán aquí luego de que reserven un turno.'}
              </p>
            </div>
          ) : (
            contacts.map((contact, i) => (
              <motion.div 
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/chat/${contact.id}`}>
                  <div className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex items-center gap-4 card-hover">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase text-lg">
                        {contact.name[0]}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-n-200 text-sm truncate">{contact.name}</h3>
                        <span className="text-[10px] text-n-500 flex-shrink-0">{contact.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-n-500 truncate">{contact.lastMessage}</p>
                    </div>

                    {contact.unreadCount ? (
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold text-white">
                        {contact.unreadCount}
                      </div>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
