-- Run this in Supabase SQL Editor if the frontend fetches portfolio/site settings
-- from the browser (anon key). This allows public read-only access for the homepage.

-- Site settings: allow anyone to read the single row (public contact info, videos, hero)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read site_settings" ON site_settings;
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);

-- Categories: allow anyone to read (used for portfolio filters)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);

-- Portfolio images: allow anyone to read (public gallery)
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read portfolio_images" ON portfolio_images;
CREATE POLICY "Allow public read portfolio_images" ON portfolio_images FOR SELECT USING (true);
