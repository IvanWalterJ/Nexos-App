"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Heart, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative p-6">
        <div className="bg-scene"><div className="bg-blob bg-blob-3" /></div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-transparent border-t-pink-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.1 }} />
        <div className="bg-blob bg-blob-3" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-xl mx-auto z-10 relative space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <Link href="/dashboard" className="glass-inner p-2 rounded-xl transition-all hover:bg-white/5">
            <ChevronLeft className="w-5 h-5 text-n-400" />
          </Link>
          <div>
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Especialistas</p>
            <h1 className="text-2xl font-black text-n-100">Favoritos</h1>
          </div>
        </motion.div>

        {/* Favorites List Placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="glass rounded-3xl p-8 space-y-4 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-2">
              <Heart className="w-8 h-8 fill-pink-500/20" />
            </div>
            <h2 className="text-lg font-black text-n-100">Aún no hay favoritos</h2>
            <p className="text-sm text-n-400">Guardá los perfiles de los profesionales que te interesen para agendar fácilmente más adelante.</p>
            
            <Link href="/onboarding/quiz" className="btn-primary flex items-center gap-2 mt-4 px-6 py-3 rounded-xl text-sm justify-center bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <Search className="w-4 h-4" />
              <span>Explorar profesionales</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
