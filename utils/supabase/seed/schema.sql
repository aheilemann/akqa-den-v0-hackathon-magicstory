-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS story_continuations CASCADE;
DROP TABLE IF EXISTS story_content CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS story_statuses CASCADE;
DROP TABLE IF EXISTS main_character CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_tiers CASCADE;
DROP TABLE IF EXISTS story_types CASCADE;
DROP TABLE IF EXISTS story_themes CASCADE;

-- Create tables
CREATE TABLE story_themes (
  story_theme_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_theme_name TEXT NOT NULL,
  story_theme_description TEXT,
  story_theme_user_provided BOOLEAN DEFAULT false,
  story_theme_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  story_theme_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE story_types (
  story_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_type_name TEXT NOT NULL,
  story_type_description TEXT,
  story_type_user_provided BOOLEAN DEFAULT false,
  story_type_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  story_type_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE subscription_tiers (
  subscription_tier_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_tier_name TEXT NOT NULL,
  subscription_tier_description TEXT,
  subscription_tier_price DECIMAL(10, 2) NOT NULL,
  subscription_tier_features JSONB,
  subscription_tier_story_limit INTEGER,
  subscription_tier_continuation_limit INTEGER,
  subscription_tier_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE user_subscriptions (
  user_subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_subscription_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_subscription_tier_id UUID NOT NULL REFERENCES subscription_tiers(subscription_tier_id),
  user_subscription_status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  user_subscription_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_subscription_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE main_character (
  main_character_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_character_name TEXT NOT NULL,
  main_character_description TEXT,
  main_character_user_provided BOOLEAN DEFAULT false,
  main_character_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  main_character_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE story_statuses (
  story_status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_status_name TEXT NOT NULL,
  story_status_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  story_status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE stories (
  story_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_title TEXT NOT NULL,
  story_theme_id UUID REFERENCES story_themes(story_theme_id),
  story_custom_theme TEXT,
  story_story_type_id UUID REFERENCES story_types(story_type_id),
  story_custom_story_type TEXT,
  story_main_character_id UUID REFERENCES main_character(main_character_id),
  story_inspiration TEXT,
  story_inspiration_image_url TEXT,
  story_status UUID REFERENCES story_statuses(story_status_id),
  story_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  story_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE story_content (
  story_content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_content_story_id UUID NOT NULL REFERENCES stories(story_id) ON DELETE CASCADE,
  story_content JSONB NOT NULL,
  story_content_version INTEGER NOT NULL DEFAULT 1,
  story_content_is_current BOOLEAN DEFAULT true,
  story_content_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  story_content_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE story_continuations (
  story_continuation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_continuation_story_id UUID NOT NULL REFERENCES stories(story_id) ON DELETE CASCADE,
  story_continuation_type TEXT NOT NULL,
  story_continuation_custom_prompt TEXT,
  story_continuation_content JSONB NOT NULL,
  story_continuation_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  story_continuation_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_story_id UUID NOT NULL REFERENCES stories(story_id),
  order_product_type TEXT NOT NULL,
  order_status TEXT NOT NULL,
  order_shipping_address JSONB,
  order_payment_intent_id TEXT,
  order_amount DECIMAL(10, 2) NOT NULL,
  order_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
); 