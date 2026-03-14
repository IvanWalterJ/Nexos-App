"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { name: string } | null;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avg: 0, total: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      // Get reviews
      const { data } = await supabase
        .from("reviews")
        .select(`
          id, rating, comment, created_at,
          profiles:patient_id (name)
        `)
        .eq("professional_id", user.id)
        .order('created_at', { ascending: false });

      // Get stats
      const { data: proData } = await supabase
        .from("professional_profiles")
        .select("avg_rating, review_count")
        .eq("id", user.id)
        .single();
        
      if (data) setReviews(data as unknown as Review[]);
      if (proData) setStats({ avg: proData.avg_rating || 0, total: proData.review_count || 0 });
      setLoading(false);
    };

    fetchReviews();
  }, [router]);

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
            <h1 className="text-2xl font-black text-n-100">Mis Reseñas</h1>
            <p className="text-sm text-n-500">Lo que dicen tus pacientes de vos.</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass p-6 rounded-3xl mb-8 flex items-center justify-between border-sky-500/20">
          <div>
            <div className="text-sm font-bold text-n-400 uppercase tracking-widest mb-1">Puntuación</div>
            <div className="text-4xl font-black text-white flex items-center gap-2">
              {stats.avg.toFixed(1)} <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-n-400 uppercase tracking-widest mb-1">Total Reseñas</div>
            <div className="text-4xl font-black text-sky-400">{stats.total}</div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-n-600 mb-4" />
              <h2 className="text-lg font-bold text-n-200">Aún no tenés reseñas</h2>
              <p className="text-sm text-n-500 mt-2">Los pacientes podrán dejarte una reseña después de finalizar su turno.</p>
            </div>
          ) : (
            reviews.map((r, i) => (
              <motion.div 
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-5 rounded-2xl border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase">
                      {r.profiles?.name?.[0] || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-n-200 text-sm">{r.profiles?.name || "Paciente"}</h3>
                      <span className="text-xs text-n-500">{new Date(r.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= r.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />
                    ))}
                  </div>
                </div>
                
                {r.comment && (
                  <p className="text-n-300 text-sm leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">
                    "{r.comment}"
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
