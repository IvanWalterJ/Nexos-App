"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Video, MapPin, CheckCircle, Clock, ChevronRight, Sliders } from "lucide-react";
import Link from "next/link";

/* ── Mock data ────────────────────────────────────────────── */
const MATCHES = [
  {
    id: "1",
    name: "Lic. Valentina Romero",
    specialty: "Psicología Clínica",
    matchScore: 98,
    rating: 4.9,
    reviews: 142,
    price: "$12.000",
    modality: "Online",
    location: "Buenos Aires",
    verified: true,
    available: true,
    gradient: "from-violet-600 to-indigo-600",
    initials: "VR",
    tags: ["Ansiedad", "Parejas", "Terapia breve"],
  },
  {
    id: "2",
    name: "Lic. Martín Gutiérrez",
    specialty: "Nutrición y Dietética",
    matchScore: 94,
    rating: 4.8,
    reviews: 87,
    price: "$8.500",
    modality: "Online / Presencial",
    location: "Córdoba",
    verified: true,
    available: true,
    gradient: "from-sky-600 to-cyan-500",
    initials: "MG",
    tags: ["Vegetarianismo", "Rendimiento", "Pérdida de peso"],
  },
  {
    id: "3",
    name: "Dr. Carolina Salinas",
    specialty: "Fisioterapia",
    matchScore: 91,
    rating: 4.7,
    reviews: 64,
    price: "$15.000",
    modality: "Presencial",
    location: "Rosario",
    verified: false,
    available: false,
    gradient: "from-emerald-600 to-teal-500",
    initials: "CS",
    tags: ["Rehabilitación", "Deportivo", "Postura"],
  },
  {
    id: "4",
    name: "Dr. Federico Muñoz",
    specialty: "Cardiología",
    matchScore: 88,
    rating: 4.6,
    reviews: 231,
    price: "$22.000",
    modality: "Presencial",
    location: "Buenos Aires",
    verified: true,
    available: true,
    gradient: "from-rose-600 to-pink-500",
    initials: "FM",
    tags: ["Preventiva", "Hipertensión", "Stress"],
  },
];

export default function MatchesPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" style={{ opacity: 0.2 }} />
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-2xl mx-auto z-10 relative space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-gradient">Tus Matches</h1>
            <p className="text-n-500 text-sm mt-1 font-medium">Encontramos {MATCHES.length} profesionales compatibles</p>
          </div>
          <button
            onClick={() => setFilterOpen(f => !f)}
            className={`glass-inner p-3 rounded-2xl transition-all duration-300 ${filterOpen ? "border-primary bg-primary/10" : ""}`}
          >
            <Sliders className="w-5 h-5 text-n-400" />
          </button>
        </motion.div>

        {/* Match cards */}
        <div className="space-y-4">
          {MATCHES.map((m, i) => (
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
                      {m.initials}
                    </div>
                    {/* Match score badge */}
                    <div className="absolute -top-2 -right-2 bg-n-900 border border-n-700 rounded-full px-1.5 py-0.5 text-[9px] font-black text-primary-lit">
                      {m.matchScore}%
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-n-100 text-base truncate">{m.name}</h3>
                          {m.verified && <CheckCircle className="w-4 h-4 text-primary-lit flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-n-500 font-semibold">{m.specialty}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-n-700 flex-shrink-0 mt-1" />
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-n-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <strong className="text-n-300">{m.rating}</strong>
                        <span>({m.reviews})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" /> {m.modality}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {m.location}
                      </span>
                    </div>

                    {/* Tags + price + availability */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {m.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] font-bold text-n-600 px-2 py-0.5 rounded-full glass-inner">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {m.available ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <Clock className="w-3 h-3" /> Disponible
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-n-700">Sin turnos</span>
                        )}
                        <span className="text-sm font-black text-n-200">{m.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Retry quiz CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-xs text-n-700">
          ¿No encontrás lo que buscás?{" "}
          <Link href="/onboarding/quiz" className="text-primary-lit font-bold hover:underline">
            Repetir quiz →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
