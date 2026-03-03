
-- Add recipient name fields
ALTER TABLE public.gift_vouchers
  ADD COLUMN IF NOT EXISTS recipient_first_name varchar,
  ADD COLUMN IF NOT EXISTS recipient_last_name varchar;

-- Add status tracking fields
ALTER TABLE public.gift_vouchers
  ADD COLUMN IF NOT EXISTS voucher_generated boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recipient_email_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_email_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS error_message text;
