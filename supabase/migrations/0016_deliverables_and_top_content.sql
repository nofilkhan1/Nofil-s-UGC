alter table public.applications
  add column if not exists deliverable_url text,
  add column if not exists deliverable_submitted_at timestamptz,
  add column if not exists delivery_status text not null default 'not_submitted';

alter table public.applications add constraint applications_delivery_status_valid
  check (delivery_status in ('not_submitted','submitted','confirmed'));

alter table public.creator_profiles add column if not exists top_content_links text[] not null default '{}';
alter table public.creator_profiles add constraint creator_top_content_links_max_three
  check (cardinality(top_content_links) <= 3);

create or replace function public.validate_application_delivery_state()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status <> 'approved' and new.delivery_status <> 'not_submitted' then
    raise exception 'Only approved applications can have delivery progress';
  end if;
  if new.delivery_status = 'not_submitted' then
    new.deliverable_url := null;
    new.deliverable_submitted_at := null;
  elsif new.delivery_status = 'submitted' and (new.deliverable_url is null or new.deliverable_submitted_at is null) then
    raise exception 'Submitted deliveries require a URL and timestamp';
  end if;
  return new;
end;
$$;

drop trigger if exists applications_validate_delivery_state on public.applications;
create trigger applications_validate_delivery_state
before insert or update of status, delivery_status, deliverable_url, deliverable_submitted_at
on public.applications for each row execute function public.validate_application_delivery_state();
