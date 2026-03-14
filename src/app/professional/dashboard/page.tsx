"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Star, TrendingUp, Users, Settings, LogOut, Stethoscope, BarChart2, Clock } from "lucide-react";
import Link from "next/link";

interface Profile { id: string; name: string; email: string; }

interface ProfessionalProfile {
  specialty: string;
  avg_rating: number;
  review_count: number;
  is_active: boolean;
}

interface Booking {
  id: string;
  status: string;
  modality: string;
  scheduled_at: string;
  price_ars: number;
  profiles: { name: string } | null;
}

export default function ProfessionalDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [proData, setProData] = useState<ProfessionalProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const [{ data: pData }, { data: ppData }, { data: bData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("professional_profiles").select("*").eq("id", user.id).single(),
        supabase.from("bookings").select(`
          id, status, modality, scheduled_at, price_ars,
          profiles:patient_id (name)
        `).eq("professional_id", user.id).order('scheduled_at', { ascending: true })
      ]);

      if (pData) setProfile(pData);
      if (ppData) setProData(ppData);
      if (bData) setBookings(bData as unknown as Booking[]);
      setLoading(false);
    };
    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-scene"><div className="bg-blob bg-blob-2" /></div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-transparent border-t-sky-500" />
      </main>
    );
  }

  const firstName = profile?.name?.split(" ")[0] ?? "Profesional";
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const STATS = [
    { label: "Pacientes hoy", value: "—", icon: <Users className="w-4 h-4" /> },
    { label: "Rating promedio", value: proData?.avg_rating ? `${proData.avg_rating}★` : "Nuevo", icon: <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> },
    { label: "Reseñas", value: proData?.review_count ?? 0, icon: <BarChart2 className="w-4 h-4" /> },
    { label: "Estado", value: proData?.is_active ? "Activo" : "Inactivo", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const ACTIONS = [
    { icon: <Calendar className="w-5 h-5" />, label: "Mi Agenda", href: "/professional/schedule", color: "from-sky-600 to-cyan-500", shadow: "shadow-sky-900/40" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Mensajes", href: "/chat", color: "from-emerald-600 to-teal-500", shadow: "shadow-emerald-900/40" },
    { icon: <Star className="w-5 h-5" />, label: "Reseñas", href: "/professional/reviews", color: "from-amber-600 to-orange-500", shadow: "shadow-amber-900/40" },
    { icon: <Settings className="w-5 h-5" />, label: "Mi Perfil", href: "/professional/profile", color: "from-violet-600 to-indigo-600", shadow: "shadow-violet-900/40" },
  ];

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.2 }} />
        <div className="bg-blob bg-blob-3" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-xl mx-auto z-10 relative space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-n-600 uppercase tracking-widest mb-1">{timeGreet}</p>
            <h1 className="text-2xl font-black leading-none" style={{ background: "linear-gradient(135deg, #bae6fd, #38bdf8, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {firstName} 👨‍⚕️
            </h1>
            {proData?.specialty && (
              <p className="text-xs text-n-600 font-semibold mt-0.5 flex items-center gap-1">
                <Stethoscope className="w-3 h-3" /> {proData.specialty}
              </p>
            )}
          </div>
          <button onClick={handleLogout}
            className="glass-inner p-2.5 rounded-xl transition-all hover:border-red-500/40 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 text-n-600 hover:text-red-400" />
          </button>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }} className="glass p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-n-600 mb-2">
                  {s.icon}
                  <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="text-xl font-black text-n-100">{String(s.value)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-xs font-black text-n-600 uppercase tracking-widest mb-4">Herramientas</h2>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map((a, i) => (
              <Link key={a.label} href={a.href}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="glass p-4 rounded-2xl card-hover flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${a.color} shadow-lg ${a.shadow}`}>
                    <span className="text-white">{a.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-n-200">{a.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Next appointments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-n-600 uppercase tracking-widest">Próximas consultas</h2>
            <Link href="/professional/schedule" className="text-xs font-bold text-sky-400 hover:text-sky-300">Ver todas</Link>
          </div>
          
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="glass rounded-3xl p-5 space-y-3 flex flex-col items-center justify-center text-center py-10">
                <Calendar className="w-10 h-10 text-n-600 mb-2" />
                <span className="text-sm font-bold text-n-300">No tenés consultas programadas.</span>
                <p className="text-xs text-n-500 max-w-sm">Los pacientes podrán reservar turnos de tu agenda una vez que configures tu perfil público.</p>
                <Link href="/professional/profile" className="btn-secondary px-4 py-2 mt-2 rounded-xl text-xs">
                  Configurar mi perfil
                </Link>
              </div>
            ) : (
              bookings.slice(0, 3).map(b => (
                <div key={b.id} className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase">
                      {b.profiles?.name?.[0] || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-n-200 text-sm">{b.profiles?.name || "Paciente"}</h3>
                      <div className="text-xs text-n-500 mt-0.5 flex gap-2">
                        <span>{new Date(b.scheduled_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span className="capitalize">{b.modality}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-sky-400">${b.price_ars}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${b.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {b.status === 'pending' ? 'Pendiente' : 'Confirmado'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
