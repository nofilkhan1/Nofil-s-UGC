-- Adds explicit decision-notification metadata without changing existing records.
alter table public.notifications
  add column if not exists type text not null default 'general',
  add column if not exists related_application_id uuid references public.applications(id) on delete set null,
  add column if not exists is_read boolean not null default false;

create index if not exists notifications_application_idx
  on public.notifications(related_application_id);

create or replace function public.notify_application_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  campaign_title text;
begin
  select title into campaign_title from public.campaigns where id = new.campaign_id;

  if tg_op = 'INSERT' then
    insert into public.notifications (recipient_id, type, title, message, href, related_application_id, is_read)
    select c.brand_id, 'application_received', 'New campaign application',
      'A creator applied to ' || c.title || '.',
      '/brand/campaigns/' || c.id::text, new.id, false
    from public.campaigns c where c.id = new.campaign_id;
  elsif old.status = 'pending' and new.status = 'approved' then
    insert into public.notifications (recipient_id, type, title, message, href, related_application_id, is_read)
    values (
      new.creator_id, 'application_approved', 'Application approved',
      'Your application to ''' || campaign_title || ''' was approved!',
      '/creator/applications', new.id, false
    );
  elsif old.status = 'pending' and new.status = 'rejected' then
    insert into public.notifications (recipient_id, type, title, message, href, related_application_id, is_read)
    values (
      new.creator_id, 'application_rejected', 'Application update',
      'Your application to ''' || campaign_title || ''' was not selected this time.',
      '/creator/applications', new.id, false
    );
  end if;
  return new;
end;
$$;

drop trigger if exists applications_notify_insert on public.applications;
drop trigger if exists applications_notify_decision on public.applications;
create trigger applications_notify_insert after insert on public.applications
  for each row execute function public.notify_application_change();
create trigger applications_notify_decision after update of status on public.applications
  for each row execute function public.notify_application_change();

grant update (read_at, is_read) on public.notifications to authenticated;
