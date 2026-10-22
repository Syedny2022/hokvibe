-- Application access is server-side through Prisma, not InsForge's public API.
-- With no public RLS policies, anon and authenticated cannot access these tables.
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['Account', 'Session', 'SocialPostCreation', 'SocialPublication', 'User', 'VerificationToken'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated, PUBLIC', table_name);
  END LOOP;
END $$;
