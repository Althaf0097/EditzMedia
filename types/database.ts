export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string
                    id: number
                    name: string
                    type: string
                }
                Insert: {
                    created_at?: string
                    id?: number
                    name: string
                    type: string
                }
                Update: {
                    created_at?: string
                    id?: number
                    name?: string
                    type?: string
                }
                Relationships: []
            }
            media_assets: {
                Row: {
                    asset_type: string
                    category_id: number | null
                    created_at: string
                    description: string | null
                    file_url: string
                    format: string
                    id: string
                    is_recommended: boolean | null
                    title: string
                    uploader_id: string | null
                }
                Insert: {
                    asset_type: string
                    category_id?: number | null
                    created_at?: string
                    description?: string | null
                    file_url: string
                    format: string
                    id?: string
                    is_recommended?: boolean | null
                    title: string
                    uploader_id?: string | null
                }
                Update: {
                    asset_type?: string
                    category_id?: number | null
                    created_at?: string
                    description?: string | null
                    file_url?: string
                    format?: string
                    id?: string
                    is_recommended?: boolean | null
                    title?: string
                    uploader_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "media_assets_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "media_assets_uploader_id_fkey"
                        columns: ["uploader_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
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
