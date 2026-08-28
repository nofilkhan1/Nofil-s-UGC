alter table public.creator_profiles
  add column instagram_handle text,
  add column tiktok_handle text;

alter table public.creator_profiles
  add constraint creator_profiles_instagram_handle_valid
    check (instagram_handle is null or instagram_handle ~ '^[A-Za-z0-9._]{1,30}$'),
  add constraint creator_profiles_tiktok_handle_valid
    check (tiktok_handle is null or tiktok_handle ~ '^[A-Za-z0-9._]{1,30}$');

alter table public.applications
  add column pitch text check (pitch is null or char_length(pitch) <= 300);
