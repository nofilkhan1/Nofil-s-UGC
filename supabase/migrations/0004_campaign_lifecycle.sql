alter type public.campaign_status rename value 'published' to 'live';
alter table public.campaigns alter column status set default 'draft';
drop policy if exists "Published campaigns are discoverable" on public.campaigns;
create policy "Live campaigns are discoverable" on public.campaigns for select to authenticated using (status = 'live' or brand_id = auth.uid() or public.is_admin());
drop policy if exists "Creators apply to published campaigns" on public.applications;
create policy "Creators apply to live campaigns" on public.applications for insert to authenticated with check (creator_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'creator') and exists (select 1 from public.campaigns where id = campaign_id and status = 'live'));
