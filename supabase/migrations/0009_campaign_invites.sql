-- Securely send a nudge from a brand to a creator without creating an application.
create or replace function public.send_campaign_invite(target_creator_id uuid, target_campaign_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_title text;
  brand_name text;
begin
  select c.title, p.display_name into campaign_title, brand_name
  from public.campaigns c
  join public.profiles p on p.id = c.brand_id
  where c.id = target_campaign_id and c.brand_id = auth.uid() and c.status = 'live';
  if campaign_title is null then raise exception 'Campaign is not live or not owned by this brand'; end if;
  if not exists (select 1 from public.profiles where id = target_creator_id and role = 'creator') then raise exception 'Creator not found'; end if;
  insert into public.notifications (recipient_id, type, title, message, href, is_read)
  values (target_creator_id, 'campaign_invite', 'Campaign invitation', brand_name || ' invited you to apply to ''' || campaign_title || '''', '/creator/campaigns/' || target_campaign_id::text, false);
  return true;
end;
$$;

revoke all on function public.send_campaign_invite(uuid, uuid) from public;
grant execute on function public.send_campaign_invite(uuid, uuid) to authenticated;

-- Brands may browse completed creator profiles without an existing application.
create policy "Brands can discover creator details" on public.creator_profiles
  for select to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'brand')
  );
