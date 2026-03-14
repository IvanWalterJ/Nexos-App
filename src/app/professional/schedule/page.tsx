"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Filter, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  modality: 'online' | 'presencial';
  scheduled_at: string;
  price_ars: number;
  profiles: { name: string, email: string } | null;
}

export default function SchedulePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data } = await supabase
        .from("bookings")
        .select(`
          id, status, modality, scheduled_at, price_ars,
          profiles:patient_id (name, email)
        `)
        .eq("professional_id", user.id)
        .order('scheduled_at', { ascending: true });

      if (data) setBookings(data as unknown as Booking[]);
      setLoading(false);
    };

    fetchSchedule();
  }, [router]);

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } else {
      alert("Error al actualizar el turno");
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
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-3xl mx-auto z-10 relative">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/professional/dashboard" className="glass-inner p-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-n-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-n-100">Mi Agenda</h1>
            <p className="text-sm text-n-500">Gestioná tus turnos y consultas.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-sky-500 text-white' : 'glass text-n-400 hover:text-white'}`}>
            Todos
          </button>
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'pending' ? 'bg-amber-500 text-white' : 'glass text-n-400 hover:text-white'}`}>
            Pendientes
          </button>
          <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'confirmed' ? 'bg-emerald-500 text-white' : 'glass text-n-400 hover:text-white'}`}>
            Confirmados
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center">
              <CalendarIcon className="w-12 h-12 text-n-600 mb-4" />
              <h2 className="text-lg font-bold text-n-200">No hay turnos {filter !== 'all' ? 'con este estado' : ''}</h2>
              <p className="text-sm text-n-500 mt-2">Los pacientes buscarán turnos disponibles en tu perfil.</p>
            </div>
          ) : (
            filteredBookings.map((b, i) => (
              <motion.div 
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase text-lg">
                    {b.profiles?.name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-n-200">{b.profiles?.name || "Paciente"}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-n-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        {new Date(b.scheduled_at).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{b.modality}</span>
                      <span>•</span>
                      <span className="font-bold">${b.price_ars}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center self-end border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                  {b.status === 'pending' ? (
                    <>
                      <button onClick={() => handleUpdateStatus(b.id, 'cancelled')} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors" title="Rechazar">
                        <XCircle className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Aceptar">
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </>
                  ) : (
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase ${b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {b.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
