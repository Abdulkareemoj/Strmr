/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
CREATE TABLE users (
  -- UUID from auth.users
  id uuid REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
  name text,
  email text,
  email_verified timestamp with time zone,
  image text,
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
);

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user data." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own user data." ON users FOR UPDATE USING (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
CREATE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, image, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

/**
* This trigger automatically updates user info when a user updates their profile via Supabase Auth.
*/ 
CREATE FUNCTION public.update_public_user_info()
RETURNS trigger AS $$
BEGIN
  UPDATE public.users 
  SET email_verified = new.email_confirmed_at, updated_at = new.updated_at, name = new.raw_user_meta_data->>'full_name'
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_public_user_info();

/**
* PROFILES TABLE
*/
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  first_name text,
  last_name text,
  username text,
  email text UNIQUE,
  avatar_url text,
  bio text
);

/**
* VIDEOS TABLE
*/
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  video_id text NOT NULL,
  public boolean DEFAULT true NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  duration integer,
  user_id uuid, -- If you want to relate to users, add a foreign key
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL
);

/**
* SHORTS TABLE
*/
CREATE TABLE shorts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  short_id text NOT NULL,
  public boolean DEFAULT true NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  duration integer,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

/* 
* Enable RLS for videos
*/
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policy for public videos
CREATE POLICY "Public can view public videos." ON videos
FOR SELECT USING (public = true);

-- Policy for authenticated users to view all videos (public and private)
CREATE POLICY "Authenticated users can view all videos." ON videos
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policy for authenticated users to upload videos
CREATE POLICY "Authenticated users can insert videos." ON videos
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

/* 
* Enable RLS for shorts
*/
ALTER TABLE shorts ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view all shorts (public and private)
CREATE POLICY "Authenticated users can view all shorts." ON shorts
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policy for authenticated users to upload shorts
CREATE POLICY "Authenticated users can insert shorts." ON shorts
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);