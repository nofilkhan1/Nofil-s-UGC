create table public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index messages_application_created_idx on public.messages(application_id, created_at);
alter table public.messages enable row level security;

create policy "Approved participants can read messages" on public.messages
  for select to authenticated using (
    exists (select 1 from public.applications a join public.campaigns c on c.id = a.campaign_id
      where a.id = messages.application_id and a.status = 'approved' and (a.creator_id = auth.uid() or c.brand_id = auth.uid()))
  );

create policy "Approved participants can send messages" on public.messages
  for insert to authenticated with check (
    sender_id = auth.uid() and exists (
      select 1 from public.applications a join public.campaigns c on c.id = a.campaign_id
      where a.id = messages.application_id and a.status = 'approved' and (a.creator_id = auth.uid() or c.brand_id = auth.uid())
    )
  );

revoke all on public.messages from anon;
grant select, insert on public.messages to authenticated;
