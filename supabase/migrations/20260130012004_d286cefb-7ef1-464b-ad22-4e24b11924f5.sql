-- Fix RLS policies for gift_vouchers table
-- Remove the overly permissive policy and add proper restrictive policies

-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Service role can manage vouchers" ON public.gift_vouchers;

-- Create policy: Deny all public/anon SELECT access
-- Only service_role can read vouchers (used by edge functions)
CREATE POLICY "Deny public read access"
ON public.gift_vouchers
FOR SELECT
TO anon, authenticated
USING (false);

-- Create policy: Deny all public/anon INSERT access
-- Only service_role can insert vouchers
CREATE POLICY "Deny public insert access"
ON public.gift_vouchers
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Create policy: Deny all public/anon UPDATE access
-- Only service_role can update vouchers  
CREATE POLICY "Deny public update access"
ON public.gift_vouchers
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Create policy: Deny all public/anon DELETE access
-- Only service_role can delete vouchers
CREATE POLICY "Deny public delete access"
ON public.gift_vouchers
FOR DELETE
TO anon, authenticated
USING (false);

-- Note: service_role bypasses RLS by default, so edge functions using 
-- SUPABASE_SERVICE_ROLE_KEY will still have full access