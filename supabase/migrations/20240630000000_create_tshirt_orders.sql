-- Create T-shirt sizes enum type
CREATE TYPE tshirt_size AS ENUM ('S', 'M', 'L', 'XL');

-- Create T-shirt orders table
CREATE TABLE IF NOT EXISTS public.tshirt_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL,
  edition_id INTEGER NOT NULL,
  size tshirt_size NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  payment_reference VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_registration
    FOREIGN KEY (registration_id)
    REFERENCES public.registrations(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_edition
    FOREIGN KEY (edition_id)
    REFERENCES public.editions(id)
    ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_registration_id ON public.tshirt_orders(registration_id);
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_edition_id ON public.tshirt_orders(edition_id);
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_status ON public.tshirt_orders(status);

-- Add RLS policies
ALTER TABLE public.tshirt_orders ENABLE ROW LEVEL SECURITY;

-- Allow public to insert their own orders (no auth required)
CREATE POLICY "Allow public insert for tshirt_orders"
  ON public.tshirt_orders
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "Allow users to view their own tshirt orders"
  ON public.tshirt_orders
  FOR SELECT
  USING (
    registration_id IN (
      SELECT id FROM public.registrations 
      WHERE phone = (SELECT current_setting('request.headers', true)::json->>'x-phone')
    )
  );

-- Allow admins to view all orders
CREATE POLICY "Allow admin all access to tshirt_orders"
  ON public.tshirt_orders
  USING (auth.role() = 'service_role');

-- Allow admins to update order status
CREATE POLICY "Allow admin to update tshirt_orders"
  ON public.tshirt_orders
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Update the types in the database
COMMENT ON TABLE public.tshirt_orders IS 'Stores T-shirt orders for event participants';
COMMENT ON COLUMN public.tshirt_orders.registration_id IS 'Reference to the registration record';
COMMENT ON COLUMN public.tshirt_orders.edition_id IS 'Reference to the event edition';
COMMENT ON COLUMN public.tshirt_orders.size IS 'T-shirt size (S, M, L, XL)';
COMMENT ON COLUMN public.tshirt_orders.quantity IS 'Number of T-shirts ordered';
COMMENT ON COLUMN public.tshirt_orders.payment_reference IS 'Payment reference number from bank/Telebirr';
COMMENT ON COLUMN public.tshirt_orders.status IS 'Order status: pending, verified, cancelled';
