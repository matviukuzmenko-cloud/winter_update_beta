create table if not exists public.public_visitor_days (
  visitor_hash text not null check (visitor_hash ~ '^[0-9a-f]{64}$'),
  visit_date date not null,
  last_seen_at timestamptz not null default now(),
  primary key (visitor_hash, visit_date)
);

create index if not exists public_visitor_days_last_seen_at_idx
  on public.public_visitor_days (last_seen_at);

alter table public.public_visitor_days enable row level security;
revoke all on public.public_visitor_days from public, anon, authenticated;
grant all on public.public_visitor_days to service_role;

create or replace function public.record_public_visitor(p_visitor_hash text)
returns table (yesterday bigint, online bigint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  utc_today date := (now() at time zone 'UTC')::date;
  request_time timestamptz := now();
begin
  if p_visitor_hash is null or p_visitor_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid visitor hash';
  end if;

  insert into public.public_visitor_days (visitor_hash, visit_date, last_seen_at)
  values (p_visitor_hash, utc_today, request_time)
  on conflict (visitor_hash, visit_date)
  do update set last_seen_at = excluded.last_seen_at;

  return query
    select
      count(*) filter (where visit_date = utc_today - 1),
      count(distinct visitor_hash) filter (where last_seen_at >= request_time - interval '2 minutes')
    from public.public_visitor_days
    where visit_date >= utc_today - 1
       or last_seen_at >= request_time - interval '2 minutes';
end;
$$;

revoke all on function public.record_public_visitor(text) from public, anon, authenticated;
grant execute on function public.record_public_visitor(text) to service_role;
