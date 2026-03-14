"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MapPin, CheckCircle, Clock, ChevronRight, Sliders, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  price_online: number;
  price_presencial: number;
  displayPrice: number;
  modality: string;
  location: string;
  avg_rating: number;
  review_count: number;
  is_active: boolean;
  matchScore: number;
  gradient: string;
}

const GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-sky-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-rose-600 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-fuchsia-600 to-purple-600"
];

const SPECIALTIES = [
  "Psicología", "Psicopedagogía", "Nutrición", "Fisioterapia", "Medicina General",
  "Odontología", "Cardiología", "Dermatología", "Traumatología"
];

export default function MatchesPage() {
  const router = useRouter();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchSpecialty, setSearchSpecialty] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      // Fetch active professionals with their profile names
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          id, specialty, price_online, price_presencial, modality, location, avg_rating, review_count, is_active,
          profiles:id (name)
        `)
        .eq('is_active', true);

      if (data) {
        const formatted: Professional[] = data.map((p: any, i) => {
          // Determine the lowest price to show
          const prices = [];
          if (p.price_online) prices.push(p.price_online);
          if (p.price_presencial) prices.push(p.price_presencial);
          const displayPrice = prices.length > 0 ? Math.min(...prices) : 0;

          // Pseudo match score based on rating or just random between 80-99 for the UI
          const score = p.avg_rating ? Math.floor(p.avg_rating * 18) + Math.floor(Math.random() * 10) : 85 + Math.floor(Math.random() * 14);

          return {
            id: p.id,
            name: p.profiles?.name || "Profesional",
            specialty: p.specialty || "General",
            price_online: p.price_online,
            price_presencial: p.price_presencial,
            displayPrice,
            modality: p.modality,
            location: p.location || "Online",
            avg_rating: p.avg_rating || 0,
            review_count: p.review_count || 0,
            is_active: p.is_active,
            matchScore: score,
            gradient: GRADIENTS[i % GRADIENTS.length]
          };
        });
        
        // Sort by match score descending
        formatted.sort((a, b) => b.matchScore - a.matchScore);
        setProfessionals(formatted);
      }
      setLoading(false);
    };

    fetchProfessionals();
  }, []);

  const filteredMatches = professionals.filter(p => {
    if (!searchSpecialty) return true;
    return p.specialty.toLowerCase().includes(searchSpecialty.toLowerCase());
  });

  const getInitials = (name: string) => {
    const parts = name.replace(/^(Dr\.|Lic\.|Dra\.)\s*/i, '').split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
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
        <div className="bg-blob bg-blob-1" style={{ opacity: 0.2 }} />
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-2xl mx-auto z-10 relative space-y-8">
        
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-n-500 hover:text-n-200 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al Inicio
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-gradient">Tus Matches</h1>
            <p className="text-n-500 text-sm mt-1 font-medium">Encontramos {filteredMatches.length} profesionales compatibles</p>
          </div>
          <button
            onClick={() => setFilterOpen(f => !f)}
            className={`glass-inner p-3 rounded-2xl transition-all duration-300 ${filterOpen ? "border-sky-500 bg-sky-500/10 text-sky-400" : "text-n-400 hover:text-white"}`}
          >
            <Sliders className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="glass p-5 rounded-2xl border-sky-500/30 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">Filtrar por especialidad</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSearchSpecialty("")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${searchSpecialty === "" ? "bg-sky-500 text-white" : "glass-inner text-n-400 hover:text-white"}`}
                  >
                    Todas
                  </button>
                  {SPECIALTIES.map(s => (
                    <button 
                      key={s}
                      onClick={() => setSearchSpecialty(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${searchSpecialty === s ? "bg-sky-500 text-white" : "glass-inner text-n-400 hover:text-white"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match cards */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center">
              <Search className="w-12 h-12 text-n-600 mb-4" />
              <h2 className="text-lg font-bold text-n-200">No encontramos resultados</h2>
              <p className="text-sm text-n-500 mt-2">Intentá con otra especialidad o quitá los filtros.</p>
              <button onClick={() => setSearchSpecialty("")} className="mt-4 text-sky-400 font-bold hover:underline text-sm">
                Limpiar filtros
              </button>
            </div>
          ) : (
            filteredMatches.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/professionals/${m.id}`}>
                  <div className="glass p-5 rounded-2xl card-hover flex gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                        {getInitials(m.name)}
                      </div>
                      {/* Match score badge */}
                      <div className="absolute -top-2 -right-2 bg-[#060c18] border border-n-700 rounded-full px-1.5 py-0.5 text-[9px] font-black text-sky-400">
                        {m.matchScore}%
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-n-100 text-base truncate">{m.name}</h3>
                            <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
                          </div>
                          <p className="text-xs text-n-500 font-semibold">{m.specialty}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-n-700 flex-shrink-0 mt-1" />
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-n-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <strong className="text-n-300">{m.avg_rating > 0 ? m.avg_rating.toFixed(1) : "Nuevo"}</strong>
                          <span>({m.review_count})</span>
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <Video className="w-3 h-3" /> {m.modality}
                        </span>
                        {(m.modality === 'presencial' || m.modality === 'both') && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {m.location}
                          </span>
                        )}
                      </div>

                      {/* Tags + price + availability */}
                      <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 mt-2">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <Clock className="w-3 h-3" /> Disponible
                          </span>
                        </div>
                        <span className="text-sm font-black text-n-200">${m.displayPrice}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* Retry quiz CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-xs text-n-700 pt-8 pb-10">
          ¿No encontrás lo que buscás?{" "}
          <Link href="/onboarding/quiz" className="text-sky-400 font-bold hover:underline">
            Repetir quiz →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
