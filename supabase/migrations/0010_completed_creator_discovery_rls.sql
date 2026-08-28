drop policy if exists "Brands can discover creator details" on public.creator_profiles;

create policy "Brands can discover completed creator details" on public.creator_profiles
  for select to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'brand'
    )
    and nullif(trim((select p.display_name from public.profiles p where p.id = creator_profiles.user_id)), '') is not null
    and cardinality(creator_profiles.niches) >= 1
  );
