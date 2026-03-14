"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Analizando tus preferencias...",
  "Rastreando especialistas disponibles...",
  "Calculando compatibilidad...",
  "Ordenando por match score...",
  "¡Tus matches están listos!",
];

export default function SearchingPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/matches");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden text-center">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      <div className="bg-grid" />

      <div className="z-10 space-y-10 max-w-sm">
        {/* Pulsing brain icon */}
        <div className="flex items-center justify-center relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-36 h-36 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35), transparent)" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)", boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gradient">Buscando tu match ideal</h1>
          <p className="text-n-500 text-sm leading-relaxed font-medium">
            Nuestra IA está analizando miles de perfiles para encontrar los profesionales más compatibles con vos.
          </p>
        </div>

        {/* Sequential step list */}
        <div className="space-y-3 text-left">
          {STEPS.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.9, duration: 0.5 }}
              className="flex items-center gap-3 text-sm font-medium text-n-400"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.9 + 0.3, type: "spring" }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: i < 4 ? "linear-gradient(135deg, #6366f1, #0ea5e9)" : "#22c55e" }}
              />
              {s}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
