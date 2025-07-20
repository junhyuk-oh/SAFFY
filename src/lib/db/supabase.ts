import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          template_id: string | null;
          user_id: string;
          title: string;
          content: any;
          file_path: string | null;
          status: 'draft' | 'review' | 'completed' | 'overdue';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      document_templates: {
        Row: {
          id: string;
          name: string;
          type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
          category: string;
          template_data: any;
          required_fields: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['document_templates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['document_templates']['Insert']>;
      };
      document_history: {
        Row: {
          id: string;
          document_id: string;
          version: number;
          changes: any;
          changed_by: string;
          changed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['document_history']['Row'], 'id' | 'changed_at'>;
        Update: Partial<Database['public']['Tables']['document_history']['Insert']>;
      };
    };
  };
}