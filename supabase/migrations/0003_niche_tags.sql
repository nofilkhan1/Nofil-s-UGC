alter table public.campaigns add column niches text[] not null default array['Other']::text[];
alter table public.creator_profiles add column niches text[] not null default array['Other']::text[];
alter table public.campaigns add constraint campaigns_niches_valid check (cardinality(niches) between 1 and 3 and niches <@ array['Health & Fitness','Beauty & Fashion','Food & Drink','Tech & Gadgets','Travel','Home & Family','Finance','Education','Entertainment','Gaming','Other']::text[]);
alter table public.creator_profiles add constraint creator_niches_valid check (cardinality(niches) between 1 and 5 and niches <@ array['Health & Fitness','Beauty & Fashion','Food & Drink','Tech & Gadgets','Travel','Home & Family','Finance','Education','Entertainment','Gaming','Other']::text[]);
create index campaigns_niches_idx on public.campaigns using gin (niches);
create index creator_profiles_niches_idx on public.creator_profiles using gin (niches);
