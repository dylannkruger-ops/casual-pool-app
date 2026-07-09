# Lucen AI — Database Schema

Target: **Postgres + Supabase** (recommended). Drop-in compatible with Prisma.

All tables include `id uuid primary key default gen_random_uuid()`, `created_at timestamptz not null default now()`, and `updated_at timestamptz not null default now()`. RLS is enabled on every table.

---

## `users`
Auth-backed account. Linked to `auth.users` via `id` (Supabase pattern).
| column | type | notes |
|---|---|---|
| id | uuid PK | matches `auth.users.id` |
| email | text unique not null | |
| role | text not null check (role in ('worker','business','admin')) | |
| onboarded | boolean not null default false | |
| last_active_at | timestamptz | |

## `worker_profiles`
| column | type | notes |
|---|---|---|
| user_id | uuid FK → users.id, unique | |
| full_name | text not null | |
| photo_url | text | |
| professions | text[] not null default '{}' | enum-validated app-side |
| hourly_rate | numeric(8,2) not null | AUD |
| suburb | text | |
| postcode | text | |
| state | text | |
| coordinates | geography(Point, 4326) | PostGIS |
| work_radius_km | int not null default 15 | |
| licences | text[] not null default '{}' | |
| qualifications | text[] not null default '{}' | |
| availability | jsonb not null default '{}' | day flags + preferred hours |
| bio | text | |
| experience_years | int | |
| rating | numeric(3,2) not null default 0 | denormalized |
| reviews_count | int not null default 0 | |
| shifts_completed | int not null default 0 | |
| repeat_employers | int not null default 0 | |
| verified | boolean not null default false | |

## `business_profiles`
| column | type | notes |
|---|---|---|
| user_id | uuid FK → users.id, unique | |
| company_name | text not null | |
| abn | text not null | 11 digits, validated |
| abn_verified | boolean not null default false | |
| abn_verified_at | timestamptz | |
| contact_person | text | |
| industry | text | |
| suburb | text | |
| postcode | text | |
| state | text | |
| coordinates | geography(Point, 4326) | |
| logo_url | text | |
| payment_setup | boolean not null default false | |
| stripe_customer_id | text | |
| rating | numeric(3,2) not null default 0 | |
| reviews_count | int not null default 0 | |

## `documents`
| column | type | notes |
|---|---|---|
| owner_id | uuid FK → users.id | |
| type | text not null | rsa, forklift, white_card, food_safety, driver_licence, police_check, work_right, other |
| label | text | |
| file_url | text | Supabase Storage path |
| expires_on | date | |
| verified | boolean not null default false | |
| verified_by | uuid FK → users.id (admin) | |

## `shifts`
| column | type | notes |
|---|---|---|
| business_id | uuid FK → business_profiles.user_id | |
| title | text not null | |
| profession | text not null | |
| description | text | |
| suburb / postcode / state | text | |
| coordinates | geography(Point, 4326) | |
| starts_at | timestamptz not null | |
| ends_at | timestamptz not null | |
| hourly_rate | numeric(8,2) not null | |
| hours_estimate | numeric(5,2) not null | |
| required_licences | text[] not null default '{}' | |
| required_qualifications | text[] not null default '{}' | |
| status | text not null default 'open' | open, shortlisting, hired, in_progress, completed, cancelled |
| hired_worker_id | uuid FK → worker_profiles.user_id | |
| platform_fee_business | numeric(8,2) not null default 4.99 | |
| platform_fee_worker | numeric(8,2) not null default 4.99 | |

## `applications`
| column | type | notes |
|---|---|---|
| shift_id | uuid FK → shifts.id | |
| worker_id | uuid FK → worker_profiles.user_id | |
| message | text | |
| status | text not null default 'applied' | applied, shortlisted, hired, declined, withdrawn |
| (shift_id, worker_id) | unique | |

## `threads`
| column | type | notes |
|---|---|---|
| worker_id | uuid FK → worker_profiles.user_id | |
| business_id | uuid FK → business_profiles.user_id | |
| shift_id | uuid FK → shifts.id, nullable | |
| last_message_preview | text | |
| last_message_at | timestamptz | |
| (worker_id, business_id, shift_id) | unique | |

## `messages`
| column | type | notes |
|---|---|---|
| thread_id | uuid FK → threads.id | |
| sender_id | uuid FK → users.id | |
| body | text not null | |
| read_at | timestamptz | |

## `reviews`
| column | type | notes |
|---|---|---|
| from_id | uuid FK → users.id | |
| to_id | uuid FK → users.id | |
| shift_id | uuid FK → shifts.id | |
| rating | int not null check (rating between 1 and 5) | |
| body | text | |

## `saved_workers`
| column | type | notes |
|---|---|---|
| business_id | uuid FK | |
| worker_id | uuid FK | |
| (business_id, worker_id) | unique | |

## `notifications`
| column | type | notes |
|---|---|---|
| user_id | uuid FK | |
| type | text | shift_application, shortlisted, hired, message, review, shift_reminder, payment, system |
| title | text | |
| body | text | |
| link | text | |
| read_at | timestamptz | |

## `payments`
| column | type | notes |
|---|---|---|
| user_id | uuid FK | who paid |
| shift_id | uuid FK | |
| kind | text | 'business_hire_fee' or 'worker_accept_fee' |
| amount | numeric(8,2) not null | 4.99 |
| currency | text not null default 'AUD' | |
| stripe_payment_intent_id | text | |
| status | text | succeeded, pending, refunded |

---

## Key indexes
- `shifts (status, starts_at)` for marketplace queries
- GiST index on `shifts.coordinates` and `worker_profiles.coordinates` for proximity search
- `applications (shift_id, status)` for shortlisting flows
- `messages (thread_id, created_at desc)` for chat pagination

## Row-Level Security (high level)
- Workers can read open `shifts` and write to `applications` only for themselves.
- Businesses can read `worker_profiles` (public fields) only if `abn_verified = true`.
- Both sides can read/write `messages` only on `threads` they belong to.
- All writes to `shifts` require `business_profiles.abn_verified = true`.
- Admins (role='admin') can read everything for moderation.

## Server-enforced rules
- `shifts` insert/update → trigger checks `business.abn_verified` and `business.payment_setup`.
- Hiring a worker → server inserts a `payments` row of kind `business_hire_fee`.
- Worker accepting hire → server inserts a `payments` row of kind `worker_accept_fee`.
