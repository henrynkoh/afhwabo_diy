-- Supabase migration for AFH Renovator Pro
-- Run this in your Supabase SQL editor to set up the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create renovation_plans table
CREATE TABLE IF NOT EXISTS renovation_plans (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_data JSONB NOT NULL,
  compliance_issues JSONB NOT NULL,
  tasks JSONB NOT NULL,
  summary JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_renovation_plans_user_id ON renovation_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_renovation_plans_updated_at ON renovation_plans(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE renovation_plans ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own plans
CREATE POLICY "Users can view their own plans"
  ON renovation_plans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own plans
CREATE POLICY "Users can insert their own plans"
  ON renovation_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own plans
CREATE POLICY "Users can update their own plans"
  ON renovation_plans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own plans
CREATE POLICY "Users can delete their own plans"
  ON renovation_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_renovation_plans_updated_at
  BEFORE UPDATE ON renovation_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

