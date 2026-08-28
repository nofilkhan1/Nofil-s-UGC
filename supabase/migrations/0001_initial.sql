-- CreatorDock MVP schema. Run in the Supabase SQL editor or with `supabase db push`.
create extension if not exists pgcrypto;

create type public.user_role as enum ('brand', 'creator', 'admin');
create type public.platform_type as enum ('instagram', 'tiktok');
create type public.campaign_status as enum ('draft', 'published', 'closed');
create type public.application_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  display_name text not null check (char_length(display_name) between 2 and 80),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creator_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  gender text check (gender is null or gender in ('woman', 'man', 'non_binary', 'prefer_not_to_say')),
  age smallint check (age is null or age between 18 and 100),
  bio text check (bio is null or char_length(bio) <= 600),
  portfolio_url text,
  instagram_url text,
  tiktok_url text,
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  description text not null check (char_length(description) between 20 and 3000),
  platform public.platform_type not null,
  content_format text not null check (char_length(content_format) between 2 and 80),
  post_count smallint not null check (post_count between 1 and 100),
  start_date date not null,
  end_date date not null,
  status public.campaign_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_date_order check (end_date >= start_date)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  price_per_post numeric(12, 2) not null check (price_per_post > 0),
  currency text not null check (currency in ('USD', 'GBP', 'EUR', 'PKR')),
  note text check (note is null or char_length(note) <= 500),
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (campaign_id, creator_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index campaigns_brand_idx on public.campaigns(brand_id, created_at desc);
create index campaigns_discover_idx on public.campaigns(status, platform, created_at desc);
create index applications_campaign_idx on public.applications(campaign_id, created_at desc);
create index applications_creator_idx on public.applications(creator_id, created_at desc);
create index notifications_recipient_idx on public.notifications(recipient_id, read_at, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger creator_profiles_updated_at before update on public.creator_profiles for each row execute function public.set_updated_at();
create trigger campaigns_updated_at before update on public.campaigns for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role public.user_role;
  requested_name text;
begin
  -- Admin is never accepted from signup metadata. It must be assigned by a database owner.
  requested_role := case
    when new.raw_user_meta_data ->> 'role' = 'brand' then 'brand'::public.user_role
    else 'creator'::public.user_role
  end;
  requested_name := trim(coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));

  insert into public.profiles (id, role, display_name)
  values (new.id, requested_role, left(requested_name, 80));

  if requested_role = 'creator' then
    insert into public.creator_profiles (user_id) values (new.id);
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.decide_application(application_id uuid, decision public.application_status)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.applications;
begin
  if decision not in ('approved', 'rejected') then
    raise exception 'Decision must be approved or rejected';
  end if;

  update public.applications a
  set status = decision, decided_at = now()
  from public.campaigns c
  where a.id = application_id
    and c.id = a.campaign_id
    and (c.brand_id = auth.uid() or public.is_admin())
    and a.status = 'pending'
  returning a.* into result;

  if result.id is null then
    raise exception 'Application is unavailable or has already been decided';
  end if;
  return result;
end;
$$;

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
    insert into public.notifications (recipient_id, title, message, href)
    select c.brand_id, 'New campaign application',
      'A creator applied to ' || c.title || '.',
      '/brand/campaigns/' || c.id::text
    from public.campaigns c where c.id = new.campaign_id;
  elsif old.status = 'pending' and new.status in ('approved', 'rejected') then
    insert into public.notifications (recipient_id, title, message, href)
    values (
      new.creator_id,
      case when new.status = 'approved' then 'You were selected' else 'Application update' end,
      case when new.status = 'approved'
        then 'You were selected for ' || campaign_title || '. Review the brief and campaign dates.'
        else 'The brand chose another direction for ' || campaign_title || '.'
      end,
      '/creator/applications'
    );
  end if;
  return new;
end;
$$;

create trigger applications_notify_insert after insert on public.applications for each row execute function public.notify_application_change();
create trigger applications_notify_decision after update of status on public.applications for each row execute function public.notify_application_change();

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.applications enable row level security;
alter table public.notifications enable row level security;

create policy "Authenticated users can see roster identities" on public.profiles
  for select to authenticated using (true);
create policy "Users can update their own basic profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "Creators and admins can read creator details" on public.creator_profiles
  for select to authenticated using (
    user_id = auth.uid() or public.is_admin() or exists (
      select 1 from public.applications a
      join public.campaigns c on c.id = a.campaign_id
      where a.creator_id = creator_profiles.user_id and c.brand_id = auth.uid()
    )
  );
create policy "Creators can update their own details" on public.creator_profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Published campaigns are discoverable" on public.campaigns
  for select to authenticated using (status = 'published' or brand_id = auth.uid() or public.is_admin());
create policy "Brands create their own campaigns" on public.campaigns
  for insert to authenticated with check (
    brand_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'brand')
  );
create policy "Brands update their own campaigns" on public.campaigns
  for update to authenticated using (brand_id = auth.uid() or public.is_admin()) with check (brand_id = auth.uid() or public.is_admin());

create policy "Application participants can read applications" on public.applications
  for select to authenticated using (
    creator_id = auth.uid() or public.is_admin() or exists (
      select 1 from public.campaigns c where c.id = applications.campaign_id and c.brand_id = auth.uid()
    )
  );
create policy "Creators apply to published campaigns" on public.applications
  for insert to authenticated with check (
    creator_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'creator')
    and exists (select 1 from public.campaigns where id = campaign_id and status = 'published')
  );

create policy "Recipients read notifications" on public.notifications
  for select to authenticated using (recipient_id = auth.uid() or public.is_admin());
create policy "Recipients mark notifications read" on public.notifications
  for update to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
revoke update on public.applications from authenticated;
revoke insert on public.notifications from authenticated;
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;
grant execute on function public.decide_application(uuid, public.application_status) to authenticated;

-- Assign an admin only from a trusted SQL session after that person signs up:
-- update public.profiles set role = 'admin' where id = '<auth-user-uuid>';
