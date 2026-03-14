"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function CheckoutMockPage({ params }: { params: { booking_id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          professional_profiles (
            profiles (name)
          )
        `)
        .eq('id', params.booking_id)
        .single();
        
      if (data) {
        setBooking(data);
      } else {
        console.error(error);
        router.push("/dashboard");
      }
      setLoading(false);
    };
    fetchBooking();
  }, [params.booking_id, router]);

  const handleSimulatePayment = async () => {
    setProcessing(true);
    
    // Simulate 2s processing
    await new Promise(r => setTimeout(r, 2000));

    // Update booking status to confirmed
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', params.booking_id);

    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard?payment=success");
      }, 2000);
    } else {
      alert("Error al procesar el pago");
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#060c18]">
      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen relative p-6 sm:p-10 flex flex-col items-center justify-center bg-[#060c18]">
      <div className="bg-scene">
        <div className="bg-blob bg-blob-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="bg-grid" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10 glass rounded-3xl p-8 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div key="form" exit={{ opacity: 0, y: -20 }} className="space-y-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#009EE3] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,158,227,0.3)]">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-black text-n-100 mb-2">Simulación de Pago</h1>
                <p className="text-sm text-n-400">Estás por abonar la consulta con {booking?.professional_profiles?.profiles?.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-xs text-n-500 uppercase tracking-widest font-bold">Total a pagar</span>
                <div className="text-3xl font-black text-white mt-1">${booking?.price_ars}</div>
              </div>

              <button 
                onClick={handleSimulatePayment}
                disabled={processing}
                className="w-full py-4 rounded-2xl bg-[#009EE3] hover:bg-[#0089C5] text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando pago...
                  </>
                ) : (
                  "Pagar con Mercado Pago"
                )}
              </button>

              <button onClick={() => router.back()} disabled={processing} className="text-sm font-medium text-n-500 hover:text-white transition-colors">
                Cancelar y volver
              </button>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">¡Pago Exitoso!</h2>
                <p className="text-sm text-n-400 mt-2">Tu turno ha sido confirmado. Redirigiendo...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
