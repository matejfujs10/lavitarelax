import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BookedRange {
  start_date: string;
  end_date: string;
}

/**
 * Fetches booked date ranges from the public.booked_dates table.
 * RLS allows public read.
 */
export function useBookedDates() {
  const [ranges, setRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("booked_dates")
        .select("start_date, end_date")
        .gte("end_date", new Date().toISOString().slice(0, 10))
        .order("start_date", { ascending: true });
      if (!mounted) return;
      if (error) {
        console.error("Failed to load booked dates:", error.message);
        setRanges([]);
      } else {
        setRanges(data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { ranges, loading };
}
