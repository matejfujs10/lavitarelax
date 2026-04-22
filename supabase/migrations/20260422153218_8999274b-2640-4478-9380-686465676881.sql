-- Tabela za zasedene datume iz iCal feeda
CREATE TABLE IF NOT EXISTS public.booked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary TEXT,
  external_uid TEXT UNIQUE,
  source TEXT NOT NULL DEFAULT 'booking.com',
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booked_dates_range ON public.booked_dates (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_booked_dates_synced ON public.booked_dates (last_synced_at);

ALTER TABLE public.booked_dates ENABLE ROW LEVEL SECURITY;

-- Public read so the calendar can show booked days to anyone
CREATE POLICY "Public can view booked dates"
ON public.booked_dates
FOR SELECT
TO anon, authenticated
USING (true);

-- No public write access; only service role (edge function) writes
CREATE POLICY "Deny public insert"
ON public.booked_dates
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny public update"
ON public.booked_dates
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete"
ON public.booked_dates
FOR DELETE
TO anon, authenticated
USING (false);

-- Sync log table for debugging/observability
CREATE TABLE IF NOT EXISTS public.ical_sync_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL,
  reservations_count INTEGER,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ical_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny public read on sync log"
ON public.ical_sync_log
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny public insert on sync log"
ON public.ical_sync_log
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Auto-update updated_at on booked_dates changes
CREATE OR REPLACE FUNCTION public.update_booked_dates_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_booked_dates_updated_at ON public.booked_dates;
CREATE TRIGGER trg_booked_dates_updated_at
BEFORE UPDATE ON public.booked_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_booked_dates_updated_at();