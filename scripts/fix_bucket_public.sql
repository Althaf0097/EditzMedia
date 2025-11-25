-- Ensure the assets bucket is public
update storage.buckets
set public = true
where id = 'assets';

-- Create a policy to allow public read access if it doesn't exist
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'assets' );
