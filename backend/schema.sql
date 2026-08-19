-- ============================================================
-- Campus Voice College Complaint Management Portal
-- Complete Database Schema with Seeds
-- PostgreSQL
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  student_roll  TEXT,
  department    TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Categories ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Caretakers ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS caretakers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  phone          TEXT,
  email          TEXT,
  specialization TEXT,
  department     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Complaints ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  caretaker_id     UUID REFERENCES caretakers(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  location         TEXT,
  urgency          TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  status           TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'rejected')),
  rating           INT CHECK (rating BETWEEN 1 AND 5),
  feedback_comment TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Complaint Events (Timeline) ────────────────────────────
CREATE TABLE IF NOT EXISTS complaint_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status       TEXT NOT NULL,
  note         TEXT,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Notices ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  priority   TEXT NOT NULL DEFAULT 'General' CHECK (priority IN ('Urgent', 'Important', 'General', 'Info')),
  posted_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Events ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  type        TEXT NOT NULL DEFAULT 'General' CHECK (type IN ('Academic', 'Cultural', 'Sports', 'Technical', 'General')),
  venue       TEXT,
  event_date  TIMESTAMPTZ NOT NULL,
  organizer   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Maintenance Requests ───────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caretaker_id UUID REFERENCES caretakers(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'Other' CHECK (category IN ('AC', 'Furniture', 'Plumbing', 'Electrical', 'Equipment', 'Other')),
  location     TEXT NOT NULL,
  description  TEXT,
  priority     TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Urgent')),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Lost & Found Items ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS lost_found_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  type        TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  location    TEXT,
  contact     TEXT,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Notifications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'info',
  complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_complaints_user_id     ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status      ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category    ON complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaint_events_comp  ON complaint_events(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user     ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_user       ON maintenance_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status     ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_lost_found_type        ON lost_found_items(type);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed: Categories
INSERT INTO categories (name, description) VALUES
  ('Infrastructure',    'Buildings, roads, classrooms, doors, windows'),
  ('Electrical',        'Lights, fans, sockets, electrical failures'),
  ('Plumbing',          'Water supply, drainage, taps, leaks'),
  ('Internet & IT',     'Wi-Fi, computer labs, network issues'),
  ('Cleanliness',       'Campus hygiene, waste disposal, restroom cleanliness'),
  ('Canteen & Food',    'Food quality, hygiene, canteen operations'),
  ('Library',           'Books, library resources, timings'),
  ('Sports Facilities', 'Sports equipment, gym, grounds'),
  ('Academic',          'Curriculum, faculty, exam scheduling'),
  ('Hostel',            'Hostel facilities, rooms, mess'),
  ('Safety & Security', 'Campus security, CCTV, emergency response'),
  ('Other',             'General complaints not fitting any other category')
ON CONFLICT (name) DO NOTHING;

-- Seed: Caretakers
INSERT INTO caretakers (name, phone, email, specialization, department) VALUES
  ('Robert Vance',    '+91 98765 43210', 'robert.vance@tmsl.edu.in',   'AC / HVAC',         'Facilities'),
  ('Sarah Connor',    '+91 98765 43211', 'sarah.connor@tmsl.edu.in',   'Electrical',        'Facilities'),
  ('David Wallace',   '+91 98765 43212', 'david.wallace@tmsl.edu.in',  'Plumbing',          'Facilities'),
  ('Michael Scott',   '+91 98765 43213', 'michael.scott@tmsl.edu.in',  'General Maintenance','Admin'),
  ('Jim Halpert',     '+91 98765 43214', 'jim.halpert@tmsl.edu.in',    'IT / Network',      'IT Dept'),
  ('Dwight Schrute',  '+91 98765 43215', 'dwight.schrute@tmsl.edu.in', 'Security / Safety', 'Security')
ON CONFLICT DO NOTHING;

-- Seed: Default Notices
INSERT INTO notices (title, body, priority) VALUES
  (
    'Welcome to Campus Voice Management Portal',
    'All students are encouraged to report campus issues through this portal. Your complaints will be reviewed and resolved by the relevant department within the stipulated time.',
    'Info'
  ),
  (
    'Mid-Semester Examination Dates Announced',
    'Mid-semester examinations for all UG programmes (B.Tech 2nd & 3rd Year) will be held from 10th September 2026. Detailed seating plans will be published shortly.',
    'Urgent'
  ),
  (
    'Central Library Extended Hours — Exam Season',
    'The central library will remain open until 11 PM on all weekdays from 1st September to 30th September 2026 in view of the upcoming examinations.',
    'Important'
  )
ON CONFLICT DO NOTHING;

-- Seed: Campus Events
INSERT INTO events (title, description, type, venue, event_date, organizer) VALUES
  (
    'Fresher''s Welcome Ceremony 2026',
    'A grand welcome ceremony for all newly admitted students of the 2026 batch. Cultural performances, faculty introductions, and goodies await!',
    'Cultural',
    'College Auditorium, Main Campus',
    NOW() + INTERVAL '5 days',
    'Student Affairs Committee'
  ),
  (
    'Annual Technical Fest — TechNova 2026',
    'India''s premier college technical festival featuring hackathons, robotics challenges, AI/ML competitions, and industry expert guest lectures.',
    'Technical',
    'Engineering Block, Open Air Arena',
    NOW() + INTERVAL '14 days',
    'Technical Society, TMSL'
  ),
  (
    'Inter-College Cricket Tournament',
    'Participate or cheer for your department team! 32 teams compete for the annual TMSL cricket trophy.',
    'Sports',
    'College Cricket Ground',
    NOW() + INTERVAL '7 days',
    'Sports Department'
  )
ON CONFLICT DO NOTHING;
