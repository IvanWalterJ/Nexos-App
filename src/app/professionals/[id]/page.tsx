"use client";

import { motion } from "framer-motion";
import { Star, Video, MapPin, CheckCircle, Clock, ArrowLeft, Calendar, MessageSquare, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* ── Mock professional data ──────────────────────────────── */
const PROFESSIONAL = {
  id: "1",
  name: "Lic. Valentina Romero",
  specialty: "Psicología Clínica",
  matchScore: 98,
  rating: 4.9,
  reviews: 142,
  priceOnline: "$12.000",
  pricePresencial: "$18.000",
  modality: "Online / Presencial",
  location: "Buenos Aires, Argentina",
  verified: true,
  available: true,
  gradient: "from-violet-600 via-indigo-600 to-blue-700",
  initials: "VR",
  bio: "Psicóloga clínica con 10 años de experiencia especializada en terapia cognitivo-conductual, manejo de ansiedad y terapia de pareja. Mi enfoque es práctico, con orientación a resultados medibles para que los cambios sean duraderos.",
  tags: ["Ansiedad", "Depresión", "Terapia de pareja", "Autoestima", "Duelo", "Estrés"],
  availability: ["Lun 14:00", "Mar 10:00", "Mar 16:00", "Mié 09:00", "Jue 18:00"],
  achievements: ["10 años de experiencia", "Certificada UBA", "+500 pacientes atendidos"],
  reviews_list: [
    { name: "Ana G.", stars: 5, comment: "Valentina es increíble, me ayudó muchísimo a manejar mi ansiedad laboral.", date: "hace 2 semanas" },
    { name: "Carlos R.", stars: 5, comment: "Muy profesional y empática. Las sesiones online funcionan perfectamente.", date: "hace 1 mes" },
  ],
};

export default function ProfessionalProfilePage() {
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "schedule">("about");
  const p = PROFESSIONAL;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" style={{ opacity: 0.18 }} />
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.12 }} />
      </div>
      <div className="bg-grid" />

      {/* Hero */}
      <div className={`relative h-52 bg-gradient-to-br ${p.gradient}`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex px-6 pt-5 justify-between items-start z-10">
          <Link href="/matches">
            <button className="p-2.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-white">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => setLiked(l => !l)}
              className={`p-2.5 rounded-2xl backdrop-blur-md border border-white/10 transition-colors ${liked ? "bg-rose-500/50 text-rose-200" : "bg-black/30 text-white"}`}>
              <Heart className={`w-5 h-5 ${liked ? "fill-rose-200" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-16 px-5 sm:px-8 max-w-xl mx-auto pb-10 space-y-5">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-6 space-y-4"
        >
          <div className="flex gap-4 items-start">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-black text-2xl shadow-xl flex-shrink-0`}>
              {p.initials}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-black text-n-100 text-xl">{p.name}</h1>
                {p.verified && <CheckCircle className="w-5 h-5 text-primary-lit" />}
              </div>
              <p className="text-sm text-n-500 font-semibold">{p.specialty}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-n-600">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <strong className="text-n-200">{p.rating}</strong> ({p.reviews})
                </span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>
              </div>
            </div>
            {/* Match score */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="text-2xl font-black text-gradient">{p.matchScore}%</div>
              <div className="text-[9px] font-bold text-n-600 uppercase tracking-wider">Match</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap gap-2">
            {p.achievements.map(a => (
              <span key={a} className="text-[10px] font-bold text-n-500 px-2.5 py-1 rounded-full glass-inner">
                ✓ {a}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1">
              <div className="text-[10px] text-n-600 font-bold uppercase tracking-wider">Sesión desde</div>
              <div className="text-xl font-black text-n-100">{p.priceOnline}</div>
            </div>
            <Link href={`/book/${p.id}`} className="btn-primary flex items-center gap-2 px-5 py-3 text-sm rounded-2xl">
              <Calendar className="w-4 h-4" />
              Reservar turno
            </Link>
            <Link href={`/chat/${p.id}`}>
              <button className="btn-secondary p-3 rounded-2xl">
                <MessageSquare className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-2xl p-1">
          {(["about", "reviews", "schedule"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300
                ${activeTab === tab ? "bg-primary/20 text-primary-lit border border-primary/30" : "text-n-600 hover:text-n-300"}`}
            >
              {tab === "about" ? "Sobre mí" : tab === "reviews" ? "Reseñas" : "Agenda"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-3xl p-6 space-y-5"
        >
          {activeTab === "about" && (
            <>
              <div>
                <h3 className="text-xs font-black text-n-600 uppercase tracking-widest mb-3">Descripción</h3>
                <p className="text-sm text-n-400 leading-relaxed">{p.bio}</p>
              </div>
              <div>
                <h3 className="text-xs font-black text-n-600 uppercase tracking-widest mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs font-bold text-primary-lit px-3 py-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="divider" />
              <div className="flex justify-between text-sm">
                <div>
                  <div className="text-[10px] font-bold text-n-600 uppercase tracking-wider mb-1">Online</div>
                  <div className="font-black text-n-100 text-lg">{p.priceOnline}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-n-600 uppercase tracking-wider mb-1">Presencial</div>
                  <div className="font-black text-n-100 text-lg">{p.pricePresencial}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-n-600 uppercase tracking-wider mb-1">Modalidad</div>
                  <div className="flex items-center gap-1 font-bold text-n-300 text-sm mt-1">
                    <Video className="w-3.5 h-3.5" />
                    Online / Presencial
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {p.reviews_list.map((r, i) => (
                <div key={i} className="glass-inner rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-n-200 text-sm">{r.name}</span>
                    <span className="text-[10px] text-n-600">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-n-500 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "schedule" && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-n-600 uppercase tracking-widest">Próximos turnos disponibles</h3>
              <div className="grid grid-cols-2 gap-2">
                {p.availability.map(slot => (
                  <button key={slot}
                    className="glass-inner py-3 px-4 rounded-xl text-sm font-bold text-n-300 flex items-center gap-2 hover:border-primary hover:text-primary-lit hover:bg-primary/10 transition-all duration-300">
                    <Clock className="w-4 h-4" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
