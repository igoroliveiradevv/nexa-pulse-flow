-- Fix critical security vulnerabilities by implementing proper RLS policies

-- Drop the existing public policies that allow unrestricted access
DROP POLICY IF EXISTS "Public read clients" ON public.clients;
DROP POLICY IF EXISTS "Public insert clients" ON public.clients;
DROP POLICY IF EXISTS "Public update clients" ON public.clients;
DROP POLICY IF EXISTS "Public delete clients" ON public.clients;
DROP POLICY IF EXISTS "Public read activities" ON public.activities;
DROP POLICY IF EXISTS "Public insert activities" ON public.activities;

-- Create secure RLS policies that require authentication
-- Users can only access their own data (when user_id column exists) or all data if authenticated (for system-wide data)

-- For clients table - require authentication for all operations
CREATE POLICY "Authenticated users can view clients" 
ON public.clients 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert clients" 
ON public.clients 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update clients" 
ON public.clients 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete clients" 
ON public.clients 
FOR DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- For activities table - require authentication for all operations  
CREATE POLICY "Authenticated users can view activities" 
ON public.activities 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert activities" 
ON public.activities 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);