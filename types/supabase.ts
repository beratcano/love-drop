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
      courses: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          instructor_name: string | null
          match_probability: number | null
          title: string
          is_elective: boolean | null
          schedule: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_name?: string | null
          match_probability?: number | null
          title: string
          is_elective?: boolean | null
          schedule?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_name?: string | null
          match_probability?: number | null
          title?: string
          is_elective?: boolean | null
          schedule?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          course_id: string
          created_at: string
          id: number
          status: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: number
          status?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: number
          match_id: number
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: number
          match_id: number
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: number
          match_id?: number
          sender_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          department: string | null
          faculty: string | null
          term: string | null
          avatar_config: {
            skinColor: string
            eyeStyle: number
            noseStyle: number
            mouthStyle: number
            hairStyle: number
            hairColor: string
          } | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          department?: string | null
          faculty?: string | null
          term?: string | null
          avatar_config?: {
            skinColor: string
            eyeStyle: number
            noseStyle: number
            mouthStyle: number
            hairStyle: number
            hairColor: string
          } | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          department?: string | null
          faculty?: string | null
          term?: string | null
          avatar_config?: {
            skinColor: string
            eyeStyle: number
            noseStyle: number
            mouthStyle: number
            hairStyle: number
            hairColor: string
          } | null
        }
        Relationships: []
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

// Export type aliases for easier use
export type Course = Database["public"]["Tables"]["courses"]["Row"]
export type Match = Database["public"]["Tables"]["matches"]["Row"]
export type Message = Database["public"]["Tables"]["messages"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
