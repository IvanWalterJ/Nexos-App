"use client";

import { motion } from "framer-motion";
import { Star, Video, MapPin, CheckCircle, Clock, ArrowLeft, Calendar, MessageSquare, Share2, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ── Mock profiles for Demo ──────────────────────────────── */
const MOCK_DATA: Record<string, any> = {
  "mock-1": {
    name: "Lic. Valentina Romero",
    specialty: "Psicología Clínica",
    matchScore: 98,
    rating: 4.9,
    reviews: 142,
    priceOnline: "$12.000",
    pricePresencial: "$18.000",
    modality: "Online / Presencial",
    location: "Palermo, CABA",
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
  },
  "mock-2": {
    name: "Dr. Javier Katz",
    specialty: "Medicina General",
    matchScore: 95,
    rating: 4.8,
    reviews: 89,
    priceOnline: "$15.000",
    pricePresencial: "$22.000",
    modality: "Online / Presencial",
    location: "Recoleta, CABA",
    verified: true,
    available: true,
    gradient: "from-sky-600 via-cyan-600 to-blue-500",
    initials: "JK",
    bio: "Médico de familia con enfoque en prevención y bienestar integral. Más de 15 años de trayectoria en centros de alta complejidad. Creo en la medicina personalizada y en dedicar el tiempo que cada paciente merece.",
    tags: ["Prevención", "Chequeo General", "Hipertensión", "Diabetes", "Salud Familiar"],
    availability: ["Lun 09:00", "Mié 15:00", "Jue 10:00", "Vie 11:00"],
    achievements: ["15 años de experiencia", "Staff Hospital Alemán", "Docente Universitario"],
    reviews_list: [
      { name: "Marta S.", stars: 5, comment: "El Dr. Katz es muy paciente y explica todo con claridad. Un excelente profesional.", date: "hace 3 días" },
      { name: "Jorge L.", stars: 4, comment: "Gran atención, muy detallista en el chequeo anual.", date: "hace 2 meses" },
    ],
  },
  "mock-3": {
    name: "Lic. Martín Soria",
    specialty: "Nutrición Deportiva",
    matchScore: 92,
    rating: 4.7,
    reviews: 56,
    priceOnline: "$10.000",
    pricePresencial: "$14.000",
    modality: "Online",
    location: "Online",
    verified: true,
    available: true,
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    initials: "MS",
    bio: "Especialista en nutrición deportiva y cambio de hábitos. Ayudo a atletas y personas activas a optimizar su rendimiento a través de una alimentación basada en evidencia, sin restricciones extremas.",
    tags: ["Rendimiento", "Masa Muscular", "Hábitos", "Suplementación", "Vegano/Vegetariano"],
    availability: ["Mar 08:00", "Mar 17:00", "Mié 18:00", "Jue 09:00"],
    achievements: ["Nutricionista Deportivo", "Antropometrista ISAK II", "Atención 100% Online"],
    reviews_list: [
      { name: "Lucas M.", stars: 5, comment: "Martín me cambió la forma de ver la comida. Bajé de peso rindiendo mejor en el gimnasio.", date: "hace 1 semana" },
    ],
  },
  "mock-4": {
    name: "Dra. Elena Paz",
    specialty: "Dermatología",
    matchScore: 89,
    rating: 4.9,
    reviews: 110,
    priceOnline: "$18.000",
    pricePresencial: "$25.000",
    modality: "Presencial",
    location: "Belgrano, CABA",
    verified: true,
    available: true,
    gradient: "from-rose-600 via-pink-600 to-orange-500",
    initials: "EP",
    bio: "Dermatóloga certificada con especial interés en estética avanzada y patologías de la piel. Mi objetivo es que cada paciente logre una piel sana y radiante mediante tratamientos mínimamente invasivos y personalizados.",
    tags: ["Acné", "Rosácea", "Estética", "Limpieza Profunda", "Manchas", "Piel Sensible"],
    availability: ["Mié 10:00", "Mié 11:00", "Jue 15:00", "Vie 09:00"],
    achievements: ["Dermatóloga UBA", "Especialista en Estética", "Tecnología de Vanguardia"],
    reviews_list: [
      { name: "Sofía P.", stars: 5, comment: "La mejor dermatóloga que visité. Mi rosácea está controlada por primera vez.", date: "hace 2 semanas" },
      { name: "Lucía B.", stars: 5, comment: "Excelente trato y resultados increíbles con el tratamiento láser.", date: "hace 1 mes" },
    ],
  }
};

export default function ProfessionalProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "schedule">("about");
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfessional = async () => {
      if (!id) return;

      // Check if it's a mock profile
      if (id.startsWith("mock-")) {
        setProfessional(MOCK_DATA[id] || MOCK_DATA["mock-1"]);
        setLoading(false);
        return;
      }

      // If not mock, fetch from Supabase
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          profiles:id (name)
        `)
        .eq('id', id)
        .single();

      if (data) {
        const initials = data.profiles?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) || "PR";
        setProfessional({
          id: data.id,
          name: data.profiles?.name || "Profesional",
          specialty: data.specialty || "Especialista",
          matchScore: 90 + Math.floor(Math.random() * 10),
          rating: data.avg_rating || 5.0,
          reviews: data.review_count || 0,
          priceOnline: `$${data.price_online}`,
          pricePresencial: `$${data.price_presencial}`,
          modality: data.modality === 'both' ? 'Online / Presencial' : data.modality === 'online' ? 'Online' : 'Presencial',
          location: data.location || "S/D",
          verified: data.verified || false,
          available: true,
          gradient: "from-sky-600 via-indigo-600 to-blue-700",
          initials,
          bio: data.bio || "No hay biografía disponible.",
          tags: ["Medicina", "Atención"],
          availability: ["Próximamente"],
          achievements: ["Profesional Verificado"],
          reviews_list: []
        });
      } else {
        router.push("/matches");
      }
      setLoading(false);
    };

    loadProfessional();
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#060c18]">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </main>
    );
  }

  const p = professional;

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
            {p.achievements.map((a: string) => (
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
                  {p.tags.map((t: string) => (
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
                    {p.modality}
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {p.reviews_list.length === 0 ? (
                <p className="text-xs text-n-600 text-center py-4">Este profesional aún no tiene reseñas.</p>
              ) : (
                p.reviews_list.map((r: any, i: number) => (
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
                ))
              )}
            </div>
          )}
          {activeTab === "schedule" && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-n-600 uppercase tracking-widest">Próximos turnos disponibles</h3>
              <div className="grid grid-cols-2 gap-2">
                {p.availability.map((slot: string) => (
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
