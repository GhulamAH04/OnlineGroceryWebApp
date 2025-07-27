// File: OnlineGroceryWebApp/frontend/src/hooks/useDebounceSearch.ts

import { useEffect, useState } from "react";

export function useDebounceSearch(value: string, delay: number = 500): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
