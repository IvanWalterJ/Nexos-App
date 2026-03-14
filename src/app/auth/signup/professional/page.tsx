"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight, Mail, User, Lock, Stethoscope, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getURL } from "@/lib/utils";

const SPECIALTIES = [
  "Psicología", "Nutrición", "Fisioterapia", "Medicina General",
  "Odontología", "Cardiología", "Dermatología", "Traumatología", "Otro",
];

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [specialty, setSpecialty]   = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { name, role: "professional", specialty },
        emailRedirectTo: `${getURL()}/auth/callback`
      },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
        <div className="bg-scene">
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
        </div>
        <div className="bg-grid" />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md z-10">
          <div className="glass rounded-3xl p-8 sm:p-10 space-y-7 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Revisá tu correo</h1>
              <p className="text-sm text-n-400 mt-2">Te enviamos un enlace para confirmar tu cuenta a <strong className="text-sky-400">{email}</strong>.</p>
              <p className="text-sm text-n-500 mt-2">No olvides revisar la carpeta de spam o correo no deseado.</p>
            </div>
            <Link href="/auth/login" className="btn-primary w-full inline-block py-4">
              Ir a Iniciar Sesión
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      <div className="bg-grid" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <Link href="/" className="inline-flex items-center text-sm font-medium text-n-500 hover:text-n-200 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver
        </Link>

        <div className="glass rounded-3xl p-8 sm:p-10 space-y-7">
          <div className="space-y-2">
            <div className="pill mb-3" style={{ borderColor: "rgba(14,165,233,0.35)", background: "rgba(14,165,233,0.12)", color: "#7dd3fc" }}>
              <Stethoscope className="w-3 h-3" />
              <span>Perfil Profesional</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gradient-sky">Unirse como Profesional</h1>
            <p className="text-n-500 text-sm">Creá tu vitrina y conectá con pacientes ideales</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Nombre completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-n-600 group-focus-within:text-sky-400 transition-colors" />
                <input type="text" placeholder="Dr. María González" value={name}
                  onChange={(e) => setName(e.target.value)} required className="nexos-input" />
              </div>
            </div>

            {/* Specialty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Especialidad</label>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} required
                className="nexos-input pl-4 appearance-none cursor-pointer">
                <option value="" disabled>Selecciona tu especialidad</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-n-600 group-focus-within:text-sky-400 transition-colors" />
                <input type="email" placeholder="dr.gonzalez@ejemplo.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required className="nexos-input" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-n-600 group-focus-within:text-sky-400 transition-colors" />
                <input type={showPw ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password}
                  onChange={(e) => setPassword(e.target.value)} required className="nexos-input pr-12" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-n-600 hover:text-n-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2 py-4 rounded-2xl font-bold text-white transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #0369a1)", boxShadow: "0 4px 20px rgba(14,165,233,0.4)" }}>
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <span>Crear Perfil Profesional</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="divider" />
          <p className="text-center text-xs text-n-600">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/login" className="text-sky-400 font-bold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
