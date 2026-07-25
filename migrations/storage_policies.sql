-- Set up Storage policies for the 'wrap-assets' bucket

-- 1. Allow public read access to all files in the bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'wrap-assets');

-- 2. Allow public insert access (since the app uses anon key to upload)
CREATE POLICY "Public Insert Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'wrap-assets');

-- 3. Allow public update access (for upserts)
CREATE POLICY "Public Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wrap-assets');
