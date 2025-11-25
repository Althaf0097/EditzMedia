-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view files in the 'media' bucket (public access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Policy to allow authenticated users to upload files to the 'media' bucket
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media' );

-- Policy to allow users to update their own files (optional, for replacing avatars)
CREATE POLICY "User Update Own Files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'media' AND auth.uid() = owner );

-- Policy to allow users to delete their own files
CREATE POLICY "User Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'media' AND auth.uid() = owner );
