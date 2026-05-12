import { useEffect, useRef, useState } from "react";
import { checkCredits } from "@/lib/api";

export function useCreditBalance(email: string) {
  const [credits, setCredits] = useState<number | null>(null);
  const fetchedForRef = useRef<string>("");

  useEffect(() => {
    if (!email || fetchedForRef.current === email) return;
    fetchedForRef.current = email;
    checkCredits({ email }).then(setCredits).catch(() => setCredits(0));
  }, [email]);

  const decrement = () => setCredits(c => (c != null && c > 0 ? c - 1 : c));
  const refetch = () => {
    if (!email) return;
    fetchedForRef.current = "";
    checkCredits({ email }).then(setCredits).catch(() => setCredits(0));
  };

  return { credits, decrement, refetch };
}
