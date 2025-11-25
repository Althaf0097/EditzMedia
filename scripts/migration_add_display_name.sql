-- Add display_name column to profiles
alter table profiles add column if not exists display_name text;

-- Update handle_new_user function to copy display_name from metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$;
