"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Video, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { use } from "react"; // Next.js 15 requires React.use for unwrapping params if needed, but in standard client component sometimes just accessing works, but we can stick to standard approach.

interface ProfessionalProps {
  id: string;
  name: string;
  specialty: string;
  price_online: number | null;
  price_presencial: number | null;
  modality: 'online' | 'presencial' | 'both';
  location: string | null;
}

export default function BookingFlowPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [professional, setProfessional] = useState<ProfessionalProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking details
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<'online' | 'presencial' | null>(null);

  // Unpack params the Next.js 14/15 way if it's considered a promise, but usually params are synchronous in standard setups unless it's a dynamic path in specific next.js 15 configurations. We will assume standard for now, but handle potential issues if any.
  
  useEffect(() => {
    const fetchPro = async () => {
      // In a real app we fetch this from Supabase by params.id
      // We will mock it matching the profile page for now, but use Supabase if connected
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          id, specialty, price_online, price_presencial, modality, location,
          profiles:id (name)
        `)
        .eq('id', params.id)
        .single();
        
      if (data) {
        setProfessional({
          id: data.id,
          name: (data as any).profiles?.name || "Profesional",
          specialty: data.specialty,
          price_online: data.price_online,
          price_presencial: data.price_presencial,
          modality: data.modality as 'online'|'presencial'|'both',
          location: data.location
        });
      } else {
        // Mock fallback if they click the mock "Lic. Valentina Romero" card
        setProfessional({
          id: params.id,
          name: "Lic. Valentina Romero",
          specialty: "Psicología Clínica",
          price_online: 12000,
          price_presencial: 18000,
          modality: "both",
          location: "Buenos Aires"
        });
      }
      setLoading(false);
    };
    fetchPro();
  }, [params.id]);

  const DATES = [
    { date: new Date(new Date().setDate(new Date().getDate() + 1)), label: "Mañana" },
    { date: new Date(new Date().setDate(new Date().getDate() + 2)), label: "Jueves" },
    { date: new Date(new Date().setDate(new Date().getDate() + 3)), label: "Viernes" },
  ];

  const TIMES = ["09:00", "10:00", "11:30", "14:00", "15:00", "17:30"];

  const handleNext = () => {
    if (step === 1 && selectedModality) setStep(2);
    else if (step === 2 && selectedDate && selectedTime) setStep(3);
  };

  const handleConfirm = async () => {
    // Call Supabase to create the booking row, then redirect to confirmation or payment
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Insert booking
    const { data, error } = await supabase.from('bookings').insert({
      patient_id: user.id,
      professional_id: professional?.id,
      status: 'pending',
      modality: selectedModality,
      scheduled_at: selectedDate?.toISOString(), // Simplified date/time merging for the UI mock
      price_ars: selectedModality === "online" ? professional?.price_online : professional?.price_presencial
    }).select().single();

    if (!error) {
      router.push(`/checkout/${data.id}`);
    } else {
      console.error(error);
      alert("Error al agendar turno");
    }
  };

  if (loading) return null; // Or a loader

  return (
    <main className="min-h-screen relative p-6 sm:p-10 overflow-hidden pb-32 flex flex-col items-center">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <div className="w-full max-w-lg z-10 relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2) : router.back()} className="glass-inner p-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-n-400" />
          </button>
          <div>
            <h1 className="text-xl font-black text-n-100">Reservar Turno</h1>
            <p className="text-sm text-n-500">{professional?.name}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Steps Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-lg font-black text-white">1. Seleccioná la modalidad</h2>
              
              <div className="space-y-3">
                {(professional?.modality === 'online' || professional?.modality === 'both') && (
                  <button 
                    onClick={() => setSelectedModality('online')}
                    className={`w-full text-left p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${selectedModality === 'online' ? 'border-sky-500 bg-sky-500/10' : 'border-white/5 glass hover:border-white/10'}`}
                  >
                    <div className={`p-3 rounded-2xl ${selectedModality === 'online' ? 'bg-sky-500 text-white' : 'glass-inner text-n-400'}`}>
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-n-100 text-lg">Online</h3>
                      <p className="text-sm text-n-500">Videollamada</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-gradient">${professional?.price_online}</div>
                    </div>
                  </button>
                )}

                {(professional?.modality === 'presencial' || professional?.modality === 'both') && (
                  <button 
                    onClick={() => setSelectedModality('presencial')}
                    className={`w-full text-left p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${selectedModality === 'presencial' ? 'border-sky-500 bg-sky-500/10' : 'border-white/5 glass hover:border-white/10'}`}
                  >
                    <div className={`p-3 rounded-2xl ${selectedModality === 'presencial' ? 'bg-sky-500 text-white' : 'glass-inner text-n-400'}`}>
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-n-100 text-lg">Presencial</h3>
                      <p className="text-sm text-n-500">{professional?.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-gradient">${professional?.price_presencial}</div>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-lg font-black text-white mb-4">2. Elegí un día</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {DATES.map((d, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedDate(d.date)}
                      className={`min-w-[100px] flex-shrink-0 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${selectedDate === d.date ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/5 glass hover:border-white/10'}`}
                    >
                      <span className="text-xs font-bold text-n-400 uppercase tracking-widest">{d.label}</span>
                      <span className="text-2xl font-black text-white">{d.date.getDate()}</span>
                      <span className="text-xs text-n-500">{d.date.toLocaleString('es-ES', { month: 'short' })}</span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <h2 className="text-lg font-black text-white mb-4">3. Seleccioná el horario</h2>
                    <div className="grid grid-cols-3 gap-3">
                      {TIMES.map((t) => (
                        <button 
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`p-3 rounded-xl font-bold text-sm transition-all border-2 ${selectedTime === t ? 'border-sky-500 bg-sky-500/20 text-white' : 'border-white/5 glass text-n-300 hover:border-white/10 hover:text-white'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="glass p-6 rounded-3xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Confirmar Turno</h2>
                  <p className="text-sm text-n-400 mt-2">Revisá los detalles de tu consulta.</p>
                </div>
                
                <div className="divider" />
                
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-sky-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-n-500 uppercase tracking-widest">Fecha y Hora</div>
                      <div className="text-n-100 font-bold">{selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {selectedModality === 'online' ? <Video className="w-5 h-5 text-sky-400 mt-0.5" /> : <MapPin className="w-5 h-5 text-sky-400 mt-0.5" />}
                    <div>
                      <div className="text-xs font-bold text-n-500 uppercase tracking-widest">Modalidad</div>
                      <div className="text-n-100 font-bold capitalize">{selectedModality}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-sky-500/10 border border-indigo-500/20 flex justify-between items-center">
                  <span className="font-bold text-n-200">Total a pagar</span>
                  <span className="text-2xl font-black text-white">
                    ${selectedModality === 'online' ? professional?.price_online : professional?.price_presencial}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#060c18]/80 backdrop-blur-xl z-50">
          <div className="max-w-lg mx-auto flex justify-between items-center">
            <span className="text-sm font-bold text-n-400">Paso {step} de 3</span>
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 ? !selectedModality : (!selectedDate || !selectedTime)}
                className="btn-primary px-8 py-3 rounded-2xl flex items-center gap-2 disabled:opacity-50"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleConfirm}
                className="btn-primary px-8 py-3 rounded-2xl flex items-center gap-2"
              >
                Ir a Pagar
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
