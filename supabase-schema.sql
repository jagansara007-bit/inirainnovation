-- Inira Innovations Waitlist Table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

CREATE TABLE IF NOT EXISTS waitlist (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_sent BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow insert policy (works with both anon and service role key)
CREATE POLICY "Allow insert into waitlist" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Allow reading waitlist
CREATE POLICY "Allow read waitlist" ON waitlist
  FOR SELECT
  USING (true);

