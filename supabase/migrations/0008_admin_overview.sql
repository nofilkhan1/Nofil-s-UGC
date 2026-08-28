create or replace function public.admin_overview()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return jsonb_build_object(
    'brands', coalesce((select jsonb_agg(to_jsonb(row) order by row.company_name) from (
      select p.id, p.display_name as company_name, u.email, count(c.id)::int as campaign_count
      from public.profiles p join auth.users u on u.id = p.id
      left join public.campaigns c on c.brand_id = p.id
      where p.role = 'brand' group by p.id, p.display_name, u.email
    ) row), '[]'::jsonb),
    'creators', coalesce((select jsonb_agg(to_jsonb(row) order by row.public_name) from (
      select p.id, p.display_name as public_name, u.email, count(a.id)::int as application_count
      from public.profiles p join auth.users u on u.id = p.id
      left join public.applications a on a.creator_id = p.id
      where p.role = 'creator' group by p.id, p.display_name, u.email
    ) row), '[]'::jsonb),
    'campaigns', coalesce((select jsonb_agg(to_jsonb(row) order by row.title) from (
      select c.id, c.title, bp.display_name as brand_name, c.status, count(a.id)::int as application_count
      from public.campaigns c join public.profiles bp on bp.id = c.brand_id
      left join public.applications a on a.campaign_id = c.id
      group by c.id, c.title, bp.display_name, c.status
    ) row), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.admin_overview() from public;
grant execute on function public.admin_overview() to authenticated;
