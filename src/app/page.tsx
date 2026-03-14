"use client";

import { motion } from "framer-motion";
import { User, Stethoscope, ChevronRight, Sparkles, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 sm:p-12 overflow-hidden">
      {/* Animated Background */}
      <div className="bg-scene">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      <div className="bg-grid" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        {/* ── Left: Brand Story ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="pill">
            <Sparkles className="w-3 h-3" />
            <span>Matching con IA</span>
          </div>

          <div className="space-y-5">
            <h1 className="text-8xl font-black tracking-tighter leading-none text-gradient">
              NEXOS
            </h1>
            <h2 className="text-2xl font-semibold text-n-300 max-w-md leading-snug">
              La plataforma que conecta profesionales de la salud con sus pacientes ideales.
            </h2>
          </div>

          <p className="text-base text-n-500 max-w-sm leading-relaxed font-light">
            No somos un directorio. Somos tu próximo paso hacia el bienestar, potenciado por algoritmos inteligentes que entienden lo que necesitás en 60 segundos.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3">
            {["Matching IA", "Video Consultas", "Agenda Inteligente", "Pagos Seguros"].map(f => (
              <span key={f} className="text-xs font-semibold text-n-400 px-3 py-1.5 rounded-full glass-inner">
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Role Selection ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-primary-lit" />
              <h3 className="text-lg font-bold text-n-100">Empezar ahora</h3>
            </div>

            <div className="space-y-3">
              {/* Patient Card */}
              <Link href="/auth/signup/patient">
                <div className="group glass-inner p-5 rounded-2xl card-hover flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-n-100 text-base">Soy Paciente</p>
                      <p className="text-xs text-n-500 mt-0.5">Busco ayuda profesional personalizada</p>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-full border border-n-700 group-hover:border-primary group-hover:bg-primary-dim transition-all duration-300">
                    <ChevronRight className="w-4 h-4 text-n-500 group-hover:text-primary-lit" />
                  </div>
                </div>
              </Link>

              {/* Professional Card */}
              <Link href="/auth/signup/professional">
                <div className="group glass-inner p-5 rounded-2xl card-hover flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-900/40">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-n-100 text-base">Soy Profesional</p>
                      <p className="text-xs text-n-500 mt-0.5">Quiero ofrecer mis servicios</p>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-full border border-n-700 group-hover:border-sky-400 group-hover:bg-sky-400/10 transition-all duration-300">
                    <ChevronRight className="w-4 h-4 text-n-500 group-hover:text-sky-400" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="divider" />

            <p className="text-center text-xs text-n-600">
              ¿Ya tenés cuenta?{" "}
              <Link href="/auth/login" className="text-primary-lit font-bold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.25em] text-n-700 font-bold"
      >
        Con el respaldo de Learners Legacy
      </motion.p>
    </main>
  );
}
