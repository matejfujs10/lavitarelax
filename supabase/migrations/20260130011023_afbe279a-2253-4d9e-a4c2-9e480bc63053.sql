-- Create gift_vouchers table
CREATE TABLE public.gift_vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  
  -- Pricing info
  nights INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Giver info
  giver_first_name VARCHAR(100) NOT NULL,
  giver_last_name VARCHAR(100) NOT NULL,
  giver_address VARCHAR(255) NOT NULL,
  giver_postal_code VARCHAR(20) NOT NULL,
  giver_city VARCHAR(100) NOT NULL,
  giver_email VARCHAR(255) NOT NULL,
  
  -- Recipient info
  recipient_email VARCHAR(255) NOT NULL,
  recipient_message TEXT,
  
  -- Status and dates
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'redeemed', 'expired', 'cancelled')),
  issued_at TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_vouchers ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (edge functions) to manage vouchers
CREATE POLICY "Service role can manage vouchers" 
ON public.gift_vouchers 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gift_vouchers_updated_at
BEFORE UPDATE ON public.gift_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_gift_vouchers_code ON public.gift_vouchers(code);
CREATE INDEX idx_gift_vouchers_status ON public.gift_vouchers(status);
CREATE INDEX idx_gift_vouchers_stripe_session ON public.gift_vouchers(stripe_session_id);