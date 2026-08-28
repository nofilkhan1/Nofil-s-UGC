create or replace function public.submit_application_deliverable(target_application_id uuid, target_creator_id uuid, submitted_url text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if target_creator_id <> auth.uid() then raise exception 'Not authorized'; end if;
  update public.applications set deliverable_url = submitted_url, deliverable_submitted_at = now(), delivery_status = 'submitted'
    where id = target_application_id and creator_id = auth.uid() and status = 'approved' and delivery_status = 'not_submitted';
  return found;
end; $$;

create or replace function public.confirm_application_deliverable(target_application_id uuid, target_brand_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare campaign_title text;
begin
  if target_brand_id <> auth.uid() then raise exception 'Not authorized'; end if;
  select c.title into campaign_title from public.applications a join public.campaigns c on c.id = a.campaign_id
    where a.id = target_application_id and c.brand_id = auth.uid() and a.status = 'approved' and a.delivery_status = 'submitted';
  if campaign_title is null then return false; end if;
  update public.applications set delivery_status = 'confirmed' where id = target_application_id;
  insert into public.notifications (recipient_id, type, title, message, href, related_application_id, is_read)
    select a.creator_id, 'delivery_confirmed', 'Delivery confirmed', 'Your delivery for ''' || campaign_title || ''' was confirmed!', '/creator/applications', a.id, false
    from public.applications a where a.id = target_application_id;
  return true;
end; $$;

revoke all on function public.submit_application_deliverable(uuid, uuid, text) from public;
revoke all on function public.confirm_application_deliverable(uuid, uuid) from public;
grant execute on function public.submit_application_deliverable(uuid, uuid, text) to authenticated;
grant execute on function public.confirm_application_deliverable(uuid, uuid) to authenticated;
