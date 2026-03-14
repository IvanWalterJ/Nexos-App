"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProfessionalProfile {
  id: string;
  specialty: string;
  bio: string | null;
  years_experience: number;
  price_online: number | null;
  price_presencial: number | null;
  modality: 'online' | 'presencial' | 'both';
  location: string | null;
  is_active: boolean;
}

export default function ProfessionalProfileEdit() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const [{ data: pData }, { data: ppData }] = await Promise.all([
        supabase.from("profiles").select("name").eq("id", user.id).single(),
        supabase.from("professional_profiles").select("*").eq("id", user.id).single()
      ]);

      if (pData) setName(pData.name);
      if (ppData) setProfile(ppData);
      setLoading(false);
    };
    getData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!profile) return;
    const { name, value, type } = e.target as HTMLInputElement;
    let finalValue: any = value;
    
    if (type === 'number') {
      finalValue = value ? parseInt(value, 10) : null;
    } else if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setProfile({ ...profile, [name]: finalValue });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccess(false);

    // Update base profile name
    await supabase.from("profiles").update({ name }).eq("id", profile.id);

    // Update professional profile
    const { error } = await supabase
      .from("professional_profiles")
      .update({
        specialty: profile.specialty,
        bio: profile.bio,
        years_experience: profile.years_experience,
        price_online: profile.price_online,
        price_presencial: profile.price_presencial,
        modality: profile.modality,
        location: profile.location,
        is_active: profile.is_active,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      console.error(error);
      alert("Error al guardar los cambios.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-scene"><div className="bg-blob bg-blob-2" /></div>
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden pb-32">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="max-w-2xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/professional/dashboard" className="glass-inner p-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-n-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-n-100">Mi Perfil</h1>
            <p className="text-sm text-n-500">Completá tus datos para recibir pacientes.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-5">
            <h2 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4">Información Personal</h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-n-300 ml-1">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="nexos-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-n-300 ml-1">Especialidad Principal</label>
              <input
                type="text"
                name="specialty"
                value={profile?.specialty || ""}
                onChange={handleChange}
                className="nexos-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-n-300 ml-1">Sobre Mí (Bio)</label>
              <textarea
                name="bio"
                value={profile?.bio || ""}
                onChange={handleChange}
                className="nexos-input min-h-[120px] resize-none"
                placeholder="Explicá tu enfoque, cómo trabajas y en qué te especializás..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-n-300 ml-1">Años de Experiencia</label>
              <input
                type="number"
                name="years_experience"
                value={profile?.years_experience || 0}
                onChange={handleChange}
                className="nexos-input"
                min="0"
                max="60"
              />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl space-y-5">
            <h2 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4">Servicios y Precios</h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-n-300 ml-1">Modalidad de Atención</label>
              <select
                name="modality"
                value={profile?.modality || "both"}
                onChange={handleChange}
                className="nexos-input"
              >
                <option value="both">Online y Presencial</option>
                <option value="online">Solo Online (Videollamada)</option>
                <option value="presencial">Solo Presencial</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-n-300 ml-1">Precio Online (ARS)</label>
                <input
                  type="number"
                  name="price_online"
                  value={profile?.price_online || ""}
                  onChange={handleChange}
                  className="nexos-input"
                  placeholder="Ej. 15000"
                  disabled={profile?.modality === "presencial"}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-n-300 ml-1">Precio Presencial (ARS)</label>
                <input
                  type="number"
                  name="price_presencial"
                  value={profile?.price_presencial || ""}
                  onChange={handleChange}
                  className="nexos-input"
                  placeholder="Ej. 20000"
                  disabled={profile?.modality === "online"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-n-300 ml-1">Ubicación del Consultorio (opcional)</label>
              <input
                type="text"
                name="location"
                value={profile?.location || ""}
                onChange={handleChange}
                className="nexos-input"
                placeholder="Barrio, Ciudad, Provincia"
                disabled={profile?.modality === "online"}
              />
            </div>
          </div>

          {/* Settings Group */}
          <div className="glass p-6 rounded-3xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-n-100">Perfil Público Activo</h2>
              <p className="text-xs text-n-500 mt-1">Si está inactivo, no aparecerás en las búsquedas ni matches.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="is_active" checked={profile?.is_active || false} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-n-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          {/* Fixed bottom bar for saving */}
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#060c18]/80 backdrop-blur-xl z-50">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <div className="text-sm font-medium">
                {success ? (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Guardado correctamente
                  </span>
                ) : (
                  <span className="text-n-500">Cambios sin guardar</span>
                )}
              </div>
              <button
                type="submit"
                disabled={saving || loading || success}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
