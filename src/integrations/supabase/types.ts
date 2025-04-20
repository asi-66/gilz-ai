export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      job_descriptions: {
        Row: {
          created_at: string | null
          department: string | null
          description: string
          education_requirements: string | null
          id: string
          is_active: boolean | null
          location: string | null
          minimum_experience: string | null
          preferred_skills: Json
          required_skills: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          description: string
          education_requirements?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          minimum_experience?: string | null
          preferred_skills?: Json
          required_skills?: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          description?: string
          education_requirements?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          minimum_experience?: string | null
          preferred_skills?: Json
          required_skills?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      parsed_resumes: {
        Row: {
          certifications: Json
          education: Json
          email: string | null
          full_name: string | null
          id: string
          job_id: string | null
          last_updated: string | null
          location: string | null
          parsed_at: string | null
          phone: string | null
          processing_status: string
          skills: Json
          storage_path: string | null
          work_experience: Json
        }
        Insert: {
          certifications?: Json
          education?: Json
          email?: string | null
          full_name?: string | null
          id?: string
          job_id?: string | null
          last_updated?: string | null
          location?: string | null
          parsed_at?: string | null
          phone?: string | null
          processing_status: string
          skills?: Json
          storage_path?: string | null
          work_experience?: Json
        }
        Update: {
          certifications?: Json
          education?: Json
          email?: string | null
          full_name?: string | null
          id?: string
          job_id?: string | null
          last_updated?: string | null
          location?: string | null
          parsed_at?: string | null
          phone?: string | null
          processing_status?: string
          skills?: Json
          storage_path?: string | null
          work_experience?: Json
        }
        Relationships: [
          {
            foreignKeyName: "parsed_resumes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_scores: {
        Row: {
          additional_notes: string | null
          education_match_explanation: string | null
          education_match_score: number
          experience_match_explanation: string | null
          experience_match_score: number
          id: string
          job_id: string
          key_strengths: Json
          key_weaknesses: Json
          overall_recommendation: string | null
          overall_relevance_explanation: string | null
          overall_relevance_score: number
          processing_status: string
          ranking_tier: string
          resume_id: string
          scoring_timestamp: string | null
          skills_match_explanation: string | null
          skills_match_score: number
          weighted_score: number
        }
        Insert: {
          additional_notes?: string | null
          education_match_explanation?: string | null
          education_match_score: number
          experience_match_explanation?: string | null
          experience_match_score: number
          id?: string
          job_id: string
          key_strengths?: Json
          key_weaknesses?: Json
          overall_recommendation?: string | null
          overall_relevance_explanation?: string | null
          overall_relevance_score: number
          processing_status: string
          ranking_tier: string
          resume_id: string
          scoring_timestamp?: string | null
          skills_match_explanation?: string | null
          skills_match_score: number
          weighted_score: number
        }
        Update: {
          additional_notes?: string | null
          education_match_explanation?: string | null
          education_match_score?: number
          experience_match_explanation?: string | null
          experience_match_score?: number
          id?: string
          job_id?: string
          key_strengths?: Json
          key_weaknesses?: Json
          overall_recommendation?: string | null
          overall_relevance_explanation?: string | null
          overall_relevance_score?: number
          processing_status?: string
          ranking_tier?: string
          resume_id?: string
          scoring_timestamp?: string | null
          skills_match_explanation?: string | null
          skills_match_score?: number
          weighted_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "resume_scores_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_scores_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "parsed_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
