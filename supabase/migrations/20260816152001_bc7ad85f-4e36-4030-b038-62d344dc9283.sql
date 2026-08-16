DELETE FROM public.booked_dates WHERE external_uid = 'manual-2026-09-01';
INSERT INTO public.booked_dates (start_date, end_date, summary, external_uid, source)
VALUES ('2026-08-24','2026-08-26','Manually blocked','manual-2026-08-24','manual')
ON CONFLICT (external_uid) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;