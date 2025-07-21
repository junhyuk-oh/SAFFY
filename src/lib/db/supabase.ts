import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Json type for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          content: Json;
          file_path: string | null;
          status: 'draft' | 'review' | 'completed' | 'overdue';
          document_type: 'daily_checklist' | 'experiment_log' | 'safety_inspection' | 'risk_assessment' | 'education_log' | 'chemical_usage_report' | 'weekly_checklist' | 'quarterly_report' | 'annual_safety_plan' | 'jha' | 'safety_meeting' | 'incident_report' | 'audit_report' | 'policy' | 'procedure' | 'general';
          department: string | null;
          metadata: Json;
          tags: string[];
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to: string | null;
          due_date: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          version: number;
          parent_document_id: string | null;
          is_template: boolean;
          approval_status: 'pending' | 'approved' | 'rejected' | 'revision_required';
          approval_history: Json[];
          file_size: number | null;
          file_type: string | null;
          search_vector: unknown | null;
          comments: Json[];
          feedback_score: number | null;
          feedback_comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at' | 'search_vector'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      document_templates: {
        Row: {
          id: string;
          name: string;
          type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
          category: string;
          template_data: Json;
          required_fields: Json;
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
          changes: Json;
          changed_by: string;
          changed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['document_history']['Row'], 'id' | 'changed_at'>;
        Update: Partial<Database['public']['Tables']['document_history']['Insert']>;
      };
      education_categories: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          is_mandatory: boolean;
          required_hours: number;
          validity_months: number | null;
          parent_id: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['education_categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['education_categories']['Insert']>;
      };
      target_rules: {
        Row: {
          id: string;
          category_id: string;
          rule_type: string;
          rule_value: Json;
          priority: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['target_rules']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['target_rules']['Insert']>;
      };
      user_education_requirements: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          required_date: string;
          due_date: string;
          status: 'pending' | 'in_progress' | 'completed' | 'overdue';
          completion_date: string | null;
          exemption_reason: string | null;
          is_exempted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_education_requirements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_education_requirements']['Insert']>;
      };
      education_records: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          requirement_id: string | null;
          education_date: string;
          education_hours: number;
          provider: string | null;
          certificate_number: string | null;
          certificate_url: string | null;
          certificate_file_path: string | null;
          expiry_date: string | null;
          verification_status: 'pending' | 'verified' | 'rejected';
          verification_date: string | null;
          verified_by: string | null;
          rejection_reason: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['education_records']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['education_records']['Insert']>;
      };
      daily_education_logs: {
        Row: {
          id: string;
          user_id: string;
          education_date: string;
          education_type: 'tbm' | 'safety_moment' | 'special';
          topic: string;
          duration_minutes: number;
          instructor_id: string | null;
          location: string | null;
          attendance_status: 'present' | 'absent' | 'excused';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_education_logs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['daily_education_logs']['Insert']>;
      };
    };
    Views: {
      document_stats_by_department: {
        Row: {
          department: string | null;
          document_type: string;
          status: string;
          document_count: number;
          avg_completion_days: number | null;
        };
      };
      monthly_document_stats: {
        Row: {
          month: string;
          document_type: string;
          department: string | null;
          created_count: number;
          completed_count: number;
          completion_rate: number;
        };
      };
    };
    Functions: {
      search_documents: {
        Args: {
          search_query: string;
          doc_type?: string;
          dept?: string;
          status_filter?: string;
        };
        Returns: {
          id: string;
          title: string;
          document_type: string;
          department: string | null;
          status: string;
          created_at: string;
          rank: number;
        }[];
      };
      get_due_documents: {
        Args: {
          days_ahead?: number;
        };
        Returns: {
          id: string;
          title: string;
          document_type: string;
          department: string | null;
          assigned_to: string | null;
          due_date: string;
          days_remaining: number;
        }[];
      };
      add_approval_history: {
        Args: {
          doc_id: string;
          action: string;
          approver_id: string;
          comment?: string;
        };
        Returns: void;
      };
      create_document_version: {
        Args: {
          original_doc_id: string;
          new_content: Json;
          editor_id: string;
        };
        Returns: string;
      };
      check_overdue_requirements: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
}

// 타입 도우미들
export type DocumentRow = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

export type EducationCategoryRow = Database['public']['Tables']['education_categories']['Row'];
export type EducationCategoryInsert = Database['public']['Tables']['education_categories']['Insert'];
export type EducationCategoryUpdate = Database['public']['Tables']['education_categories']['Update'];

export type EducationRecordRow = Database['public']['Tables']['education_records']['Row'];
export type EducationRecordInsert = Database['public']['Tables']['education_records']['Insert'];
export type EducationRecordUpdate = Database['public']['Tables']['education_records']['Update'];

export type DailyEducationLogRow = Database['public']['Tables']['daily_education_logs']['Row'];
export type DailyEducationLogInsert = Database['public']['Tables']['daily_education_logs']['Insert'];
export type DailyEducationLogUpdate = Database['public']['Tables']['daily_education_logs']['Update'];

// 검색 결과 타입
export type SearchResult = Database['public']['Functions']['search_documents']['Returns'][0];
export type DueDocumentResult = Database['public']['Functions']['get_due_documents']['Returns'][0];

// 문서 타입 열거형
export const DOCUMENT_TYPES = {
  DAILY_CHECKLIST: 'daily_checklist',
  EXPERIMENT_LOG: 'experiment_log',
  SAFETY_INSPECTION: 'safety_inspection',
  RISK_ASSESSMENT: 'risk_assessment',
  EDUCATION_LOG: 'education_log',
  CHEMICAL_USAGE_REPORT: 'chemical_usage_report',
  WEEKLY_CHECKLIST: 'weekly_checklist',
  QUARTERLY_REPORT: 'quarterly_report',
  ANNUAL_SAFETY_PLAN: 'annual_safety_plan',
  JHA: 'jha',
  SAFETY_MEETING: 'safety_meeting',
  INCIDENT_REPORT: 'incident_report',
  AUDIT_REPORT: 'audit_report',
  POLICY: 'policy',
  PROCEDURE: 'procedure',
  GENERAL: 'general',
} as const;

// 우선순위 열거형
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// 승인 상태 열거형
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUIRED: 'revision_required',
} as const;