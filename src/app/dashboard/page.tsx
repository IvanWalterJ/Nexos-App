"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar, MessageSquare, Heart, LogOut, User, Sparkles, Clock, Star } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Booking {
  id: string;
  status: string;
  modality: string;
  scheduled_at: string;
  price_ars: number;
  professional_profiles: {
    profiles: { name: string } | null;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const [{ data: pData }, { data: bData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("bookings").select(`
          id, status, modality, scheduled_at, price_ars,
          professional_profiles (
            profiles (name)
          )
        `).eq("patient_id", user.id).order('scheduled_at', { ascending: true })
      ]);

      if (pData) {
        setProfile(pData);
        // Redirect professional to their dashboard
        if (pData.role === "professional") {
          router.replace("/professional/dashboard");
          return;
        }
      }
      
      if (bData) setBookings(bData as unknown as Booking[]);
      setLoading(false);
    };
    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-scene"><div className="bg-blob bg-blob-1" /></div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary" />
      </main>
    );
  }

  const greeting = profile?.name?.split(" ")[0] ?? "Bienvenido";
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const QUICK_ACTIONS = [
    { icon: <Search className="w-5 h-5" />, label: "Buscar Profesional", href: "/onboarding/quiz", accent: "from-indigo-600 to-violet-600", shadow: "shadow-indigo-900/40" },
    { icon: <Calendar className="w-5 h-5" />, label: "Mis Turnos", href: "/bookings", accent: "from-sky-600 to-cyan-500", shadow: "shadow-sky-900/40" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Mensajes", href: "/chat", accent: "from-emerald-600 to-teal-500", shadow: "shadow-emerald-900/40" },
    { icon: <Heart className="w-5 h-5" />, label: "Favoritos", href: "/favorites", accent: "from-rose-600 to-pink-500", shadow: "shadow-rose-900/40" },
  ];

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" style={{ opacity: 0.2 }} />
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-xl mx-auto z-10 relative space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-n-600 uppercase tracking-widest mb-1">{timeGreet}</p>
            <h1 className="text-2xl font-black text-gradient leading-none">{greeting} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </Link>
            <button onClick={handleLogout}
              className="glass-inner p-2.5 rounded-xl transition-all hover:border-red-500/40 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 text-n-600 hover:text-red-400" />
            </button>
          </div>
        </motion.div>

        {/* Match CTA Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link href="/onboarding/quiz">
            <div className="glass p-6 rounded-3xl card-hover" style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(14,165,233,0.15))",
              borderColor: "rgba(99,102,241,0.3)"
            }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl" style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)", boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-n-100 text-base">Encontrá tu profesional ideal</h2>
                  <p className="text-xs text-n-500 mt-0.5">Quiz de 7 preguntas · Matching con IA</p>
                </div>
                <div className="ml-auto text-primary-lit text-lg font-black">→</div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xs font-black text-n-600 uppercase tracking-widest mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((a, i) => (
              <Link key={a.label} href={a.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="glass p-4 rounded-2xl card-hover flex items-center gap-3"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${a.accent} shadow-lg ${a.shadow}`}>
                    <span className="text-white">{a.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-n-200">{a.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Upcoming section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-n-600 uppercase tracking-widest">Próximos turnos</h2>
            <Link href="/bookings" className="text-xs font-bold text-sky-400 hover:text-sky-300">Ver todos</Link>
          </div>
          
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="glass rounded-3xl p-5 space-y-3 flex flex-col items-center justify-center text-center py-8">
                <Calendar className="w-10 h-10 text-n-600 mb-2" />
                <span className="text-sm font-bold text-n-300">No tenés turnos programados.</span>
                <Link href="/onboarding/quiz" className="btn-secondary px-4 py-2 mt-2 rounded-xl text-xs">
                  Reservar mi primer turno
                </Link>
              </div>
            ) : (
              bookings.slice(0, 3).map(b => {
                const proName = b.professional_profiles?.profiles?.name || "Profesional";
                return (
                  <div key={b.id} className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase">
                        {proName[0] || "?"}
                      </div>
                      <div>
                        <h3 className="font-bold text-n-200 text-sm">{proName}</h3>
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
                );
              })
            )}
          </div>
        </motion.div>

        {/* Recent matches preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-n-600 uppercase tracking-widest">Tus últimos matches</h2>
            <Link href="/matches" className="text-xs font-bold text-primary-lit hover:underline">Ver todos →</Link>
          </div>
          <div className="glass rounded-3xl p-5 flex items-center gap-3 text-n-600">
            <Star className="w-4 h-4" />
            <span className="text-sm">Completá el quiz para ver tus matches personalizados.</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
