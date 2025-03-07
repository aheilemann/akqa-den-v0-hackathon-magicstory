import { config } from "dotenv";
config({ path: ".env.local" });
// This script would be used to seed your Supabase database
import { createClient } from "@/utils/supabase/seed/seed-client";

async function clearData() {
  const supabase = createClient();

  // Use a single TRUNCATE CASCADE statement to clear all tables
  const { error } = await supabase.rpc("truncate_tables", {
    table_names: [
      "story_themes",
      "story_types",
      "subscription_tiers",
      "story_statuses",
      "main_character",
      "user_subscriptions",
      "stories",
      "story_content",
      "story_continuations",
      "orders",
    ],
  });

  if (error) {
    console.error("Error clearing tables:", error);
    // If the RPC doesn't exist, create it
    const { error: createRpcError } = await supabase.rpc(
      "create_truncate_function",
      {
        sql: `
        CREATE OR REPLACE FUNCTION truncate_tables(table_names text[])
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          table_name text;
        BEGIN
          FOREACH table_name IN ARRAY table_names
          LOOP
            EXECUTE format('TRUNCATE TABLE %I CASCADE', table_name);
          END LOOP;
        END;
        $$;
      `,
      }
    );

    if (createRpcError) {
      console.error("Error creating truncate function:", createRpcError);
      return;
    }

    // Try truncating again after creating the function
    const { error: retryError } = await supabase.rpc("truncate_tables", {
      table_names: [
        "story_themes",
        "story_types",
        "subscription_tiers",
        "story_statuses",
        "main_character",
        "user_subscriptions",
        "stories",
        "story_content",
        "story_continuations",
        "orders",
      ],
    });

    if (retryError) {
      console.error("Error clearing tables after retry:", retryError);
      return;
    }
  }
}

async function seedDatabase() {
  const supabase = createClient();

  // 1. Seed Story Themes
  const storyThemes = [
    {
      story_theme_name: "Fantasy",
      story_theme_description: "Dragons, magic, and enchanted forests",
      story_theme_user_provided: false,
    },
    {
      story_theme_name: "Space Adventure",
      story_theme_description: "Planets, stars, and cosmic journeys",
      story_theme_user_provided: false,
    },
    {
      story_theme_name: "Underwater World",
      story_theme_description:
        "Ocean depths, sea creatures, and sunken treasures",
      story_theme_user_provided: false,
    },
    {
      story_theme_name: "Jungle Safari",
      story_theme_description:
        "Wild animals, dense forests, and exciting adventures",
      story_theme_user_provided: false,
    },
    {
      story_theme_name: "Fairy Tale",
      story_theme_description: "Princesses, castles, and magical creatures",
      story_theme_user_provided: false,
    },
  ];

  const { error: themesError } = await supabase
    .from("story_themes")
    .insert(storyThemes);

  if (themesError) {
    console.error("Error seeding story themes:", themesError);
    return;
  }

  // 2. Seed Story Types
  const storyTypes = [
    {
      story_type_name: "Adventure",
      story_type_description:
        "An exciting journey full of challenges and discoveries",
      story_type_user_provided: false,
    },
    {
      story_type_name: "Mystery",
      story_type_description: "A puzzling situation that needs to be solved",
      story_type_user_provided: false,
    },
    {
      story_type_name: "Friendship",
      story_type_description:
        "A story about making friends and working together",
      story_type_user_provided: false,
    },
    {
      story_type_name: "Learning & Growth",
      story_type_description:
        "Overcoming obstacles and learning important lessons",
      story_type_user_provided: false,
    },
    {
      story_type_name: "Bedtime Story",
      story_type_description:
        "A gentle, calming story perfect for bedtime reading",
      story_type_user_provided: false,
    },
  ];

  const { error: storyTypesError } = await supabase
    .from("story_types")
    .insert(storyTypes);

  if (storyTypesError) {
    console.error("Error seeding story types:", storyTypesError);
    return;
  }

  // 3. Seed Subscription Tiers
  const subscriptionTiers = [
    {
      subscription_tier_name: "Free",
      subscription_tier_description:
        "Begin your storytelling journey with magical tales that come to life",
      subscription_tier_price: 0.0,
      subscription_tier_features: [
        { feature: "Create unlimited stories" },
        { feature: "Continue stories up to 3 times" },
        { feature: "Read stories online" },
        { feature: "Download as PDF" },
        { feature: "Order physical books (additional cost)" },
      ],
      subscription_tier_story_limit: null,
      subscription_tier_continuation_limit: 3,
    },
    {
      subscription_tier_name: "Plus",
      subscription_tier_description:
        "Unlock deeper storytelling with extended creative possibilities",
      subscription_tier_price: 9.99,
      subscription_tier_features: [
        { feature: "Create unlimited stories" },
        { feature: "Continue stories up to 10 times" },
        { feature: "Read stories online" },
        { feature: "Download as PDF" },
        { feature: "Order physical books (additional cost)" },
      ],
      subscription_tier_story_limit: null,
      subscription_tier_continuation_limit: 10,
    },
    {
      subscription_tier_name: "Premium",
      subscription_tier_description:
        "Experience boundless creativity with unlimited story adventures",
      subscription_tier_price: 19.99,
      subscription_tier_features: [
        { feature: "Create unlimited stories" },
        { feature: "Unlimited story continuations" },
        { feature: "Read stories online" },
        { feature: "Download as PDF" },
        { feature: "Order physical books (additional cost)" },
      ],
      subscription_tier_story_limit: null,
      subscription_tier_continuation_limit: null,
    },
  ];

  const { error: tiersError } = await supabase
    .from("subscription_tiers")
    .insert(subscriptionTiers);

  if (tiersError) {
    console.error("Error seeding subscription tiers:", tiersError);
    return;
  }

  // 4. Seed Story Statuses
  const storyStatuses = [
    { story_status_name: "draft" },
    { story_status_name: "published" },
    { story_status_name: "archived" },
  ];

  const { error: statusesError } = await supabase
    .from("story_statuses")
    .insert(storyStatuses);

  if (statusesError) {
    console.error("Error seeding story statuses:", statusesError);
    return;
  }
}

// Run the seeding
async function main() {
  try {
    await clearData();
    await seedDatabase();
  } catch (error) {
    console.error("Error in database seeding:", error);
  }
}

main();
