"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, MapPin, Video, Info } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  status: string;
  modality: string;
  scheduled_at: string;
  price_ars: number;
  notes: string;
  professional_profiles: {
    profiles: { name: string } | null;
    specialty: string;
  } | null;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data } = await supabase.from("bookings").select(`
        id, status, modality, scheduled_at, price_ars, notes,
        professional_profiles (
          specialty,
          profiles (name)
        )
      `).eq("patient_id", user.id).order('scheduled_at', { ascending: false });

      if (data) setBookings(data as unknown as Booking[]);
      setLoading(false);
    };
    fetchBookings();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative p-6">
        <div className="bg-scene"><div className="bg-blob bg-blob-2" /></div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-transparent border-t-sky-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" style={{ opacity: 0.1 }} />
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-xl mx-auto z-10 relative space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <Link href="/dashboard" className="glass-inner p-2 rounded-xl transition-all hover:bg-white/5">
            <ChevronLeft className="w-5 h-5 text-n-400" />
          </Link>
          <div>
            <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">Tu Agenda</p>
            <h1 className="text-2xl font-black text-n-100">Mis Turnos</h1>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {bookings.length === 0 ? (
            <div className="glass rounded-3xl p-8 space-y-4 flex flex-col items-center justify-center text-center">
              <Calendar className="w-12 h-12 text-n-600 mb-2" />
              <h2 className="text-lg font-black text-n-100">Sin turnos agendados</h2>
              <p className="text-sm text-n-400">Todavía no tenés consultas programadas o realizadas en el sistema.</p>
              <Link href="/onboarding/quiz" className="btn-primary flex items-center gap-2 mt-4 px-6 py-3 rounded-xl text-sm justify-center">
                <span>Buscar Profesional</span>
              </Link>
            </div>
          ) : (
            bookings.map((booking, i) => {
              const date = new Date(booking.scheduled_at);
              const isPast = date.getTime() < Date.now();
              const proName = booking.professional_profiles?.profiles?.name || "Profesional";
              const specialty = booking.professional_profiles?.specialty || "Especialista";

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                  className={`glass rounded-2xl p-5 border ${isPast ? "border-n-800 opacity-80" : "border-white/5"} transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase text-lg">
                        {proName[0] || "?"}
                      </div>
                      <div>
                        <h3 className="font-bold text-n-100">{proName}</h3>
                        <p className="text-xs text-sky-400 font-medium">{specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md mb-1 inline-block
                        ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                        ${booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                        ${booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                      `}>
                        {booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </div>
                      <div className="text-xs text-n-500 font-bold">${booking.price_ars} ARS</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-n-900/40 p-3 rounded-xl border border-n-800 flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary-lit" />
                      <div>
                        <p className="text-[10px] font-bold text-n-500 uppercase">Fecha y Hora</p>
                        <p className="text-xs text-n-200 mt-0.5">
                          {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-n-900/40 p-3 rounded-xl border border-n-800 flex items-center gap-3">
                      {booking.modality === 'online' ? <Video className="w-4 h-4 text-sky-400" /> : <MapPin className="w-4 h-4 text-emerald-400" />}
                      <div>
                        <p className="text-[10px] font-bold text-n-500 uppercase">Modalidad</p>
                        <p className="text-xs text-n-200 mt-0.5 capitalize">{booking.modality}</p>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/20 flex items-start gap-2 text-primary-lit">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{booking.notes}</p>
                    </div>
                  )}
                  
                  {booking.status === 'pending' && !isPast && (
                    <Link href={`/checkout/${booking.id}`} className="mt-4 block w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs font-bold transition-all">
                      Abonar Turno
                    </Link>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </main>
  );
}
