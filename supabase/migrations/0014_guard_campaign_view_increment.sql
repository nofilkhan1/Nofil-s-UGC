create or replace function public.increment_campaign_view(target_campaign_id uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare updated_count integer;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'creator') then return null; end if;
  update public.campaigns set view_count = view_count + 1
    where id = target_campaign_id and status in ('live', 'closed');
  select view_count into updated_count from public.campaigns where id = target_campaign_id;
  return updated_count;
end; $$;
