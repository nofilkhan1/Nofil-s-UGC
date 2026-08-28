-- Keep optional creator form fields nullable so empty submissions never violate schema constraints.
alter table public.creator_profiles
  alter column gender drop not null,
  alter column age drop not null,
  alter column bio drop not null,
  alter column portfolio_url drop not null,
  alter column instagram_url drop not null,
  alter column tiktok_url drop not null,
  alter column instagram_handle drop not null,
  alter column tiktok_handle drop not null;
