
-- Add explicit deny policies to security_events to make locked-down access
-- explicit (RLS is enabled but had no policies).
CREATE POLICY "Deny public select on security_events"
  ON public.security_events FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Deny public insert on security_events"
  ON public.security_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Deny public update on security_events"
  ON public.security_events FOR UPDATE
  TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "Deny public delete on security_events"
  ON public.security_events FOR DELETE
  TO anon, authenticated
  USING (false);
