drop policy if exists "Live campaigns are discoverable" on public.campaigns;

create policy "Live and closed campaigns are readable" on public.campaigns
  for select to authenticated
  using (status in ('live', 'closed') or brand_id = auth.uid() or public.is_admin());
