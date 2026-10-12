"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * NavigationHeader component displays the current date and, if available, a "Regresar"
 * button showing the date when the user previously visited a page. It stores the
 * last visited date in `sessionStorage` under the key `lastVisitDate`. When the component
 * mounts it reads the previous date, updates the stored value to the current date, and
 * provides a convenient back navigation.
 */
export default function NavigationHeader() {
  const router = useRouter();
  const [prevDate, setPrevDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const today = new Date().toLocaleDateString('es-PE');
    setCurrentDate(today);

    try {
      const stored = sessionStorage.getItem('lastVisitDate');
      if (stored) {
        setPrevDate(stored);
      }
      // Update storage with the current date for the next page
      sessionStorage.setItem('lastVisitDate', today);
    } catch {
      // Ignore sessionStorage errors in SSR or restricted environments
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between py-1 px-3 bg-[#0B2742] text-white rounded-xl border border-[#019DF4]/30 text-xs shadow-xs gap-3">
      <p className="text-xs font-mono text-slate-300">
        {currentDate ? `Fecha: ${currentDate}` : 'Cargando fecha...'}
      </p>
      {prevDate && (
        <button
          type="button"
          onClick={handleBack}
          className="text-xs underline hover:text-[#019DF4] text-[#E5F4FD] transition-colors cursor-pointer font-medium"
        >
          Regresar (Fecha: {prevDate})
        </button>
      )}
    </div>
  );
}

