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
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    const stored = sessionStorage.getItem('lastVisitDate');
    if (stored) {
      setPrevDate(stored);
    }
    // Update storage with the current date for the next page
    sessionStorage.setItem('lastVisitDate', currentDate);
  }, [currentDate]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-[#0B2742] text-white">
      <p className="text-sm">Fecha: {currentDate}</p>
      {prevDate && (
        <button
          onClick={handleBack}
          className="text-xs underline hover:text-[#E5F4FD]"
        >
          Regresar (Fecha: {prevDate})
        </button>
      )}
    </div>
  );
}
