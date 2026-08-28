do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.applications'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) = 'UNIQUE (campaign_id, creator_id)'
  ) then
    alter table public.applications add constraint applications_campaign_creator_unique unique (campaign_id, creator_id);
  end if;
end $$;
