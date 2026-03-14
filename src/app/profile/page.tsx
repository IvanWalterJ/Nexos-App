"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      if (data) {
        // If professional, redirect to professional profile editor
        if (data.role === "professional") {
          router.replace("/professional/profile");
          return;
        }

        setProfile({ ...data, email: user.email || "" });
        setName(data.name || "");
      }
      setLoading(false);
    };
    getProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    
    await supabase.from("profiles").update({ name }).eq("id", profile.id);
    
    setProfile({ ...profile, name });
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative p-6">
        <div className="bg-scene"><div className="bg-blob bg-blob-1" /></div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" style={{ opacity: 0.15 }} />
        <div className="bg-blob bg-blob-3" style={{ opacity: 0.1 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-xl mx-auto z-10 relative space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <Link href="/dashboard" className="glass-inner p-2 rounded-xl transition-all hover:bg-white/5">
            <ChevronLeft className="w-5 h-5 text-n-400" />
          </Link>
          <h1 className="text-lg font-black text-n-100">Mi Perfil</h1>
          <button onClick={handleLogout} className="glass-inner p-2 rounded-xl transition-all hover:border-red-500/40 hover:bg-red-500/10">
            <LogOut className="w-5 h-5 text-n-600 hover:text-red-400" />
          </button>
        </motion.div>

        {/* Profile Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-8 space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold uppercase shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              {profile?.name?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{profile?.name}</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-lit mt-1 block">
                Paciente
              </span>
            </div>
          </div>

          <div className="divider" />

          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-n-600 group-focus-within:text-primary-lit transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="nexos-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 opacity-60">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Email (Solo lectura)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-n-600 transition-colors" />
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="nexos-input cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5 opacity-60">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Contraseña</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-n-600 transition-colors" />
                <input
                  type="password"
                  value="********"
                  disabled
                  className="nexos-input cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-n-600 text-right mt-1">Contactá a soporte para cambiarla</p>
            </div>

            <button type="submit" disabled={saving || name === profile?.name} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
              {saving ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
