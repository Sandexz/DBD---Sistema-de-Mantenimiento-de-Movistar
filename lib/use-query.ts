"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Lee y actualiza un parámetro de la URL sin requerir <Suspense> (a diferencia de
 * useSearchParams en páginas prerenderizadas). Permite enlazar pantallas por código:
 * ?ot=OT-2026-9041, ?ticket=TCK-2026-0416, ?codigo=N-025, etc.
 */
export function useQueryParam(name: string): [string | null, (v: string | null) => void, boolean] {
  const [valor, setValor] = useState<string | null>(null);
  const [leido, setLeido] = useState(false);

  useEffect(() => {
    setValor(new URLSearchParams(window.location.search).get(name));
    setLeido(true);
  }, [name]);

  const actualizar = useCallback(
    (v: string | null) => {
      const url = new URL(window.location.href);
      if (v) url.searchParams.set(name, v);
      else url.searchParams.delete(name);
      window.history.replaceState(window.history.state, "", url.toString());
      setValor(v);
    },
    [name]
  );

  return [valor, actualizar, leido];
}
