-- Grant schema usage permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table privileges on properties
GRANT ALL ON TABLE public.properties TO postgres, service_role;
GRANT SELECT ON TABLE public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.properties TO authenticated;

-- Grant table privileges on inquiries
GRANT ALL ON TABLE public.inquiries TO postgres, service_role;
GRANT INSERT ON TABLE public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO authenticated;

-- Grant table privileges on submissions
GRANT ALL ON TABLE public.submissions TO postgres, service_role;
GRANT INSERT ON TABLE public.submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.submissions TO authenticated;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated;
