import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string;
          current_streak: number;
          longest_streak: number;
          total_xp: number;
          level: number;
          last_active_date: string | null;
          theme: string;
          daily_goal: number;
          created_at: string;
          updated_at: string;
        };
      };
      question_progress: {
        Row: {
          id: string;
          user_id: string;
          question_id: number;
          solved: boolean;
          starred: boolean;
          marked_for_revision: boolean;
          notes: string;
          time_taken_minutes: number | null;
          last_revised_at: string | null;
          solved_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      daily_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_date: string;
          questions_solved: number;
          xp_earned: number;
          created_at: string;
          updated_at: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
      };
    };
  };
};
