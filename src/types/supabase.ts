/**
 * Supabase Database Type Definitions
 * Generated from database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          color: string;
          icon: string;
          is_custom: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          color: string;
          icon: string;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          color?: string;
          icon?: string;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          total_amount: number;
          month: number;
          year: number;
          status: 'draft' | 'active' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          total_amount: number;
          month: number;
          year: number;
          status?: 'draft' | 'active' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          total_amount?: number;
          month?: number;
          year?: number;
          status?: 'draft' | 'active' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
      };
      category_allocations: {
        Row: {
          id: string;
          budget_id: string;
          category_id: string;
          allocated_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          budget_id: string;
          category_id: string;
          allocated_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          budget_id?: string;
          category_id?: string;
          allocated_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          budget_id: string | null;
          category_id: string;
          type: 'income' | 'expense';
          amount: number;
          date: string;
          payment_method: string | null;
          description: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          budget_id?: string | null;
          category_id: string;
          type: 'income' | 'expense';
          amount: number;
          date: string;
          payment_method?: string | null;
          description?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          budget_id?: string | null;
          category_id?: string;
          type?: 'income' | 'expense';
          amount?: number;
          date?: string;
          payment_method?: string | null;
          description?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          currency: string;
          locale: string;
          theme: 'light' | 'dark' | 'system';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          currency?: string;
          locale?: string;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          currency?: string;
          locale?: string;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
