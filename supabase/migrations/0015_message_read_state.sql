alter table public.messages add column if not exists read_at timestamptz;

create policy "Approved participants can mark messages read" on public.messages
  for update to authenticated using (
    exists (select 1 from public.applications a join public.campaigns c on c.id = a.campaign_id
      where a.id = messages.application_id and a.status = 'approved' and (a.creator_id = auth.uid() or c.brand_id = auth.uid()))
  ) with check (read_at is not null);

grant update (read_at) on public.messages to authenticated;
