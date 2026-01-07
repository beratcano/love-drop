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
          credits: number
          day_of_week: string | null
          description: string | null
          end_time: string | null
          id: string
          image_url: string | null
          instructor_id: string | null
          is_elective: boolean | null
          match_probability: number | null
          start_time: string | null
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number
          day_of_week?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          is_elective?: boolean | null
          match_probability?: number | null
          start_time?: string | null
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number
          day_of_week?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          is_elective?: boolean | null
          match_probability?: number | null
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string | null
        }
        Insert: {
          id?: number
          match_id: number
          sender_id: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: number
          match_id?: number
          sender_id?: string
          content?: string
          created_at?: string | null
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
          is_student: boolean | null
          updated_at: string | null
          department: string | null
          faculty: string | null
          term: string | null
          avatar_config: {
            style: 'avataaars'
            seed: string
            eyes?: string
            eyebrows?: string
            mouth?: string
            top?: string
            hairColor?: string
            facialHair?: string
            facialHairColor?: string
            accessories?: string
            accessoriesColor?: string
            clothing?: string
            clothingColor?: string
            skinColor?: string
            backgroundColor?: string
          } | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_student?: boolean | null
          updated_at?: string | null
          department?: string | null
          faculty?: string | null
          term?: string | null
          avatar_config?: {
            style: 'avataaars'
            seed: string
            eyes?: string
            eyebrows?: string
            mouth?: string
            top?: string
            hairColor?: string
            facialHair?: string
            facialHairColor?: string
            accessories?: string
            accessoriesColor?: string
            clothing?: string
            clothingColor?: string
            skinColor?: string
            backgroundColor?: string
          } | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_student?: boolean | null
          updated_at?: string | null
          department?: string | null
          faculty?: string | null
          term?: string | null
          avatar_config?: {
            style: 'avataaars'
            seed: string
            eyes?: string
            eyebrows?: string
            mouth?: string
            top?: string
            hairColor?: string
            facialHair?: string
            facialHairColor?: string
            accessories?: string
            accessoriesColor?: string
            clothing?: string
            clothingColor?: string
            skinColor?: string
            backgroundColor?: string
          } | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      random_time: {
        Args: { end_hour: number; start_hour: number }
        Returns: string
      }
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

// Extended course type with instructor profile
export type CourseWithInstructor = Course & {
  instructor: Profile | null
}

// Helper to format schedule from course fields
export function formatSchedule(course: Course): string {
  if (!course.day_of_week || !course.start_time || !course.end_time) {
    return "Schedule not announced yet"
  }
  const startFormatted = course.start_time.slice(0, 5)
  const endFormatted = course.end_time.slice(0, 5)
  return `${course.day_of_week} ${startFormatted} - ${endFormatted}`
}
