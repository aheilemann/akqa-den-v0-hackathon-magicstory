export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SubscriptionTierFeature = {
  feature: string;
  comingSoon?: boolean;
};

export type Database = {
  public: {
    Tables: {
      main_character: {
        Row: {
          main_character_created_at: string | null;
          main_character_description: string | null;
          main_character_id: string;
          main_character_name: string;
          main_character_updated_at: string | null;
          main_character_user_provided: boolean | null;
        };
        Insert: {
          main_character_created_at?: string | null;
          main_character_description?: string | null;
          main_character_id?: string;
          main_character_name: string;
          main_character_updated_at?: string | null;
          main_character_user_provided?: boolean | null;
        };
        Update: {
          main_character_created_at?: string | null;
          main_character_description?: string | null;
          main_character_id?: string;
          main_character_name?: string;
          main_character_updated_at?: string | null;
          main_character_user_provided?: boolean | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          order_amount: number;
          order_created_at: string | null;
          order_id: string;
          order_payment_intent_id: string | null;
          order_product_type: string;
          order_shipping_address: Json | null;
          order_status: string;
          order_story_id: string;
          order_updated_at: string | null;
          order_user_id: string;
        };
        Insert: {
          order_amount: number;
          order_created_at?: string | null;
          order_id?: string;
          order_payment_intent_id?: string | null;
          order_product_type: string;
          order_shipping_address?: Json | null;
          order_status: string;
          order_story_id: string;
          order_updated_at?: string | null;
          order_user_id: string;
        };
        Update: {
          order_amount?: number;
          order_created_at?: string | null;
          order_id?: string;
          order_payment_intent_id?: string | null;
          order_product_type?: string;
          order_shipping_address?: Json | null;
          order_status?: string;
          order_story_id?: string;
          order_updated_at?: string | null;
          order_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_order_story_id_fkey";
            columns: ["order_story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["story_id"];
          },
        ];
      };
      stories: {
        Row: {
          story_created_at: string | null;
          story_custom_story_type: string | null;
          story_custom_theme: string | null;
          story_id: string;
          story_inspiration: string | null;
          story_inspiration_image_url: string | null;
          story_main_character_id: string | null;
          story_status: string | null;
          story_story_type_id: string | null;
          story_theme_id: string | null;
          story_title: string;
          story_updated_at: string | null;
          story_user_id: string;
        };
        Insert: {
          story_created_at?: string | null;
          story_custom_story_type?: string | null;
          story_custom_theme?: string | null;
          story_id?: string;
          story_inspiration?: string | null;
          story_inspiration_image_url?: string | null;
          story_main_character_id?: string | null;
          story_status?: string | null;
          story_story_type_id?: string | null;
          story_theme_id?: string | null;
          story_title: string;
          story_updated_at?: string | null;
          story_user_id: string;
        };
        Update: {
          story_created_at?: string | null;
          story_custom_story_type?: string | null;
          story_custom_theme?: string | null;
          story_id?: string;
          story_inspiration?: string | null;
          story_inspiration_image_url?: string | null;
          story_main_character_id?: string | null;
          story_status?: string | null;
          story_story_type_id?: string | null;
          story_theme_id?: string | null;
          story_title?: string;
          story_updated_at?: string | null;
          story_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stories_story_main_character_id_fkey";
            columns: ["story_main_character_id"];
            isOneToOne: false;
            referencedRelation: "main_character";
            referencedColumns: ["main_character_id"];
          },
          {
            foreignKeyName: "stories_story_status_fkey";
            columns: ["story_status"];
            isOneToOne: false;
            referencedRelation: "story_statuses";
            referencedColumns: ["story_status_id"];
          },
          {
            foreignKeyName: "stories_story_story_type_id_fkey";
            columns: ["story_story_type_id"];
            isOneToOne: false;
            referencedRelation: "story_types";
            referencedColumns: ["story_type_id"];
          },
          {
            foreignKeyName: "stories_story_theme_id_fkey";
            columns: ["story_theme_id"];
            isOneToOne: false;
            referencedRelation: "story_themes";
            referencedColumns: ["story_theme_id"];
          },
        ];
      };
      story_content: {
        Row: {
          story_content: Json;
          story_content_created_at: string | null;
          story_content_id: string;
          story_content_is_current: boolean | null;
          story_content_story_id: string;
          story_content_updated_at: string | null;
          story_content_version: number;
        };
        Insert: {
          story_content: Json;
          story_content_created_at?: string | null;
          story_content_id?: string;
          story_content_is_current?: boolean | null;
          story_content_story_id: string;
          story_content_updated_at?: string | null;
          story_content_version?: number;
        };
        Update: {
          story_content?: Json;
          story_content_created_at?: string | null;
          story_content_id?: string;
          story_content_is_current?: boolean | null;
          story_content_story_id?: string;
          story_content_updated_at?: string | null;
          story_content_version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "story_content_story_content_story_id_fkey";
            columns: ["story_content_story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["story_id"];
          },
        ];
      };
      story_continuations: {
        Row: {
          story_continuation_content: Json;
          story_continuation_created_at: string | null;
          story_continuation_custom_prompt: string | null;
          story_continuation_id: string;
          story_continuation_story_id: string;
          story_continuation_type: string;
          story_continuation_updated_at: string | null;
        };
        Insert: {
          story_continuation_content: Json;
          story_continuation_created_at?: string | null;
          story_continuation_custom_prompt?: string | null;
          story_continuation_id?: string;
          story_continuation_story_id: string;
          story_continuation_type: string;
          story_continuation_updated_at?: string | null;
        };
        Update: {
          story_continuation_content?: Json;
          story_continuation_created_at?: string | null;
          story_continuation_custom_prompt?: string | null;
          story_continuation_id?: string;
          story_continuation_story_id?: string;
          story_continuation_type?: string;
          story_continuation_updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "story_continuations_story_continuation_story_id_fkey";
            columns: ["story_continuation_story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["story_id"];
          },
        ];
      };
      story_statuses: {
        Row: {
          story_status_created_at: string | null;
          story_status_id: string;
          story_status_name: string;
          story_status_updated_at: string | null;
        };
        Insert: {
          story_status_created_at?: string | null;
          story_status_id?: string;
          story_status_name: string;
          story_status_updated_at?: string | null;
        };
        Update: {
          story_status_created_at?: string | null;
          story_status_id?: string;
          story_status_name?: string;
          story_status_updated_at?: string | null;
        };
        Relationships: [];
      };
      story_themes: {
        Row: {
          story_theme_created_at: string | null;
          story_theme_description: string | null;
          story_theme_id: string;
          story_theme_name: string;
          story_theme_updated_at: string | null;
          story_theme_user_provided: boolean | null;
        };
        Insert: {
          story_theme_created_at?: string | null;
          story_theme_description?: string | null;
          story_theme_id?: string;
          story_theme_name: string;
          story_theme_updated_at?: string | null;
          story_theme_user_provided?: boolean | null;
        };
        Update: {
          story_theme_created_at?: string | null;
          story_theme_description?: string | null;
          story_theme_id?: string;
          story_theme_name?: string;
          story_theme_updated_at?: string | null;
          story_theme_user_provided?: boolean | null;
        };
        Relationships: [];
      };
      story_types: {
        Row: {
          story_type_created_at: string | null;
          story_type_description: string | null;
          story_type_id: string;
          story_type_name: string;
          story_type_updated_at: string | null;
          story_type_user_provided: boolean | null;
        };
        Insert: {
          story_type_created_at?: string | null;
          story_type_description?: string | null;
          story_type_id?: string;
          story_type_name: string;
          story_type_updated_at?: string | null;
          story_type_user_provided?: boolean | null;
        };
        Update: {
          story_type_created_at?: string | null;
          story_type_description?: string | null;
          story_type_id?: string;
          story_type_name?: string;
          story_type_updated_at?: string | null;
          story_type_user_provided?: boolean | null;
        };
        Relationships: [];
      };
      storySegment: {
        Row: {
          created_at: string;
          id: number;
          segment: Json | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          segment?: Json | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          segment?: Json | null;
        };
        Relationships: [];
      };
      subscription_tiers: {
        Row: {
          subscription_tier_continuation_limit: number | null;
          subscription_tier_created_at: string | null;
          subscription_tier_description: string | null;
          subscription_tier_features: Json | null;
          subscription_tier_id: string;
          subscription_tier_name: string;
          subscription_tier_price: number;
          subscription_tier_story_limit: number | null;
          subscription_tier_updated_at: string | null;
        };
        Insert: {
          subscription_tier_continuation_limit?: number | null;
          subscription_tier_created_at?: string | null;
          subscription_tier_description?: string | null;
          subscription_tier_features?: Json | null;
          subscription_tier_id?: string;
          subscription_tier_name: string;
          subscription_tier_price: number;
          subscription_tier_story_limit?: number | null;
          subscription_tier_updated_at?: string | null;
        };
        Update: {
          subscription_tier_continuation_limit?: number | null;
          subscription_tier_created_at?: string | null;
          subscription_tier_description?: string | null;
          subscription_tier_features?: Json | null;
          subscription_tier_id?: string;
          subscription_tier_name?: string;
          subscription_tier_price?: number;
          subscription_tier_story_limit?: number | null;
          subscription_tier_updated_at?: string | null;
        };
        Relationships: [];
      };
      user_subscriptions: {
        Row: {
          current_period_end: string | null;
          current_period_start: string | null;
          user_subscription_created_at: string | null;
          user_subscription_id: string;
          user_subscription_status: string;
          user_subscription_tier_id: string;
          user_subscription_updated_at: string | null;
          user_subscription_user_id: string;
        };
        Insert: {
          current_period_end?: string | null;
          current_period_start?: string | null;
          user_subscription_created_at?: string | null;
          user_subscription_id?: string;
          user_subscription_status: string;
          user_subscription_tier_id: string;
          user_subscription_updated_at?: string | null;
          user_subscription_user_id: string;
        };
        Update: {
          current_period_end?: string | null;
          current_period_start?: string | null;
          user_subscription_created_at?: string | null;
          user_subscription_id?: string;
          user_subscription_status?: string;
          user_subscription_tier_id?: string;
          user_subscription_updated_at?: string | null;
          user_subscription_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_subscription_tier_id_fkey";
            columns: ["user_subscription_tier_id"];
            isOneToOne: false;
            referencedRelation: "subscription_tiers";
            referencedColumns: ["subscription_tier_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_table_if_not_exists: {
        Args: {
          table_name: string;
          definition: string;
        };
        Returns: undefined;
      };
      create_truncate_function: {
        Args: {
          sql: string;
        };
        Returns: undefined;
      };
      drop_table_if_exists: {
        Args: {
          table_name: string;
        };
        Returns: undefined;
      };
      truncate_tables: {
        Args: {
          table_names: string[];
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"]) : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"] : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"] : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"] : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database } ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName] : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] ? PublicSchema["Enums"][PublicEnumNameOrOptions] : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
