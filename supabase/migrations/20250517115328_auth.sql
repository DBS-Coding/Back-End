-- Buat tabel users
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Aktifkan RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;


-- Policy untuk insert: izinkan siapa saja insert data baru (misal registrasi)
CREATE POLICY "Allow insert for anyone"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Policy untuk select: hanya user dengan auth.uid() = id yang bisa baca data sendiri
CREATE POLICY "Allow user to read their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy untuk update: hanya user bisa update data sendiri
CREATE POLICY "Allow user to update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy untuk delete: hanya user bisa delete data sendiri
CREATE POLICY "Allow user to delete their own data"
  ON public.users
  FOR DELETE
  USING (auth.uid() = id);
