"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

/* ── Quiz data ───────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es tu principal motivo de consulta?",
    options: [
      { emoji: "🧠", label: "Salud mental y emocional" },
      { emoji: "🍎", label: "Nutrición y peso" },
      { emoji: "💪", label: "Dolor físico o rehabilitación" },
      { emoji: "❤️", label: "Salud cardiovascular" },
      { emoji: "🌿", label: "Bienestar general" },
      { emoji: "🦷", label: "Salud dental" },
    ],
  },
  {
    id: 2,
    question: "¿Con qué frecuencia necesitarías consultas?",
    options: [
      { emoji: "📅", label: "Una vez a la semana" },
      { emoji: "🗓️", label: "Cada dos semanas" },
      { emoji: "📆", label: "Una vez al mes" },
      { emoji: "🔄", label: "Solo cuando lo necesite" },
    ],
  },
  {
    id: 3,
    question: "¿Qué modalidad de atención preferís?",
    options: [
      { emoji: "💻", label: "100% Online" },
      { emoji: "🏥", label: "Presencial" },
      { emoji: "🔀", label: "Ambas (flexible)" },
    ],
  },
  {
    id: 4,
    question: "¿Qué rango de edad tiene el profesional ideal para vos?",
    options: [
      { emoji: "🎓", label: "Joven (25–35)" },
      { emoji: "⚖️", label: "Intermedio (35–50)" },
      { emoji: "🏛️", label: "Experimentado (50+)" },
      { emoji: "🤷", label: "Indistinto" },
    ],
  },
  {
    id: 5,
    question: "¿Cuánto estás dispuesto/a a invertir por sesión?",
    options: [
      { emoji: "💵", label: "Hasta $5.000" },
      { emoji: "💴", label: "$5.000 – $15.000" },
      { emoji: "💰", label: "$15.000 – $30.000" },
      { emoji: "💎", label: "Más de $30.000" },
    ],
  },
  {
    id: 6,
    question: "¿Qué te importa más de un profesional?",
    options: [
      { emoji: "📜", label: "Experiencia y trayectoria" },
      { emoji: "⭐", label: "Reseñas de otros pacientes" },
      { emoji: "🤝", label: "Empatía y comunicación" },
      { emoji: "🔬", label: "Enfoque científico / evidencia" },
    ],
  },
  {
    id: 7,
    question: "¿Cuál es tu disponibilidad horaria?",
    options: [
      { emoji: "🌅", label: "Mañana (8–12h)" },
      { emoji: "☀️", label: "Mediodía (12–16h)" },
      { emoji: "🌆", label: "Tarde (16–20h)" },
      { emoji: "🌙", label: "Noche (20h+)" },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleSelect = (label: string) => setSelected(label);

  const handleNext = () => {
    if (!selected) return;
    setAnswers(prev => ({ ...prev, [q.id]: selected }));
    if (isLast) {
      router.push("/onboarding/searching");
    } else {
      setDirection(1);
      setStep(s => s + 1);
      setSelected(null);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
    setSelected(answers[QUESTIONS[step - 1].id] || null);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-3" />
      </div>
      <div className="bg-grid" />

      <div className="w-full max-w-lg z-10 flex flex-col gap-8">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-n-600">
            <span>Pregunta {step + 1} de {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-n-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #6366f1, #0ea5e9)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-8 space-y-6"
          >
            <h2 className="text-2xl font-black text-n-100 leading-snug">{q.question}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  className={`glass-inner flex items-center gap-3 p-4 rounded-2xl text-left font-semibold text-sm transition-all duration-300
                    ${selected === opt.label
                      ? "border-primary bg-primary/10 text-n-100 shadow-[0_0_0_2px_rgba(99,102,241,0.5)]"
                      : "text-n-400 hover:text-n-200 hover:border-n-600"
                    }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="leading-tight">{opt.label}</span>
                  {selected === opt.label && <CheckCircle2 className="ml-auto w-4 h-4 text-primary-lit flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={handleBack} className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm">
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`btn-primary flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl
              ${!selected ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {isLast ? "Ver mis matches ✨" : "Siguiente"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
